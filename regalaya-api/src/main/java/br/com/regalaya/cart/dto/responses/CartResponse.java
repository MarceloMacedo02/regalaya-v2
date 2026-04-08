package br.com.regalaya.cart.dto.responses;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartResponse(
    UUID userId,
    List<CartItemResponse> items,
    int itemCount,
    int totalQuantity,
    BigDecimal subtotal,
    BigDecimal shipping,
    BigDecimal discount,
    BigDecimal total,
    String couponCode,
    BigDecimal couponDiscount
) {}
