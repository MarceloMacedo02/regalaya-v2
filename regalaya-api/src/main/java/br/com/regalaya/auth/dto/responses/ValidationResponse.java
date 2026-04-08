package br.com.regalaya.auth.dto.responses;

public record ValidationResponse(
    boolean valid,
    String message
) {}
