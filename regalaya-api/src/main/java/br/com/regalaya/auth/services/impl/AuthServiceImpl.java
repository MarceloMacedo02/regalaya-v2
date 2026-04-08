package br.com.regalaya.auth.services.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.ServletWebRequest;

import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.RevokedToken;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.dto.requests.ForgotPasswordRequest;
import br.com.regalaya.auth.dto.requests.LoginRequest;
import br.com.regalaya.auth.dto.requests.RegisterRequest;
import br.com.regalaya.auth.dto.requests.ResetPasswordRequest;
import br.com.regalaya.auth.dto.requests.ValidateEmailRequest;
import br.com.regalaya.auth.dto.requests.ValidateUsernameRequest;
import br.com.regalaya.auth.dto.responses.AuthResponse;
import br.com.regalaya.auth.dto.responses.PasswordResetResponse;
import br.com.regalaya.auth.dto.responses.UserResponse;
import br.com.regalaya.auth.dto.responses.ValidationResponse;
import br.com.regalaya.auth.exception.InvalidTokenException;
import br.com.regalaya.auth.exception.RateLimitExceededException;
import br.com.regalaya.auth.exception.UserAlreadyExistsException;
import br.com.regalaya.auth.infrastructure.audit.AuditService;
import br.com.regalaya.auth.infrastructure.audit.AuditService.AuditEvent;
import br.com.regalaya.auth.infrastructure.email.EmailService;
import br.com.regalaya.auth.infrastructure.jwt.JwtUtil;
import br.com.regalaya.auth.infrastructure.ratelimit.RateLimitService;
import br.com.regalaya.auth.mapper.UserMapper;
import br.com.regalaya.auth.repository.RevokedTokenRepository;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.shared.exception.BusinessException;
import br.com.regalaya.shared.exception.InvalidCredentialsException;
import br.com.regalaya.shared.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class AuthServiceImpl implements br.com.regalaya.auth.services.AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final RevokedTokenRepository revokedTokenRepository;
    private final EmailService emailService;
    private final ApplicationEventPublisher eventPublisher;
    private final RateLimitService rateLimitService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           UserMapper userMapper,
                           RevokedTokenRepository revokedTokenRepository,
                           EmailService emailService,
                           ApplicationEventPublisher eventPublisher,
                           RateLimitService rateLimitService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
        this.revokedTokenRepository = revokedTokenRepository;
        this.emailService = emailService;
        this.eventPublisher = eventPublisher;
        this.rateLimitService = rateLimitService;
    }

    @Override
    public AuthResponse register(RegisterRequest request, ServletWebRequest webRequest, Locale locale) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        if (!rateLimitService.tryConsume(ip, "register")) {
            throw new RateLimitExceededException("30");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("email", request.email());
        }

        User user = userMapper.toEntity(request);
        user.setVerificationToken(generateVerificationToken());
        User savedUser = userRepository.save(user);

        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getVerificationToken(), savedUser.getName(), locale, savedUser.isAdmin());
        emailService.sendAccountWelcomeEmail(savedUser.getEmail(), savedUser.getName(), locale, savedUser.isAdmin());

        Set<String> permissions = savedUser.getRole() != null
                ? savedUser.getRole().getPermissions()
                : Set.of();

        String accessToken = jwtUtil.generateAccessToken(
                savedUser.getId(),
                savedUser.getEmail(),
                permissions
        );
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getId());

        eventPublisher.publishEvent(AuditEvent.registerSuccess(savedUser.getId(), ip, ua));

        return new AuthResponse(
                accessToken,
                refreshToken,
                userMapper.toResponse(savedUser)
        );
    }

    @Override
    public AuthResponse login(LoginRequest request, ServletWebRequest webRequest) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        if (!rateLimitService.tryConsume(ip, "login")) {
            throw new RateLimitExceededException("15");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    eventPublisher.publishEvent(AuditEvent.loginFailed(request.email(), ip, ua));
                    return new InvalidCredentialsException();
                });

        if (!"ACTIVE".equals(user.getStatus())) {
            eventPublisher.publishEvent(AuditEvent.loginFailed(request.email(), ip, ua));
            throw new InvalidCredentialsException("Conta não está ativa");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            eventPublisher.publishEvent(AuditEvent.loginFailed(request.email(), ip, ua));
            throw new InvalidCredentialsException();
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        Set<String> permissions = user.getRole() != null
                ? user.getRole().getPermissions()
                : Set.of();

        String accessToken = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                permissions
        );
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        eventPublisher.publishEvent(AuditEvent.loginSuccess(user.getId(), ip, ua));

        return new AuthResponse(
                accessToken,
                refreshToken,
                userMapper.toResponse(user)
        );
    }

    @Override
    public void logout(String accessToken, ServletWebRequest webRequest) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        String jti = jwtUtil.getJtiFromToken(accessToken);
        UUID userId = jwtUtil.getUserIdFromToken(accessToken);
        LocalDateTime expiresAt = jwtUtil.getExpirationFromToken(accessToken);

        RevokedToken revokedToken = RevokedToken.builder()
                .jti(jti)
                .userId(userId)
                .tokenType("access")
                .expiresAt(expiresAt)
                .revokedAt(LocalDateTime.now())
                .revocationReason("User logout")
                .build();
        revokedTokenRepository.save(revokedToken);

        revokedTokenRepository.revokeAllUserTokens(userId);

        eventPublisher.publishEvent(AuditEvent.logout(userId, ip, ua));
    }

    @Override
    public PasswordResetResponse forgotPassword(ForgotPasswordRequest request, ServletWebRequest webRequest, Locale locale) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        if (!rateLimitService.tryConsume(ip, "forgot-password")) {
            throw new RateLimitExceededException("60");
        }

        userRepository.findByEmail(request.email()).ifPresent(user -> {
            user.setResetPasswordToken(generateResetPasswordToken());
            user.setResetPasswordExpiresAt(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getResetPasswordToken(), user.getName(), locale, user.isAdmin());

            eventPublisher.publishEvent(AuditEvent.passwordResetRequested(user.getId(), ip, ua));
        });

        return new PasswordResetResponse(
                "Se existir uma conta com este email, um token de recuperação foi enviado",
                request.email()
        );
    }

    @Override
    public PasswordResetResponse resetPassword(ResetPasswordRequest request, ServletWebRequest webRequest) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        if (!rateLimitService.tryConsume(ip, "reset-password")) {
            throw new RateLimitExceededException("60");
        }

        User user = userRepository.findByResetPasswordToken(request.token())
                .orElseThrow(() -> {
                    eventPublisher.publishEvent(AuditEvent.passwordResetFailed(null, ip, ua));
                    return new InvalidTokenException("Token inválido");
                });

        if (user.getResetPasswordExpiresAt() == null ||
                user.getResetPasswordExpiresAt().isBefore(LocalDateTime.now())) {
            eventPublisher.publishEvent(AuditEvent.passwordResetFailed(user.getEmail(), ip, ua));
            throw new InvalidTokenException("Token expirado");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiresAt(null);
        userRepository.save(user);

        eventPublisher.publishEvent(AuditEvent.passwordResetSuccess(user.getId(), ip, ua));

        return new PasswordResetResponse(
                "Senha alterada com sucesso",
                user.getEmail()
        );
    }

    @Override
    public ValidationResponse validateEmail(ValidateEmailRequest request, ServletWebRequest webRequest, Locale locale) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        if (!rateLimitService.tryConsume(ip, "validate-email")) {
            throw new RateLimitExceededException("60");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.email()));

        if (request.token().equals(user.getVerificationToken())) {
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            userRepository.save(user);

            eventPublisher.publishEvent(AuditEvent.emailVerified(user.getId(), ip, ua));

            return new ValidationResponse(true, "Email verificado com sucesso");
        }

        return new ValidationResponse(false, "Token de verificação inválido");
    }

    @Override
    public ValidationResponse validateUsername(ValidateUsernameRequest request) {
        boolean exists = userRepository.existsByEmail(request.username());
        return new ValidationResponse(!exists, exists ? "Email já em uso" : "Email disponível");
    }

    @Override
    public AuthResponse refreshToken(String refreshToken, ServletWebRequest webRequest) {
        String ip = extractIp(webRequest);
        String ua = extractUserAgent(webRequest);

        if (!rateLimitService.tryConsume(ip, "refresh-token")) {
            throw new RateLimitExceededException("60");
        }

        try {
            UUID userId = jwtUtil.validateRefreshToken(refreshToken);
            String jti = jwtUtil.getJtiFromToken(refreshToken);

            if (revokedTokenRepository.existsByJti(jti)) {
                throw new InvalidTokenException("Token revogado");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));

            Set<String> permissions = user.getRole() != null
                    ? user.getRole().getPermissions()
                    : Set.of();

            String newAccessToken = jwtUtil.generateAccessToken(
                    user.getId(),
                    user.getEmail(),
                    permissions
            );
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());

            eventPublisher.publishEvent(AuditEvent.tokenRefreshed(user.getId(), ip, ua));

            return new AuthResponse(
                    newAccessToken,
                    newRefreshToken,
                    userMapper.toResponse(user)
            );
        } catch (InvalidTokenException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidTokenException("Token de refresh inválido ou expirado");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        return userMapper.toResponse(user);
    }

    private String extractIp(ServletWebRequest webRequest) {
        if (webRequest == null) return "unknown";
        String xForwardedFor = webRequest.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return webRequest.getRequest().getRemoteAddr();
    }

    private String extractUserAgent(ServletWebRequest webRequest) {
        if (webRequest == null) return "unknown";
        String ua = webRequest.getHeader("User-Agent");
        return ua != null ? ua : "unknown";
    }

    private String generateVerificationToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String generateResetPasswordToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
