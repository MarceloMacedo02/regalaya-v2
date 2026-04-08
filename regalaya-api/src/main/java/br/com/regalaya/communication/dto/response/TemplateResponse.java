package br.com.regalaya.communication.dto.response;

import br.com.regalaya.communication.domain.enums.CommunicationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record TemplateResponse(
        UUID id,
        String name,
        CommunicationType type,
        String subject,
        String content,
        String variables,
        String description,
        Boolean isActive,
        Integer version,
        String category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
