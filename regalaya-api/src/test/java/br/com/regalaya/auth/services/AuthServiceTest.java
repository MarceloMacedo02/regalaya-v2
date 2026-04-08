package br.com.regalaya.auth.services;

import java.util.Optional;
import java.util.UUID;
import java.util.Locale;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.web.context.request.ServletWebRequest;
import jakarta.servlet.http.HttpServletRequest;

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
import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.infrastructure.jwt.JwtUtil;
import br.com.regalaya.auth.mapper.UserMapper;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.auth.exception.UserAlreadyExistsException;
import br.com.regalaya.auth.exception.InvalidTokenException;
import br.com.regalaya.shared.exception.InvalidCredentialsException;
import br.com.regalaya.shared.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import br.com.regalaya.auth.services.impl.AuthServiceImpl;
import br.com.regalaya.auth.infrastructure.ratelimit.RateLimitService;
import br.com.regalaya.auth.infrastructure.audit.AuditService;
import br.com.regalaya.auth.infrastructure.email.EmailService;
import br.com.regalaya.auth.repository.RevokedTokenRepository;
import org.springframework.context.ApplicationEventPublisher;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserMapper userMapper;

    @Mock
    private ServletWebRequest webRequest;

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private RateLimitService rateLimitService;

    @Mock
    private AuditService auditService;

    @Mock
    private EmailService emailService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private RevokedTokenRepository revokedTokenRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    private final Locale locale = Locale.of("pt", "BR");

    private final UUID TEST_USER_ID = UUID.randomUUID();
    private final String TEST_EMAIL = "test@example.com";
    private final String TEST_PASSWORD = "Password123";

    @BeforeEach
    void setUp() {
        when(webRequest.getRequest()).thenReturn(httpRequest);
        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        when(rateLimitService.tryConsume(anyString(), anyString())).thenReturn(true);
    }

    @Test
    void register_WhenEmailDoesNotExist_ShouldCreateUser() {
        // Given
        RegisterRequest request = new RegisterRequest(
            "Test User",
            TEST_EMAIL,
            TEST_PASSWORD,
            null // phone optional
        );

        User user = new User();
        user.setId(TEST_USER_ID);
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setRole(Role.USER);
        user.setPassword("encoded_password");

        User savedUser = user;
        UserResponse userResponse = new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole().name(),
            savedUser.getPhone(),
            savedUser.getCreatedAt(),
            savedUser.getUpdatedAt()
        );

        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);
        when(userMapper.toEntity(request)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(savedUser);
        when(userMapper.toResponse(savedUser)).thenReturn(userResponse);
        when(jwtUtil.generateAccessToken(eq(TEST_USER_ID), eq(TEST_EMAIL), any()))
            .thenReturn("access_token");
        when(jwtUtil.generateRefreshToken(TEST_USER_ID)).thenReturn("refresh_token");

        // When
        AuthResponse response = authService.register(request, webRequest, locale);

        // Then
        assertNotNull(response);
        assertEquals("access_token", response.accessToken());
        assertEquals("refresh_token", response.refreshToken());
        assertEquals(TEST_USER_ID, response.user().id());
        assertEquals(TEST_EMAIL, response.user().email());
        verify(userRepository).save(savedUser);
    }

    @Test
    void register_WhenEmailAlreadyExists_ShouldThrowException() {
        // Given
        RegisterRequest request = new RegisterRequest(
            "Test User",
            TEST_EMAIL,
            TEST_PASSWORD,
            null
        );

        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(true);

        // When & Then
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(request, webRequest, locale));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnAuthResponse() {
        // Given
        LoginRequest request = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);

        User user = new User();
        user.setId(TEST_USER_ID);
        user.setName("Test User");
        user.setEmail(TEST_EMAIL);
        user.setPassword("$2a$10$encodedpassword123");
        user.setRole(Role.USER);
        user.setStatus("ACTIVE");

        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getPhone(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(TEST_PASSWORD, user.getPassword())).thenReturn(true);
        when(userMapper.toResponse(user)).thenReturn(userResponse);
        when(jwtUtil.generateAccessToken(eq(TEST_USER_ID), eq(TEST_EMAIL), any()))
            .thenReturn("access_token");
        when(jwtUtil.generateRefreshToken(TEST_USER_ID)).thenReturn("refresh_token");

        // When
        AuthResponse response = authService.login(request, webRequest);

        // Then
        assertNotNull(response);
        assertEquals("access_token", response.accessToken());
        assertEquals("refresh_token", response.refreshToken());
        assertEquals(TEST_USER_ID, response.user().id());
        verify(userRepository).save(user); // lastLoginAt updated
    }

    @Test
    void login_WithInvalidPassword_ShouldThrowException() {
        // Given
        LoginRequest request = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);

        User user = new User();
        user.setEmail(TEST_EMAIL);
        user.setPassword("$2a$10$differentpassword");
        user.setStatus("ACTIVE");

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(TEST_PASSWORD, user.getPassword())).thenReturn(false);

        // When & Then
        assertThrows(InvalidCredentialsException.class, () -> authService.login(request, webRequest));
    }

    @Test
    void forgotPassword_WhenUserExists_ShouldReturnResetResponse() {
        // Given
        ForgotPasswordRequest request = new ForgotPasswordRequest(TEST_EMAIL);

        User user = new User();
        user.setEmail(TEST_EMAIL);
        user.setResetPasswordToken("reset_token");
        user.setResetPasswordExpiresAt(java.time.LocalDateTime.now().plusHours(1));

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        // When
        PasswordResetResponse response = authService.forgotPassword(request, webRequest, locale);

        // Then
        assertNotNull(response);
        assertEquals(TEST_EMAIL, response.email());
        assertNotNull(user.getResetPasswordToken());
        assertNotNull(user.getResetPasswordExpiresAt());
    }

    @Test
    void resetPassword_WithValidToken_ShouldUpdatePassword() {
        // Given
        String token = "valid_reset_token";
        String newPassword = "NewPassword123";
        ResetPasswordRequest request = new ResetPasswordRequest(
            token, newPassword
        );

        User user = new User();
        user.setEmail(TEST_EMAIL);
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiresAt(java.time.LocalDateTime.now().plusHours(1));
        user.setPassword("old_encoded_password");

        when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn("new_encoded_password");
        when(userRepository.save(user)).thenReturn(user);

        // When
        PasswordResetResponse response = authService.resetPassword(request, webRequest);

        // Then
        assertNotNull(response);
        assertEquals(TEST_EMAIL, response.email());
        assertEquals("new_encoded_password", user.getPassword());
        assertNull(user.getResetPasswordToken());
        assertNull(user.getResetPasswordExpiresAt());
    }

    @Test
    void validateEmail_WithValidToken_ShouldActivateAccount() {
        // Given
        String token = "email_verification_token";
        ValidateEmailRequest request = new ValidateEmailRequest(TEST_EMAIL, token);

        User user = new User();
        user.setEmail(TEST_EMAIL);
        user.setVerificationToken(token);
        user.setEmailVerified(false);

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        // When
        ValidationResponse response = authService.validateEmail(request, webRequest, locale);

        // Then
        assertTrue(response.valid());
        assertEquals(Boolean.TRUE, user.getEmailVerified());
        assertNull(user.getVerificationToken());
    }

    @Test
    void validateUsername_WhenEmailAvailable_ShouldReturnValid() {
        // Given
        ValidateUsernameRequest request = new ValidateUsernameRequest(TEST_EMAIL);
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);

        // When
        ValidationResponse response = authService.validateUsername(request);

        // Then
        assertTrue(response.valid());
    }

    @Test
    void validateUsername_WhenEmailExists_ShouldReturnInvalid() {
        // Given
        ValidateUsernameRequest request = new ValidateUsernameRequest(TEST_EMAIL);
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(true);

        // When
        ValidationResponse response = authService.validateUsername(request);

        // Then
        assertFalse(response.valid());
    }

    @Test
    void refreshToken_WithValidToken_ShouldReturnAuthResponse() {
        // Given
        String refreshToken = "valid_refresh_token";
        User user = new User();
        user.setId(TEST_USER_ID);
        user.setName("Test User");
        user.setEmail(TEST_EMAIL);
        user.setRole(Role.USER);
        user.setPhone(null);

        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getPhone(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );

        when(jwtUtil.validateRefreshToken(refreshToken)).thenReturn(TEST_USER_ID);
        when(jwtUtil.getJtiFromToken(refreshToken)).thenReturn("test-jti");
        when(revokedTokenRepository.existsByJti("test-jti")).thenReturn(false);
        when(userRepository.findById(TEST_USER_ID)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(userResponse);
        when(jwtUtil.generateAccessToken(eq(TEST_USER_ID), eq(TEST_EMAIL), any()))
            .thenReturn("new_access_token");
        when(jwtUtil.generateRefreshToken(TEST_USER_ID)).thenReturn("new_refresh_token");

        // When
        AuthResponse response = authService.refreshToken(refreshToken, webRequest);

        // Then
        assertNotNull(response);
        assertEquals("new_access_token", response.accessToken());
        assertEquals("new_refresh_token", response.refreshToken());
        assertEquals(TEST_USER_ID, response.user().id());
    }

    @Test
    void refreshToken_WithInvalidToken_ShouldThrowException() {
        // Given
        String refreshToken = "invalid_token";
        when(jwtUtil.validateRefreshToken(refreshToken)).thenThrow(new InvalidTokenException());

        // When & Then
        assertThrows(InvalidTokenException.class, () -> authService.refreshToken(refreshToken, webRequest));
    }

    @Test
    void getCurrentUser_WhenUserExists_ShouldReturnUserResponse() {
        // Given
        User user = new User();
        user.setId(TEST_USER_ID);
        user.setName("Test User");
        user.setEmail(TEST_EMAIL);
        user.setRole(Role.USER);
        user.setPhone(null);

        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getPhone(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );

        when(userRepository.findById(TEST_USER_ID)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        // When
        UserResponse response = authService.getCurrentUser(TEST_USER_ID);

        // Then
        assertNotNull(response);
        assertEquals(TEST_USER_ID, response.id());
        assertEquals(TEST_EMAIL, response.email());
    }

    @Test
    void getCurrentUser_WhenUserNotFound_ShouldThrowException() {
        // Given
        when(userRepository.findById(TEST_USER_ID)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class,
            () -> authService.getCurrentUser(TEST_USER_ID));
    }
}
