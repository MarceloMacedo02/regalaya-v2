package br.com.regalaya.order.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "refund_transactions")
@Getter
@Setter
@ToString(exclude = {"order"})
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private RefundType type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "gateway_refund_id", length = 255)
    private String gatewayRefundId;

    @Column(name = "gateway_response", columnDefinition = "JSONB")
    private String gatewayResponse; // JSON serializado

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RefundStatus status = RefundStatus.PENDING;

    @Column(name = "processed_by", length = 100)
    private String processedBy; // admin user ID

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;
}