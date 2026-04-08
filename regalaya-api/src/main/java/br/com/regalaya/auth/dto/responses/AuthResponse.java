package br.com.regalaya.auth.dto.responses;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    UserResponse user
) {}
