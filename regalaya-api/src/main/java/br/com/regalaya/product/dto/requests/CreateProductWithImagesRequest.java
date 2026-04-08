package br.com.regalaya.product.dto.requests;

import java.util.List;

/**
 * Request para criar/atualizar produto com imagens opcionais
 */
public record CreateProductWithImagesRequest(
    String name,
    String slug,
    String description,
    String shortDescription,
    java.math.BigDecimal price,
    java.math.BigDecimal compareAtPrice,
    String sku,
    Integer stock,
    java.util.UUID categoryId,
    List<String> images,
    Boolean isActive
) {
    /**
     * Converte para CreateProductRequest (mantém compatibilidade)
     */
    public CreateProductRequest toCreateProductRequest() {
        return new CreateProductRequest(
            name, slug, description, shortDescription,
            price, compareAtPrice, sku, stock, categoryId, images, isActive
        );
    }
}