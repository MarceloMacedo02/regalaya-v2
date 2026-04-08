package br.com.regalaya.product.dto.responses;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    String name,
    String slug,
    String description,
    String shortDescription,
    BigDecimal price,
    BigDecimal compareAtPrice,
    String sku,
    Integer stock,
    Boolean isActive,
    List<String> images,
    UUID categoryId,
    String categoryName
) {}
