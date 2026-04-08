package br.com.regalaya.auth.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String name,
    String email,
    String role,
    String phone,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
