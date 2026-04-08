package br.com.regalaya.auth.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ValidateEmailRequest(
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "Token de verificação é obrigatório")
    String token
) {}
