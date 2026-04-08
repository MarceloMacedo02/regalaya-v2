package br.com.regalaya.payment.dto.responses;

import br.com.regalaya.payment.domain.enums.PaymentMethodType;
import br.com.regalaya.payment.domain.enums.PaymentProvider;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentIntentResponse(
    String providerPaymentId,
    PaymentProvider provider,
    PaymentMethodType paymentMethod,
    String qrCode,
    String qrCodeImage,
    String copyPasteCode,
    LocalDateTime expiresAt,
    String clientSecret,
    String paymentIntentId,
    BigDecimal amount,
    String status
) {}
