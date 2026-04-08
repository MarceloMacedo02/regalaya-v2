package br.com.regalaya.payment.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.payment.domain.enums.PaymentMethodType;
import br.com.regalaya.payment.domain.enums.PaymentProvider;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@ToString(exclude = {"order"})
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String providerPaymentId;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PaymentProvider provider;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PaymentMethodType paymentMethodType;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "pending";

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(length = 1000)
    private String qrCode;

    @Column(length = 2000)
    private String qrCodeImage;

    @Column(length = 500)
    private String copyPasteCode;

    @Column
    private LocalDateTime expiresAt;

    @Column
    private LocalDateTime paidAt;

    @Column(length = 500)
    private String clientSecret;

    @Column
    private Integer installments;

    @Column(length = 4)
    private String cardLastFour;

    @Column(length = 50)
    private String cardBrand;

    @Column(length = 500)
    private String failureReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(length = 50)
    private String idempotencyKey;

    public boolean isExpired() {
        if (expiresAt == null) return false;
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isPaid() {
        return "paid".equals(status);
    }

    /**
     * Marks this payment as expired if it's still pending.
     * @return true if the payment was marked as expired, false if it was already in another state
     */
    public boolean markAsExpired() {
        if (!"pending".equals(status)) {
            return false;
        }
        this.status = "expired";
        return true;
    }
}
