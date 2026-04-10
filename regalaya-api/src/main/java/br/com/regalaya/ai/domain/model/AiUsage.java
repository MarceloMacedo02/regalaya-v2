package br.com.regalaya.ai.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_usage", indexes = {
    @Index(name = "idx_ai_usage_user_date", columnList = "user_id, usage_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "request_count")
    @Builder.Default
    private Integer requestCount = 0;

    @Column(name = "tokens_used")
    @Builder.Default
    private Long tokensUsed = 0L;

    @Column(name = "cost_estimate")
    @Builder.Default
    private Double costEstimate = 0.0;

    @Column(name = "last_request_at")
    private LocalDateTime lastRequestAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
