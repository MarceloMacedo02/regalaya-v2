package br.com.regalaya.whatsapp.client;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import br.com.regalaya.whatsapp.config.WhatsAppProperties;
import br.com.regalaya.whatsapp.client.dto.WhatsAppSendMessageRequest;
import br.com.regalaya.whatsapp.client.dto.WhatsAppSendMessageResponse;
import br.com.regalaya.whatsapp.client.dto.WhatsAppWebhookEvent;

@Component
public class WhatsAppClient {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppClient.class);

    private final WhatsAppProperties properties;
    private final RestTemplate restTemplate;

    @Autowired
    public WhatsAppClient(WhatsAppProperties properties) {
        this.properties = properties;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(properties.getConnectionTimeoutMs());
        factory.setReadTimeout(properties.getReadTimeoutMs());
        this.restTemplate = new RestTemplate(factory);
    }

    // Constructor exclusively for testing with a mock RestTemplate
    WhatsAppClient(WhatsAppProperties properties, RestTemplate restTemplate) {
        this.properties = properties;
        this.restTemplate = restTemplate;
    }

    public WhatsAppSendMessageResponse sendMessage(String to, String templateName, Map<String, String> parameters) {
        String url = properties.getApiUrl() + "/" + properties.getPhoneNumberId() + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + properties.getAccessToken());

        WhatsAppSendMessageRequest request = WhatsAppSendMessageRequest.forTemplate(
                to, templateName, properties.getTemplateLanguage(), parameters);

        HttpEntity<WhatsAppSendMessageRequest> entity = new HttpEntity<>(request, headers);

        try {
            WhatsAppSendMessageResponse response = restTemplate.postForObject(url, entity, WhatsAppSendMessageResponse.class);
            log.info("WhatsApp message sent successfully to {}", maskPhoneNumber(to));
            return response;
        } catch (HttpClientErrorException e) {
            log.error("Failed to send WhatsApp message to {}: {}", maskPhoneNumber(to), e.getResponseBodyAsString());
            throw new WhatsAppApiException("Failed to send WhatsApp message: " + e.getMessage(), e);
        }
    }

    public boolean verifyWebhookSignature(String payload, String signature, String secret) {
        if (signature == null || secret == null) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = "sha256=" + Base64.getEncoder().encodeToString(hash);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Failed to verify webhook signature", e);
            return false;
        }
    }

    public WhatsAppWebhookEvent parseWebhookEvent(Map<String, Object> payload) {
        WhatsAppWebhookEvent event = new WhatsAppWebhookEvent();
        event.setObjectId((String) payload.get("object_id"));
        return event;
    }

    private String maskPhoneNumber(String phone) {
        if (phone == null || phone.length() < 4) {
            return "***";
        }
        return phone.substring(0, 2) + "****" + phone.substring(phone.length() - 2);
    }
}