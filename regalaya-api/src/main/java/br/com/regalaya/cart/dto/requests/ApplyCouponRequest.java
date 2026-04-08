package br.com.regalaya.cart.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record ApplyCouponRequest(
    @NotBlank(message = "Código do cupom é obrigatório")
    String code
) {}
