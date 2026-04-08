package br.com.regalaya.communication.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.communication.domain.enums.CommunicationDeliveryStatus;

public record CommunicationDeliveryResponse(
        UUID id,
        UUID recipientId,
        String recipientName,
        String recipientEmail,
        String recipientPhone,
        CommunicationDeliveryStatus status,
        String errorMessage,
        LocalDateTime dispatchedAt,
        boolean opened,
        boolean clicked
) {}
