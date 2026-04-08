package br.com.regalaya.auth.dto.responses;

import java.time.LocalDateTime;

public record TokenRefreshResponse(
    String accessToken,
    String tokenType,
    LocalDateTime expiresIn,
    String refreshToken
) {}
