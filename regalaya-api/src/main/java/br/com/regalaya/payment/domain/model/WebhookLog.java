package br.com.regalaya.payment.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "webhook_logs")
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookLog extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String provider;

    @Column(nullable = false, length = 100)
    private String eventType;

    @Column(length = 100)
    private String providerEventId;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(length = 20)
    private String processingStatus;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column
    private LocalDateTime receivedAt;

    @Column
    private LocalDateTime processedAt;
}
