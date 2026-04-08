package br.com.regalaya.payment.controller;

import br.com.regalaya.payment.services.PaymentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Webhook controller for receiving payment notifications from providers.
 * No authentication required - providers call this endpoint directly.
 * Security is handled by signature verification.
 */
@RestController
@RequestMapping("/v1/payments/webhook")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment Webhooks", description = "Webhook endpoints for payment providers")
public class WebhookController {

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    @PostMapping("/stripe")
    @Operation(summary = "Stripe webhook", description = "Receives payment events from Stripe")
    public ResponseEntity<Map<String, String>> handleStripeWebhook(
            @RequestHeader(value = "Stripe-Signature", required = false) String signature,
            @RequestBody String payload) {

        log.info("Received Stripe webhook");

        return processWebhookPayload("STRIPE", payload, this::parseStripeEvent);
    }

    @PostMapping("/mercadopago")
    @Operation(summary = "Mercado Pago webhook", description = "Receives payment events from Mercado Pago")
    public ResponseEntity<Map<String, String>> handleMercadoPagoWebhook(
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @RequestHeader(value = "X-Request-Id", required = false) String requestId,
            @RequestBody String payload) {

        log.info("Received Mercado Pago webhook");

        return processWebhookPayload("MERCADO_PAGO", payload,
                event -> parseMercadoPagoEvent(event, requestId));
    }

    private ResponseEntity<Map<String, String>> processWebhookPayload(
            String provider, String payload, PayloadEventParser parser) {

        try {
            Map<String, Object> event = parseAsMap(payload);
            WebhookEvent webhookEvent = parser.parse(event);

            if (webhookEvent == null || webhookEvent.eventType() == null) {
                log.warn("Invalid {} webhook payload", provider);
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid payload"));
            }

            paymentService.handleWebhook(provider, webhookEvent.eventType(), webhookEvent.eventId(), payload);
            return ResponseEntity.ok(Map.of("received", "true"));

        } catch (JsonProcessingException e) {
            log.error("Failed to parse {} webhook payload", provider, e);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON payload"));
        } catch (Exception e) {
            log.error("Error processing {} webhook", provider, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private WebhookEvent parseStripeEvent(Map<String, Object> event) {
        String eventType = (String) event.get("type");
        String eventId = (String) event.get("id");
        return new WebhookEvent(eventType, eventId);
    }

    private WebhookEvent parseMercadoPagoEvent(Map<String, Object> event, String requestId) {
        String eventType = (String) event.get("type");
        String eventId = (String) event.get("id");

        if (eventType == null) {
            eventType = (String) event.get("action");
        }

        if (eventId == null) {
            Object data = event.get("data");
            if (data instanceof Map<?, ?> dataMap) {
                eventId = String.valueOf(dataMap.get("id"));
            }
        }

        if (eventId == null || "null".equals(eventId)) {
            eventId = requestId;
        }

        return new WebhookEvent(eventType != null ? eventType : "unknown",
                eventId != null ? eventId : "unknown");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseAsMap(String payload) throws JsonProcessingException {
        return objectMapper.readValue(payload, Map.class);
    }

    @FunctionalInterface
    private interface PayloadEventParser {
        WebhookEvent parse(Map<String, Object> event);
    }

    private record WebhookEvent(String eventType, String eventId) {
    }
}
