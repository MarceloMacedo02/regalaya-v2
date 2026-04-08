package br.com.regalaya.contact.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateContactRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 200, message = "Nome deve ter entre 2 e 200 caracteres")
    String name,

    @Pattern(regexp = "\\d{10,11}", message = "Telefone deve ter 10 ou 11 dígitos")
    String phone,

    String whatsappId,

    Boolean consent
) {}
