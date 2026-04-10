package br.com.regalaya.ai.dto.responses;

public record AiUsageSummaryResponse(
    long dailyRequests,
    int dailyLimit,
    int dailyRemaining,
    long monthlyRequests,
    int monthlyLimit,
    int monthlyRemaining,
    double monthlyCost
) {}
