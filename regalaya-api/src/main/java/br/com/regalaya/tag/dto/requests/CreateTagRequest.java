package br.com.regalaya.tag.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTagRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    String name,

    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    String description
) {}
