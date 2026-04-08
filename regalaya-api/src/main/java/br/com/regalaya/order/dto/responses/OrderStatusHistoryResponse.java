package br.com.regalaya.order.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record OrderStatusHistoryResponse(
    UUID id,
    String previousStatus,
    String newStatus,
    String changedBy,
    String reason,
    LocalDateTime changedAt
) {}