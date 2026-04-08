package br.com.regalaya.payment.dto.requests;

import br.com.regalaya.payment.domain.enums.PaymentMethodType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record PaymentIntentRequest(
    @NotNull(message = "Order ID é obrigatório")
    UUID orderId,

    @NotNull(message = "Método de pagamento é obrigatório")
    PaymentMethodType paymentMethod,

    String cardToken,

    @Positive(message = "Número de parcelas deve ser positivo")
    Integer installments,

    String idempotencyKey
) {}
