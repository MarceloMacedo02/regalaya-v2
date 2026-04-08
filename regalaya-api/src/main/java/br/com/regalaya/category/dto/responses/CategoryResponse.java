package br.com.regalaya.category.dto.responses;

import java.util.UUID;

public record CategoryResponse(
    UUID id,
    String name,
    String slug,
    String description,
    String imageUrl,
    UUID parentId,
    Integer sortOrder,
    Boolean isActive,
    Long productCount
) {}
