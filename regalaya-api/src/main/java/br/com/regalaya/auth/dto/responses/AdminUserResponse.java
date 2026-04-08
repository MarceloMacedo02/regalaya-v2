package br.com.regalaya.auth.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserResponse(
    UUID id,
    String name,
    String email,
    String phone,
    String role,
    String plan,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    long totalOrders,
    BigDecimal totalSpent
) {}
