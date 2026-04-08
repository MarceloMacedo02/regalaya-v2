package br.com.regalaya.product.dto.requests;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CreateProductRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 200)
    String name,

    @NotBlank(message = "Slug é obrigatório")
    @Size(max = 220)
    String slug,

    @Size(max = 5000)
    String description,

    @Size(max = 500)
    String shortDescription,

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin("0.01")
    BigDecimal price,

    @DecimalMin("0.01")
    BigDecimal compareAtPrice,

    @Size(max = 50)
    String sku,

    @NotNull(message = "Estoque é obrigatório")
    @Min(0)
    Integer stock,

    @NotNull(message = "Categoria é obrigatória")
    UUID categoryId,

    List<String> images,

    Boolean isActive
) {}
