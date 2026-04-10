package br.com.regalaya.cms.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record CmsPageResponse(
    UUID id,
    String slug,
    String title,
    String content,
    String metaDescription,
    String metaKeywords,
    Boolean isPublished,
    Integer displayOrder,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
