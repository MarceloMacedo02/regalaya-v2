package br.com.regalaya.order.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderStatus;

public class OrderSpecifications {

    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) -> status != null ? cb.equal(root.get("status"), status) : null;
    }

    public static Specification<Order> dateBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null) return null;

            if (startDate != null && endDate != null) {
                return cb.between(root.get("createdAt"), startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
            }
            if (startDate != null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay());
            }
            return cb.lessThanOrEqualTo(root.get("createdAt"), endDate.atTime(23, 59, 59));
        };
    }

    public static Specification<Order> hasMinAmount(BigDecimal minAmount) {
        return (root, query, cb) -> minAmount != null ? cb.greaterThanOrEqualTo(root.get("total"), minAmount) : null;
    }

    public static Specification<Order> hasMaxAmount(BigDecimal maxAmount) {
        return (root, query, cb) -> maxAmount != null ? cb.lessThanOrEqualTo(root.get("total"), maxAmount) : null;
    }

    public static Specification<Order> customerNameContains(String customerName) {
        return (root, query, cb) -> {
            if (customerName == null || customerName.isBlank()) return null;
            return cb.like(cb.lower(root.get("customerName")), "%" + customerName.toLowerCase() + "%");
        };
    }

    public static Specification<Order> customerEmailContains(String customerEmail) {
        return (root, query, cb) -> {
            if (customerEmail == null || customerEmail.isBlank()) return null;
            return cb.like(cb.lower(root.get("customerEmail")), "%" + customerEmail.toLowerCase() + "%");
        };
    }

    public static Specification<Order> combine(
            OrderStatus status,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String customerName,
            String customerEmail
    ) {
        List<Specification<Order>> specs = new ArrayList<>();

        if (status != null) specs.add(hasStatus(status));
        if (startDate != null || endDate != null) specs.add(dateBetween(startDate, endDate));
        if (minAmount != null) specs.add(hasMinAmount(minAmount));
        if (maxAmount != null) specs.add(hasMaxAmount(maxAmount));
        if (customerName != null && !customerName.isBlank()) specs.add(customerNameContains(customerName));
        if (customerEmail != null && !customerEmail.isBlank()) specs.add(customerEmailContains(customerEmail));

        return specs.stream().reduce(Specification::and).orElse(null);
    }
}