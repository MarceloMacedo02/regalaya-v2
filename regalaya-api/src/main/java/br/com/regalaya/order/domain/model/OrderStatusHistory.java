package br.com.regalaya.order.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_status_history")
@Getter
@Setter
@ToString(exclude = {"order"})
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 20)
    private OrderStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", length = 20, nullable = false)
    private OrderStatus newStatus;

    @Column(name = "changed_by", length = 100)
    private String changedBy; // user_id, "System", "Webhook"

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;
}