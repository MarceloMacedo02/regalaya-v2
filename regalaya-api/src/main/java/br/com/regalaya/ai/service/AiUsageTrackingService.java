package br.com.regalaya.ai.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.ai.domain.model.AiUsage;
import br.com.regalaya.ai.repository.AiUsageRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AiUsageTrackingService {

    private final AiUsageRepository aiUsageRepository;

    @Value("${app.ai.daily-limit:50}")
    private int dailyLimit;

    @Value("${app.ai.monthly-limit:500}")
    private int monthlyLimit;

    public AiUsageTrackingService(AiUsageRepository aiUsageRepository) {
        this.aiUsageRepository = aiUsageRepository;
    }

    @Transactional
    public void trackUsage(UUID userId, int tokensUsed, double costEstimate) {
        LocalDate today = LocalDate.now();
        AiUsage usage = aiUsageRepository.findByUserIdAndUsageDate(userId, today)
                .orElse(AiUsage.builder()
                        .userId(userId)
                        .usageDate(today)
                        .requestCount(0)
                        .tokensUsed(0L)
                        .costEstimate(0.0)
                        .build());

        usage.setRequestCount(usage.getRequestCount() + 1);
        usage.setTokensUsed(usage.getTokensUsed() + tokensUsed);
        usage.setCostEstimate(usage.getCostEstimate() + costEstimate);
        usage.setLastRequestAt(LocalDateTime.now());

        aiUsageRepository.save(usage);
        log.debug("AI usage tracked for user {}: {} requests today", userId, usage.getRequestCount());
    }

    public boolean isDailyLimitExceeded(UUID userId) {
        LocalDate today = LocalDate.now();
        Long totalRequests = aiUsageRepository.sumRequestsByUserIdAndDateRange(userId, today, today);
        return totalRequests != null && totalRequests >= dailyLimit;
    }

    public boolean isMonthlyLimitExceeded(UUID userId) {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        Long totalRequests = aiUsageRepository.sumRequestsByUserIdAndDateRange(userId, startOfMonth, endOfMonth);
        return totalRequests != null && totalRequests >= monthlyLimit;
    }

    public Map<String, Object> getUsageSummary(UUID userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        Long dailyRequests = aiUsageRepository.sumRequestsByUserIdAndDateRange(userId, today, today);
        Long monthlyRequests = aiUsageRepository.sumRequestsByUserIdAndDateRange(userId, startOfMonth, today);
        Double monthlyCost = aiUsageRepository.sumCostByDateRange(startOfMonth, today);

        return Map.of(
                "dailyRequests", dailyRequests != null ? dailyRequests : 0,
                "dailyLimit", dailyLimit,
                "dailyRemaining", Math.max(0, dailyLimit - (dailyRequests != null ? dailyRequests : 0)),
                "monthlyRequests", monthlyRequests != null ? monthlyRequests : 0,
                "monthlyLimit", monthlyLimit,
                "monthlyRemaining", Math.max(0, monthlyLimit - (monthlyRequests != null ? monthlyRequests : 0)),
                "monthlyCost", monthlyCost != null ? monthlyCost : 0.0
        );
    }

    @Transactional(readOnly = true)
    public List<Object[]> getUsageChart(LocalDate start, LocalDate end) {
        return aiUsageRepository.sumRequestsGroupedByDate(start, end);
    }

    public int getDailyLimit() { return dailyLimit; }
    public int getMonthlyLimit() { return monthlyLimit; }
}
