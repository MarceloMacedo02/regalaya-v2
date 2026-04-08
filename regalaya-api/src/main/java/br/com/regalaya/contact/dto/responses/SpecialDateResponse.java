package br.com.regalaya.contact.dto.responses;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record SpecialDateResponse(
    UUID id,
    UUID contactId,
    String type,
    LocalDate date,
    String recurrence,
    LocalDate lastNotified,
    LocalDateTime createdAt
) {}
