package br.com.regalaya.notification.service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.notification.domain.enums.NotificationType;

public record NotificationPayload(
        UUID userId,
        UUID contactId,
        UUID specialDateId,
        NotificationType type,
        String contactName,
        String specialDateType,
        LocalDate specialDate,
        String ctaLabel,
        String ctaUrl,
        LocalDateTime scheduledAt,
        String recipientPhone,
        String recipientEmail
) {
}
