package br.com.regalaya.ai.controller;

import br.com.regalaya.ai.model.MessageRequest;
import br.com.regalaya.ai.model.MessageResponse;
import br.com.regalaya.ai.model.ProfileInput;
import br.com.regalaya.ai.model.RecommendationResult;
import br.com.regalaya.ai.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final RecommendationService recommendationService;

    @PostMapping("/recommendations")
    public ResponseEntity<RecommendationResult> getRecommendations(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ProfileInput input) {
        
        UUID userId = (userDetails != null) ? userDetails.getId() : UUID.randomUUID();

        RecommendationResult result = recommendationService.recommend(userId, input);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-message")
    public ResponseEntity<MessageResponse> generateMessage(
            @Valid @RequestBody MessageRequest request) {
        MessageResponse response = recommendationService.generateMessage(request);
        return ResponseEntity.ok(response);
    }
}
