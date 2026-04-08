package br.com.regalaya.contact.dto.responses;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ContactDetailResponse(
    UUID id,
    String name,
    String phone,
    String whatsappId,
    Boolean consent,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<SpecialDateResponse> specialDates
) {}
