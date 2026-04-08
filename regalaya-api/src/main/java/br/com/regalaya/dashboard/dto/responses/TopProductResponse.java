package br.com.regalaya.dashboard.dto.responses;

import java.math.BigDecimal;

public record TopProductResponse(
    String productId,
    String productName,
    Long unitsSold,
    BigDecimal revenue
) {}
