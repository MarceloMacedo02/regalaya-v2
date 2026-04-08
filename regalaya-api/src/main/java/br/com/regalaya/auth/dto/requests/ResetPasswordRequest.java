package br.com.regalaya.auth.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record ResetPasswordRequest(
    @NotBlank(message = "Token é obrigatório")
    String token,

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Senha deve conter letra maiúscula, minúscula e número")
    String newPassword
) {
}
