package br.com.regalaya.order.dto.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateOrderItemRequest(
    @NotNull(message = "ID do produto é obrigatório")
    UUID productId,

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    Integer quantity
) {}
