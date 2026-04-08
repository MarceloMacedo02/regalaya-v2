package br.com.regalaya.payment.services;

import br.com.regalaya.payment.dto.requests.PaymentIntentRequest;
import br.com.regalaya.payment.dto.responses.InstallmentOption;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;
import br.com.regalaya.payment.dto.responses.PaymentStatusResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PaymentService {

    /**
     * Creates a payment intent for the given order
     */
    PaymentIntentResponse createPaymentIntent(UUID userId, PaymentIntentRequest request);

    /**
     * Gets payment status for an order
     */
    PaymentStatusResponse getPaymentStatus(UUID orderId);

    /**
     * Calculates installment options for a given total
     */
    List<InstallmentOption> calculateInstallments(BigDecimal total);

    /**
     * Handles webhook notification from payment provider
     */
    void handleWebhook(String provider, String eventType, String providerEventId, String payload);

    /**
     * Processes expired PIX payments
     */
    int processExpiredPixPayments();
}
