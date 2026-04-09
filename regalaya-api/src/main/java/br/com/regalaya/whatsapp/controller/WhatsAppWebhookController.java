package br.com.regalaya.whatsapp.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.regalaya.whatsapp.config.WhatsAppProperties;
import br.com.regalaya.whatsapp.service.WhatsAppWebhookService;

@RestController
@RequestMapping("/api/webhooks/whatsapp")
public class WhatsAppWebhookController {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppWebhookController.class);

    private final WhatsAppProperties properties;
    private final WhatsAppWebhookService webhookService;

    public WhatsAppWebhookController(WhatsAppProperties properties, WhatsAppWebhookService webhookService) {
        this.properties = properties;
        this.webhookService = webhookService;
    }

    @GetMapping
    public ResponseEntity<String> verifyWebhook(@RequestParam("hub.mode") String mode,
                                                @RequestParam("hub.verify_token") String token,
                                                @RequestParam("hub.challenge") String challenge) {
        if ("subscribe".equals(mode) && token.equals(properties.getVerifyToken())) {
            log.info("WhatsApp webhook verified successfully");
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification failed");
    }

    @PostMapping
    public ResponseEntity<Void> handleWebhook(@RequestBody String payload,
                                              @RequestHeader("X-Hub-Signature-256") String signature) {
        if (!properties.getAppSecret().isBlank()) {
            boolean verified = webhookService.verifySignature(payload, signature, properties.getAppSecret());
            if (!verified) {
                log.warn("Invalid WhatsApp webhook signature");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        webhookService.processWebhookEvent(payload);
        return ResponseEntity.ok().build();
    }
}