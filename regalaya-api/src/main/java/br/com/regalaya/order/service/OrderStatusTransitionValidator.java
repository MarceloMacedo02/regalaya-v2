package br.com.regalaya.order.service;

import org.springframework.stereotype.Component;

import br.com.regalaya.order.domain.model.OrderStatus;

import java.util.Map;
import java.util.Set;

@Component
public class OrderStatusTransitionValidator {

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = Map.of(
        OrderStatus.PENDING, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED),
        OrderStatus.PAID, Set.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED),
        OrderStatus.PROCESSING, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
        OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED),
        OrderStatus.DELIVERED, Set.of(OrderStatus.REFUNDED),
        OrderStatus.CANCELLED, Set.of(),
        OrderStatus.REFUNDED, Set.of()
    );

    public boolean isValidTransition(OrderStatus from, OrderStatus to) {
        if (from == null || to == null) {
            return false;
        }
        if (from == to) {
            return true; // Mesmo status é permitido (idempotente)
        }
        Set<OrderStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(from, Set.of());
        return allowed.contains(to);
    }

    public String getInvalidTransitionMessage(OrderStatus from, OrderStatus to) {
        if (from == to) {
            return "Pedido já está no status " + to.name();
        }
        Set<OrderStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(from, Set.of());
        if (allowed.isEmpty()) {
            return "Status " + from.name() + " é terminal e não permite transições.";
        }
        return "Transição de " + from.name() + " para " + to.name() + " não é permitida. " +
               "Status permitidos: " + allowed.stream()
                   .map(OrderStatus::name)
                   .reduce((a, b) -> a + ", " + b)
                   .orElse("nenhum");
    }
}