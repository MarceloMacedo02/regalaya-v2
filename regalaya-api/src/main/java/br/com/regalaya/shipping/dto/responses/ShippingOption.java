package br.com.regalaya.shipping.dto.responses;

import java.time.LocalDate;

public record ShippingOption(
    String carrier,
    String service,
    String description,
    double price,
    int estimatedDays,
    LocalDate estimatedDelivery,
    boolean isAvailable
) {}
