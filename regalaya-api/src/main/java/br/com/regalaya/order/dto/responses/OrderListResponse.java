package br.com.regalaya.order.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record OrderListResponse(
    UUID id,
    String orderNumber,
    String customerName,
    String customerEmail,
    String customerPhone,
    BigDecimal total,
    String status,
    String paymentMethod,
    LocalDateTime createdAt,
    int itemsCount
) {}