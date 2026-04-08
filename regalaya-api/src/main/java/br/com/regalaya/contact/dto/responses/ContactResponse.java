package br.com.regalaya.contact.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record ContactResponse(
    UUID id,
    String name,
    String phone,
    String whatsappId,
    Boolean consent,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
