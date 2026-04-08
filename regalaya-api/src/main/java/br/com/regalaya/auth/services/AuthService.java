package br.com.regalaya.auth.services;

import java.util.Locale;
import java.util.UUID;

import org.springframework.web.context.request.ServletWebRequest;

import br.com.regalaya.auth.dto.requests.*;
import br.com.regalaya.auth.dto.responses.*;
import br.com.regalaya.auth.domain.model.User;

public interface AuthService {

    AuthResponse register(RegisterRequest request, ServletWebRequest webRequest, Locale locale);

    AuthResponse login(LoginRequest request, ServletWebRequest webRequest);

    void logout(String accessToken, ServletWebRequest webRequest);

    PasswordResetResponse forgotPassword(ForgotPasswordRequest request, ServletWebRequest webRequest, Locale locale);

    PasswordResetResponse resetPassword(ResetPasswordRequest request, ServletWebRequest webRequest);

    ValidationResponse validateEmail(ValidateEmailRequest request, ServletWebRequest webRequest, Locale locale);

    ValidationResponse validateUsername(ValidateUsernameRequest request);

    AuthResponse refreshToken(String refreshToken, ServletWebRequest webRequest);

    UserResponse getCurrentUser(UUID userId);
}
