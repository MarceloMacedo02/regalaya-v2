package br.com.regalaya.cart.dto.responses;

import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
    UUID productId,
    String productName,
    String productImage,
    BigDecimal unitPrice,
    Integer quantity,
    BigDecimal subtotal
) {}
