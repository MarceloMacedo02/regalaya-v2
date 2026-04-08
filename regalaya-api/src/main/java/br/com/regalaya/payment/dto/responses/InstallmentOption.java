package br.com.regalaya.payment.dto.responses;

import java.math.BigDecimal;

public record InstallmentOption(
    int installments,
    BigDecimal installmentValue,
    BigDecimal totalWithInterest,
    boolean hasInterest,
    double interestRate
) {}
