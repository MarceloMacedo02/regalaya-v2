package br.com.regalaya.notification.channel.whatsapp;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.service.NotificationDeliveryAdapter;
import br.com.regalaya.whatsapp.client.WhatsAppApiException;
import br.com.regalaya.whatsapp.client.WhatsAppClient;
import br.com.regalaya.whatsapp.client.dto.WhatsAppSendMessageResponse;
import br.com.regalaya.whatsapp.service.WhatsAppRateLimiter;

@Component
public class WhatsAppNotificationChannel implements NotificationDeliveryAdapter {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppNotificationChannel.class);

    private final WhatsAppClient whatsAppClient;
    private final WhatsAppRateLimiter rateLimiter;

    public WhatsAppNotificationChannel(WhatsAppClient whatsAppClient, WhatsAppRateLimiter rateLimiter) {
        this.whatsAppClient = whatsAppClient;
        this.rateLimiter = rateLimiter;
    }

    @Override
    public void deliver(NotificationQueue notification) {
        if (notification.getRecipientPhone() == null || notification.getRecipientPhone().isBlank()) {
            log.warn("Skipping WhatsApp delivery - no phone number for notification {}", notification.getId());
            return;
        }

        String phoneNumber = normalizePhoneNumber(notification.getRecipientPhone());

        if (!rateLimiter.tryConsume(phoneNumber)) {
            log.warn("Rate limit exceeded for phone {}", maskPhone(phoneNumber));
            throw new WhatsAppApiException("Rate limit exceeded for phone: " + maskPhone(phoneNumber));
        }

        Map<String, String> parameters = parseMessageData(notification.getMessageData());
        String templateName = determineTemplate(notification.getType());

        try {
            WhatsAppSendMessageResponse response = whatsAppClient.sendMessage(phoneNumber, templateName, parameters);

            if (response.isSuccess()) {
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
                log.info("WhatsApp notification sent successfully - id={}, messageId={}", 
                        notification.getId(), response.getMessageId());
            } else {
                throw new WhatsAppApiException("WhatsApp API returned error: " + response.getMessageStatus());
            }
        } catch (WhatsAppApiException e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
            throw e;
        }
    }

    private String normalizePhoneNumber(String phone) {
        String cleaned = phone.replaceAll("[^0-9+]", "");
        if (!cleaned.startsWith("+")) {
            if (cleaned.startsWith("55") && cleaned.length() > 10) {
                return "+" + cleaned;
            }
            return "+55" + cleaned;
        }
        return cleaned;
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "***";
        return phone.substring(0, 2) + "****" + phone.substring(phone.length() - 2);
    }

    private Map<String, String> parseMessageData(String messageData) {
        if (messageData == null || messageData.isBlank()) {
            return new HashMap<>();
        }
        try {
            Map<String, String> data = new HashMap<>();
            data.put("1", messageData);
            return data;
        } catch (Exception e) {
            log.warn("Failed to parse message data: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private String determineTemplate(br.com.regalaya.notification.domain.enums.NotificationType type) {
        return switch (type) {
            case DATE_REMINDER_7D -> "date_reminder_7days";
            case DATE_REMINDER_1D -> "date_reminder_1day";
            case ORDER_CONFIRMATION -> "order_confirmation";
            case ORDER_SHIPPED -> "order_shipped";
            case ORDER_DELIVERED -> "order_delivered";
            default -> "generic_reminder";
        };
    }
}