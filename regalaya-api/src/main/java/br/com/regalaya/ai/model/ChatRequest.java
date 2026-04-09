package br.com.regalaya.ai.model;

import java.util.List;

public record ChatRequest(
    List<ChatMessageDto> messages
) {}
