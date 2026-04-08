package br.com.regalaya.payment.services;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.payment.domain.model.Payment;
import br.com.regalaya.payment.dto.requests.PaymentIntentRequest;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;

/**
 * Interface for external payment gateway providers.
 */
public interface ExternalPaymentProvider {

    /**
     * Creates a payment intent with the external gateway
     */
    PaymentIntentResponse createPaymentIntent(PaymentIntentRequest request, Order order, Payment payment);

    /**
     * Checks payment status with the external gateway
     */
    String checkPaymentStatus(String providerPaymentId);

    /**
     * Returns the provider name (e.g., "STRIPE", "MERCADO_PAGO")
     */
    String getProviderName();

    /**
     * Health check
     */
    boolean isAvailable();
}
