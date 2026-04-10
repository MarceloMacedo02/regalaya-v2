package br.com.regalaya.ai.controller;

import br.com.regalaya.ai.dto.responses.AiUsageSummaryResponse;
import br.com.regalaya.ai.model.MessageRequest;
import br.com.regalaya.ai.model.MessageResponse;
import br.com.regalaya.ai.model.ProfileInput;
import br.com.regalaya.ai.model.RecommendationResult;
import br.com.regalaya.ai.service.AiUsageTrackingService;
import br.com.regalaya.ai.service.MessageGenerationService;
import br.com.regalaya.ai.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/ai")
@Tag(name = "AI", description = "AI recommendation and message generation operations")
@RequiredArgsConstructor
public class AIController {

    private final RecommendationService recommendationService;
    private final MessageGenerationService messageGenerationService;
    private final AiUsageTrackingService aiUsageTrackingService;

    @PostMapping("/recommendations")
    public ResponseEntity<RecommendationResult> getRecommendations(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ProfileInput input) {

        UUID userId = (userDetails != null) ? userDetails.getId() : UUID.randomUUID();

        // Check limits
        if (aiUsageTrackingService.isDailyLimitExceeded(userId)) {
            return ResponseEntity.status(429)
                    .header("X-RateLimit-Limit", String.valueOf(aiUsageTrackingService.getDailyLimit()))
                    .header("X-RateLimit-Remaining", "0")
                    .body(null);
        }

        RecommendationResult result = recommendationService.recommend(userId, input);

        // Track usage
        aiUsageTrackingService.trackUsage(userId, 0, 0.0);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-message")
    public ResponseEntity<MessageResponse> generateMessage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody MessageRequest request) {

        UUID userId = (userDetails != null) ? userDetails.getId() : null;

        if (userId != null && aiUsageTrackingService.isDailyLimitExceeded(userId)) {
            return ResponseEntity.status(429)
                    .header("X-RateLimit-Limit", String.valueOf(aiUsageTrackingService.getDailyLimit()))
                    .header("X-RateLimit-Remaining", "0")
                    .body(null);
        }

        MessageResponse response = messageGenerationService.generateMessage(request);

        if (userId != null) {
            aiUsageTrackingService.trackUsage(userId, 0, 0.0);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/usage")
    @Operation(summary = "Get AI usage summary")
    public ResponseEntity<AiUsageSummaryResponse> getUsageSummary(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UUID userId = userDetails.getId();
        Map<String, Object> summary = aiUsageTrackingService.getUsageSummary(userId);

        AiUsageSummaryResponse response = new AiUsageSummaryResponse(
                (long) summary.get("dailyRequests"),
                (int) summary.get("dailyLimit"),
                (int) summary.get("dailyRemaining"),
                (long) summary.get("monthlyRequests"),
                (int) summary.get("monthlyLimit"),
                (int) summary.get("monthlyRemaining"),
                (double) summary.get("monthlyCost")
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/usage/chart")
    @Operation(summary = "Get AI usage chart data")
    public ResponseEntity<List<Object[]>> getUsageChart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "30d") String period) {

        UUID userId = userDetails.getId();
        LocalDate end = LocalDate.now();
        LocalDate start = switch (period) {
            case "7d" -> end.minusDays(7);
            case "30d" -> end.minusDays(30);
            case "90d" -> end.minusDays(90);
            default -> end.minusDays(30);
        };

        return ResponseEntity.ok(aiUsageTrackingService.getUsageChart(start, end));
    }
}
