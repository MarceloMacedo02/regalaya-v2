package br.com.regalaya.ai.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_recommendations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "profile_data", columnDefinition = "jsonb", nullable = false)
    private String profileData; // Will store JSON representation

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "suggestions", columnDefinition = "jsonb", nullable = false)
    private String suggestions; // Will store JSON representation

    @Column(name = "justification", columnDefinition = "text")
    private String justification;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
