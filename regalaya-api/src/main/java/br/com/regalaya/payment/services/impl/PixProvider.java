package br.com.regalaya.payment.services.impl;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.payment.config.PaymentConfig;
import br.com.regalaya.payment.domain.model.Payment;
import br.com.regalaya.payment.dto.requests.PaymentIntentRequest;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;
import br.com.regalaya.payment.exception.PaymentProcessingException;
import br.com.regalaya.payment.services.ExternalPaymentProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * PIX Payment Provider - Simulated for development.
 * In production, integrate with Stripe or Mercado Pago PIX API.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PixProvider implements ExternalPaymentProvider {

    private final PaymentConfig paymentConfig;

    @Override
    public PaymentIntentResponse createPaymentIntent(PaymentIntentRequest request, Order order, Payment payment) {
        log.info("Creating PIX payment intent for order: {}", order.getOrderNumber());

        try {
            // Generate unique provider payment ID
            String providerPaymentId = "pix_" + UUID.randomUUID().toString().replace("-", "");

            // Simulated PIX data - in production, call Stripe/Mercado Pago API
            String pixCode = generatePixCode(providerPaymentId, order.getTotal());
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(paymentConfig.getPixExpirationMinutes());

            // Update payment with PIX data
            payment.setProviderPaymentId(providerPaymentId);
            payment.setQrCode(pixCode);
            payment.setQrCodeImage(""); // Base64 QR code image - would come from gateway
            payment.setCopyPasteCode(pixCode);
            payment.setExpiresAt(expiresAt);

            log.info("PIX payment intent created: {} expires at {}", providerPaymentId, expiresAt);

            return new PaymentIntentResponse(
                    providerPaymentId,
                    payment.getProvider(),
                    payment.getPaymentMethodType(),
                    pixCode,
                    "", // QR code image - would come from gateway
                    pixCode,
                    expiresAt,
                    null, // clientSecret not used for PIX
                    providerPaymentId,
                    order.getTotal(),
                    "pending"
            );

        } catch (Exception e) {
            log.error("Failed to create PIX payment intent", e);
            throw new PaymentProcessingException("Erro ao criar pagamento PIX: " + e.getMessage(), e);
        }
    }

    @Override
    public String checkPaymentStatus(String providerPaymentId) {
        // In production, query Stripe/Mercado Pago API
        // For development, return current status from DB
        log.debug("Checking PIX payment status: {}", providerPaymentId);
        return "pending";
    }

    @Override
    public String getProviderName() {
        return "STRIPE"; // Using Stripe as the gateway
    }

    @Override
    public boolean isAvailable() {
        return paymentConfig.getStripe().isEnabled();
    }

    /**
     * Generates a PIX EMV QR code string (used for both QR code and copy-paste).
     * In production, this comes from the payment gateway API.
     */
    private String generatePixCode(String providerPaymentId, BigDecimal amount) {
        String pixKey = providerPaymentId.substring(0, Math.min(33, providerPaymentId.length()));
        String amountStr = amount.setScale(2).toPlainString().replace(".", ",");

        return String.format(
                "00020126530014br.gov.bcb.pix0133%s5204000053039865405%s5802BR5925Regalaya Presentes Ltda6009SAO PAULO62070503***6304",
                pixKey, amountStr);
    }
}
