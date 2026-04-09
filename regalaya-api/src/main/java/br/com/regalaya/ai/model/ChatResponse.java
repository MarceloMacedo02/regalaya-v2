package br.com.regalaya.ai.model;

import java.util.List;

public record ChatResponse(
    String message,
    List<String> suggestions,
    List<RecommendationResult.Suggestion> products
) {}
