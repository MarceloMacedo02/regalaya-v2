package br.com.regalaya.notification.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationReadResponse(
        UUID id,
        LocalDateTime readAt
) {
}
