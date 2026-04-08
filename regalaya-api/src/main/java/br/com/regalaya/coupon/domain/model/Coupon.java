package br.com.regalaya.coupon.domain.model;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "max_usages")
    @Builder.Default
    private Integer maxUsages = Integer.MAX_VALUE;

    @Column(name = "current_usages")
    @Builder.Default
    private Integer currentUsages = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public boolean isValid() {
        if (!isActive) return false;
        LocalDateTime now = LocalDateTime.now();
        if (validFrom != null && now.isBefore(validFrom)) return false;
        if (validUntil != null && now.isAfter(validUntil)) return false;
        if (currentUsages >= maxUsages) return false;
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderValue) {
        if (!isValid()) return BigDecimal.ZERO;
        if (orderValue.compareTo(minOrderValue) < 0) return BigDecimal.ZERO;

        BigDecimal discount;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = orderValue.multiply(discountValue).divide(BigDecimal.valueOf(100));
            if (maxDiscount != null && discount.compareTo(maxDiscount) > 0) {
                discount = maxDiscount;
            }
        } else {
            discount = discountValue;
        }
        return discount.min(orderValue);
    }

    public enum DiscountType {
        PERCENTAGE, FIXED
    }
}
