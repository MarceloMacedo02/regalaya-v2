package br.com.regalaya.order.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderDetailResponse(
    UUID id,
    String orderNumber,
    String customerName,
    String customerEmail,
    String customerPhone,
    BigDecimal total,
    String status,
    String paymentStatus,
    LocalDateTime createdAt,
    int itemCount,
    String shippingAddress,
    String notes,
    String trackingCode,
    List<OrderItemResponse> orderItems,
    BigDecimal subtotal,
    BigDecimal shipping,
    BigDecimal discount,
    // Campos adicionais para HU-07.2
    String paymentMethod,
    String transactionId,
    LocalDateTime paidAt,
    String customerHistory, // histórico de pedidos anteriores
    String trackingUrl,
    List<OrderStatusHistoryResponse> statusHistory
) {}
