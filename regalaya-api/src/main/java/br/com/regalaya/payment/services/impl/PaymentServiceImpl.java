package br.com.regalaya.payment.services.impl;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderStatus;
import br.com.regalaya.order.repository.OrderRepository;
import br.com.regalaya.payment.config.PaymentConfig;
import br.com.regalaya.payment.domain.enums.PaymentMethodType;
import br.com.regalaya.payment.domain.enums.PaymentProvider;
import br.com.regalaya.payment.domain.model.Payment;
import br.com.regalaya.payment.domain.model.WebhookLog;
import br.com.regalaya.payment.dto.requests.PaymentIntentRequest;
import br.com.regalaya.payment.dto.responses.InstallmentOption;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;
import br.com.regalaya.payment.dto.responses.PaymentStatusResponse;
import br.com.regalaya.payment.exception.InvalidWebhookSignatureException;
import br.com.regalaya.payment.exception.PaymentNotFoundException;
import br.com.regalaya.payment.exception.PaymentProcessingException;
import br.com.regalaya.payment.mapper.PaymentMapper;
import br.com.regalaya.payment.repository.PaymentRepository;
import br.com.regalaya.payment.repository.WebhookLogRepository;
import br.com.regalaya.payment.services.ExternalPaymentProvider;
import br.com.regalaya.payment.services.PaymentService;
import br.com.regalaya.payment.services.impl.CreditCardProvider;
import br.com.regalaya.payment.services.impl.PixProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final WebhookLogRepository webhookLogRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentConfig paymentConfig;
    private final PixProvider pixProvider;
    private final CreditCardProvider creditCardProvider;

    private Map<PaymentMethodType, ExternalPaymentProvider> providers;

    @jakarta.annotation.PostConstruct
    private void init() {
        providers = Map.of(
                PaymentMethodType.PIX, pixProvider,
                PaymentMethodType.CREDIT_CARD, creditCardProvider
        );
    }

    @Override
    @Transactional
    public PaymentIntentResponse createPaymentIntent(UUID userId, PaymentIntentRequest request) {
        log.info("Creating payment intent for user: {} order: {}", userId, request.orderId());

        // 1. Validate order exists and belongs to user
        Order order = orderRepository.findByIdAndUserId(request.orderId(), userId)
                .orElseThrow(() -> new PaymentNotFoundException(request.orderId()));

        // 2. Validate order is in PENDING status
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new PaymentProcessingException("Pedido não está mais pendente. Status: " + order.getStatus());
        }

        // 3. Check for existing payment
        var existingPayment = paymentRepository.findByOrderId(order.getId());
        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            if (payment.isPaid()) {
                throw new PaymentProcessingException("Pedido já foi pago");
            }
            // Reuse existing payment record
            return processPaymentIntent(request, order, payment);
        }

        // 4. Create new payment record
        Payment payment = Payment.builder()
                .provider(br.com.regalaya.payment.domain.enums.PaymentProvider.STRIPE)
                .paymentMethodType(request.paymentMethod())
                .status("pending")
                .amount(order.getTotal())
                .order(order)
                .idempotencyKey(request.idempotencyKey())
                .build();

        return processPaymentIntent(request, order, payment);
    }

    private PaymentIntentResponse processPaymentIntent(PaymentIntentRequest request, Order order, Payment payment) {
        ExternalPaymentProvider provider = getProvider(request.paymentMethod());

        PaymentIntentResponse response = provider.createPaymentIntent(request, order, payment);

        paymentRepository.save(payment);

        // Update order payment info
        order.setPaymentMethod(request.paymentMethod().name());
        order.setPaymentStatus("pending");
        orderRepository.save(order);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentStatusResponse getPaymentStatus(UUID orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException(orderId));

        return paymentMapper.toStatusResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstallmentOption> calculateInstallments(BigDecimal total) {
        return creditCardProvider.calculateInstallments(total);
    }

    @Override
    @Transactional
    public void handleWebhook(String provider, String eventType, String providerEventId, String payload) {
        log.info("Received webhook from {}: event={} id={}", provider, eventType, providerEventId);

        // 1. Log webhook
        WebhookLog webhookLog = WebhookLog.builder()
                .provider(provider)
                .eventType(eventType)
                .providerEventId(providerEventId)
                .payload(payload)
                .processingStatus("processing")
                .receivedAt(LocalDateTime.now())
                .build();
        webhookLogRepository.save(webhookLog);

        try {
            // 2. Idempotency check
            if (webhookLogRepository.existsByProviderEventId(providerEventId)) {
                log.warn("Duplicate webhook event: {}", providerEventId);
                webhookLog.setProcessingStatus("duplicate");
                webhookLogRepository.save(webhookLog);
                return;
            }

            // 3. Find payment
            Payment payment = paymentRepository.findByProviderPaymentIdWithOrder(providerEventId)
                    .orElseThrow(() -> new PaymentNotFoundException("Payment not found for provider ID: " + providerEventId));

            // 4. Process event
            switch (eventType) {
                case "payment_intent.succeeded", "payment.paid" -> handlePaymentSuccess(payment, webhookLog);
                case "payment_intent.payment_failed", "payment.failed" -> handlePaymentFailure(payment, webhookLog, "Pagamento recusado pelo gateway");
                case "payment_intent.expired", "payment.expired" -> handlePaymentExpired(payment, webhookLog);
                default -> {
                    log.warn("Unhandled webhook event: {}", eventType);
                    webhookLog.setProcessingStatus("ignored");
                }
            }

            webhookLog.setProcessedAt(LocalDateTime.now());
            webhookLogRepository.save(webhookLog);

        } catch (Exception e) {
            log.error("Error processing webhook: {}", eventType, e);
            webhookLog.setProcessingStatus("error");
            webhookLog.setErrorMessage(e.getMessage());
            webhookLogRepository.save(webhookLog);
        }
    }

    private void handlePaymentSuccess(Payment payment, WebhookLog webhookLog) {
        log.info("Payment succeeded: {}", payment.getProviderPaymentId());

        payment.setStatus("paid");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus(OrderStatus.PROCESSING);
        order.setPaymentStatus("paid");
        orderRepository.save(order);

        webhookLog.setProcessingStatus("success");
    }

    private void handlePaymentFailure(Payment payment, WebhookLog webhookLog, String reason) {
        log.warn("Payment failed: {} - {}", payment.getProviderPaymentId(), reason);

        payment.setStatus("failed");
        payment.setFailureReason(reason);
        paymentRepository.save(payment);

        // Order stays PENDING - user can retry
        Order order = payment.getOrder();
        order.setPaymentStatus("failed");
        orderRepository.save(order);

        webhookLog.setProcessingStatus("success");
    }

    private void handlePaymentExpired(Payment payment, WebhookLog webhookLog) {
        log.info("Payment expired: {}", payment.getProviderPaymentId());

        payment.setStatus("expired");
        paymentRepository.save(payment);

        webhookLog.setProcessingStatus("success");
    }

    @Override
    @Transactional
    public int processExpiredPixPayments() {
        log.info("Processing expired PIX payments");

        List<Payment> expiredPayments = paymentRepository.findExpiredPixPayments(LocalDateTime.now());

        if (expiredPayments.isEmpty()) {
            log.debug("No expired PIX payments found");
            return 0;
        }

        int count = 0;
        for (Payment payment : expiredPayments) {
            if ("pending".equals(payment.getStatus())) {
                payment.setStatus("expired");
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setPaymentStatus("expired");
                orderRepository.save(order);

                count++;
                log.info("Marked PIX payment as expired: {}", payment.getProviderPaymentId());
            }
        }

        log.info("Processed {} expired PIX payments", count);
        return count;
    }

    private ExternalPaymentProvider getProvider(PaymentMethodType methodType) {
        return switch (methodType) {
            case PIX -> pixProvider;
            case CREDIT_CARD -> creditCardProvider;
            case DEBIT_CARD -> creditCardProvider; // Same provider for now
            default -> throw new PaymentProcessingException("Método de pagamento não suportado: " + methodType);
        };
    }
}
