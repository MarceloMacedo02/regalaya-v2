package br.com.regalaya.notification.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationItemResponse(
        UUID id,
        String type,
        String status,
        String title,
        String message,
        String ctaLabel,
        String ctaUrl,
        String contactName,
        String specialDateType,
        LocalDateTime specialDateValue,
        LocalDateTime scheduledAt,
        LocalDateTime sentAt,
        LocalDateTime readAt,
        boolean read,
        int retryCount
) {
}
