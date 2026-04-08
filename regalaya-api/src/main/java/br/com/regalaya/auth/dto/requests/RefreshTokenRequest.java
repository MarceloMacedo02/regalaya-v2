package br.com.regalaya.auth.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
    @NotBlank(message = "Refresh token é obrigatório")
    String refreshToken
) {}
