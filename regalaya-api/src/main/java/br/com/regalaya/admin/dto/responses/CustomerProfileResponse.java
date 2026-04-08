package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record CustomerProfileResponse(
    UUID id,
    String name,
    String email,
    String phone,
    String photo, // URL da foto (opcional)
    LocalDate dateOfBirth,
    String segmentLabel,
    String segmentColor,
    CustomerMetricsResponse metrics,
    String plan,
    LocalDateTime createdAt
) {}