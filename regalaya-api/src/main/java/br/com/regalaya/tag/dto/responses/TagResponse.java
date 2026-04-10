package br.com.regalaya.tag.dto.responses;

import java.util.UUID;

public record TagResponse(
    UUID id,
    String name,
    String description
) {}
