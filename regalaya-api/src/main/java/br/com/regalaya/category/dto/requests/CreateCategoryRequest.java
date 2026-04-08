package br.com.regalaya.category.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateCategoryRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    String name,

    @NotBlank(message = "Slug é obrigatório")
    @Size(max = 120, message = "Slug deve ter no máximo 120 caracteres")
    String slug,

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    String description,

    String imageUrl,

    UUID parentId,

    Integer sortOrder,

    Boolean isActive
) {}
