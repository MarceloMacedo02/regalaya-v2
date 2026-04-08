package br.com.regalaya.order.dto.responses;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
    UUID id,
    String productName,
    String productSku,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal total,
    String imageUrl
) {}
