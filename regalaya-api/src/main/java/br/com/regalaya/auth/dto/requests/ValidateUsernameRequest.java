package br.com.regalaya.auth.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record ValidateUsernameRequest(
    @NotBlank(message = "Username é obrigatório")
    String username
) {}
