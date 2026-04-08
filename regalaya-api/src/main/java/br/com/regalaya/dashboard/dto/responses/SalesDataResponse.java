package br.com.regalaya.dashboard.dto.responses;

import java.math.BigDecimal;

public record SalesDataResponse(
    String date,
    BigDecimal revenue,
    Long orders
) {}
