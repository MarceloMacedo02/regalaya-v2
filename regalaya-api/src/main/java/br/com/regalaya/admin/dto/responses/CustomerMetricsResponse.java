package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerMetricsResponse(
    BigDecimal ltv, // Lifetime Value
    BigDecimal averageOrderValue,
    Integer totalOrders,
    Integer purchaseFrequency, // compras por mês (média)
    LocalDate lastPurchaseDate,
    Integer daysSinceLastPurchase,
    String favoriteCategory,
    BigDecimal categorySpentPercentage,
    CustomerSegmentResponse segment,
    Boolean isActive
) {}