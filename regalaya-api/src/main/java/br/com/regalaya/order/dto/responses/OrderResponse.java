package br.com.regalaya.order.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record OrderResponse(
    UUID id,
    String orderNumber,
    String customerName,
    String customerEmail,
    UUID userId,
    String userPlan,
    BigDecimal total,
    String status,
    String paymentStatus,
    LocalDateTime createdAt,
    int itemCount
) {}
