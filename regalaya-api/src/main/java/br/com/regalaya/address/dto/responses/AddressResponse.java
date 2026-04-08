package br.com.regalaya.address.dto.responses;

import java.util.UUID;

public record AddressResponse(
    UUID id,
    String label,
    String zipCode,
    String street,
    String number,
    String complement,
    String neighborhood,
    String city,
    String state,
    String reference,
    String recipientPhone,
    Boolean isDefault,
    Boolean isActive
) {}
