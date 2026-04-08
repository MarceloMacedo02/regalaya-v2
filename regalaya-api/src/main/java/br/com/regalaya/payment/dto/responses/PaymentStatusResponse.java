package br.com.regalaya.payment.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentStatusResponse(
    String paymentId,
    String status,
    String provider,
    String paymentMethod,
    LocalDateTime paidAt,
    LocalDateTime expiresAt,
    BigDecimal amount,
    String failureReason
) {}
