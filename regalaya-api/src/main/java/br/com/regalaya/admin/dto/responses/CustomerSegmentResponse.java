package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;

public record CustomerSegmentResponse(
    String segment, // VIP, NEW, INACTIVE, REGULAR
    String label,
    String color, // hex code
    String description,
    BigDecimal thresholdValue,
    Integer thresholdMonths
) {}