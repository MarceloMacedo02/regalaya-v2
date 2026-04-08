package br.com.regalaya.auth.dto.responses;

public record PasswordResetResponse(
    String message,
    String email
) {}
