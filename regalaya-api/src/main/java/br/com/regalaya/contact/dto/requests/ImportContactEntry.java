package br.com.regalaya.contact.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ImportContactEntry(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    String name,

    String phone,

    String whatsappId
) {}
