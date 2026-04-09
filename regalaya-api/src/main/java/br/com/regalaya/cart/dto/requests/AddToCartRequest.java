package br.com.regalaya.cart.dto.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddToCartRequest(
    @NotNull(message = "ID do produto é obrigatório")
    UUID productId,

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    Integer quantity,

    String giftMessage
) {}
