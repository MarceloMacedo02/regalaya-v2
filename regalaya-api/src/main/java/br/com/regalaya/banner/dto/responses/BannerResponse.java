package br.com.regalaya.banner.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record BannerResponse(
    UUID id,
    String title,
    String subtitle,
    String imageUrl,
    String link,
    Boolean isActive,
    Integer displayOrder,
    String placement,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
