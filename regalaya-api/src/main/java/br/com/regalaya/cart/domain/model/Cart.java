package br.com.regalaya.cart.domain.model;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "carts")
@Getter
@Setter
@ToString(exclude = {"user", "items"})
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "coupon_discount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal couponDiscount = BigDecimal.ZERO;

    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

    public BigDecimal getSubtotal() {
        return items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotal() {
        return getSubtotal().subtract(couponDiscount);
    }

    public int getTotalQuantity() {
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
