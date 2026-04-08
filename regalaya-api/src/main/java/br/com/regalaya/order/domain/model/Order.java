package br.com.regalaya.order.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.contact.domain.model.Contact;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_status", columnList = "status"),
    @Index(name = "idx_orders_created_at", columnList = "createdAt"),
    @Index(name = "idx_orders_user_id", columnList = "user_id"),
    @Index(name = "idx_orders_customer_name", columnList = "customerName"),
    @Index(name = "idx_orders_customer_email", columnList = "customerEmail"),
    @Index(name = "idx_orders_status_created", columnList = "status, createdAt")
})
@Getter
@Setter
@ToString(exclude = {"orderItems", "user", "contact"})
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String orderNumber;

    @Column(nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 150)
    private String customerEmail;

    @Column(length = 20)
    private String customerPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal shipping = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(length = 30)
    private String paymentMethod;

    @Column(length = 20)
    @Builder.Default
    private String paymentStatus = "pending";

    @Column(length = 1000)
    private String shippingAddress;

    @Column(length = 1000)
    private String notes;

    @Column(length = 50)
    private String trackingCode;

    @Column(length = 100)
    private String transactionId;

    @Column
    private LocalDateTime paidAt;

    @Column(length = 500)
    private String trackingUrl;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column
    private LocalDateTime scheduledAt;

    @Column
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;
}
