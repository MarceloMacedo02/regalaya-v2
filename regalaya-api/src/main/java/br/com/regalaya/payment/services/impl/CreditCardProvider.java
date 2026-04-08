package br.com.regalaya.payment.services.impl;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.payment.config.PaymentConfig;
import br.com.regalaya.payment.domain.model.Payment;
import br.com.regalaya.payment.dto.requests.PaymentIntentRequest;
import br.com.regalaya.payment.dto.responses.InstallmentOption;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;
import br.com.regalaya.payment.exception.PaymentProcessingException;
import br.com.regalaya.payment.services.ExternalPaymentProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Credit Card Payment Provider - Simulated for development.
 * In production, integrate with Stripe Payment Intents API.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreditCardProvider implements ExternalPaymentProvider {

    private final PaymentConfig paymentConfig;

    @Override
    public PaymentIntentResponse createPaymentIntent(PaymentIntentRequest request, Order order, Payment payment) {
        log.info("Creating Credit Card payment intent for order: {}", order.getOrderNumber());

        try {
            String providerPaymentId = "cc_" + UUID.randomUUID().toString().replace("-", "");

            // In production, call Stripe API to create PaymentIntent
            // For development, generate a simulated clientSecret
            String clientSecret = "pi_" + providerPaymentId + "_secret_" + UUID.randomUUID().toString().substring(0, 16);

            int installments = request.installments() != null ? request.installments() : 1;

            // Update payment
            payment.setProviderPaymentId(providerPaymentId);
            payment.setClientSecret(clientSecret);
            payment.setInstallments(installments);

            log.info("Credit Card payment intent created: {} with {} installments", providerPaymentId, installments);

            return new PaymentIntentResponse(
                    providerPaymentId,
                    payment.getProvider(),
                    payment.getPaymentMethodType(),
                    null,
                    null,
                    null,
                    null,
                    clientSecret,
                    providerPaymentId,
                    order.getTotal(),
                    "requires_confirmation"
            );

        } catch (Exception e) {
            log.error("Failed to create Credit Card payment intent", e);
            throw new PaymentProcessingException("Erro ao criar pagamento com cartão: " + e.getMessage(), e);
        }
    }

    @Override
    public String checkPaymentStatus(String providerPaymentId) {
        log.debug("Checking Credit Card payment status: {}", providerPaymentId);
        return "pending";
    }

    @Override
    public String getProviderName() {
        return "STRIPE";
    }

    @Override
    public boolean isAvailable() {
        return paymentConfig.getStripe().isEnabled();
    }

    /**
     * Calculates installment options with interest rates.
     */
    public List<InstallmentOption> calculateInstallments(BigDecimal total) {
        List<InstallmentOption> options = new ArrayList<>();
        int maxInstallments = paymentConfig.getMaxInstallments();
        double minInstallmentValue = paymentConfig.getMinInstallmentValue();
        double monthlyRate = paymentConfig.getInstallmentInterestRate();

        for (int i = 1; i <= maxInstallments; i++) {
            BigDecimal installmentValue;
            BigDecimal totalWithInterest;
            boolean hasInterest;

            if (i == 1) {
                // Single payment - no interest
                installmentValue = total;
                totalWithInterest = total;
                hasInterest = false;
            } else if (i <= 2) {
                // Up to 2 installments - no interest (common practice)
                installmentValue = total.divide(BigDecimal.valueOf(i), 2, RoundingMode.HALF_UP);
                totalWithInterest = total;
                hasInterest = false;
            } else {
                // Apply compound interest
                double factor = Math.pow(1 + monthlyRate, i - 1);
                totalWithInterest = total.multiply(BigDecimal.valueOf(factor)).setScale(2, RoundingMode.HALF_UP);
                installmentValue = totalWithInterest.divide(BigDecimal.valueOf(i), 2, RoundingMode.HALF_UP);
                hasInterest = true;
            }

            // Skip if installment value is below minimum
            if (installmentValue.compareTo(BigDecimal.valueOf(minInstallmentValue)) < 0) {
                break;
            }

            options.add(new InstallmentOption(
                    i,
                    installmentValue,
                    totalWithInterest,
                    hasInterest,
                    monthlyRate
            ));
        }

        return options;
    }
}
