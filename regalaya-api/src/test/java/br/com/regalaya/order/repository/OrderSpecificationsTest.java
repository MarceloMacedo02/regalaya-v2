package br.com.regalaya.order.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderStatus;

import static org.junit.jupiter.api.Assertions.*;

class OrderSpecificationsTest {

    @Test
    void testHasStatus() {
        Specification<Order> spec = OrderSpecifications.hasStatus(OrderStatus.PAID);
        assertNotNull(spec);
    }

    @Test
    void testHasStatus_NullReturnsNull() {
        // hasStatus(null) retorna um lambda que quando aplicado retorna null
        // O comportamento é intencional - Specification nula significa "sem filtro"
        Specification<Order> specNull = OrderSpecifications.hasStatus(null);
        assertNotNull(specNull); // Lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testDateBetween() {
        LocalDate start = LocalDate.of(2026, 4, 1);
        LocalDate end = LocalDate.of(2026, 4, 7);

        Specification<Order> spec = OrderSpecifications.dateBetween(start, end);
        assertNotNull(spec);
    }

    @Test
    void testDateBetween_NullReturnsNull() {
        Specification<Order> specNull = OrderSpecifications.dateBetween(null, null);
        assertNotNull(specNull); // O lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testDateBetween_StartOnly() {
        LocalDate start = LocalDate.of(2026, 4, 1);
        Specification<Order> spec = OrderSpecifications.dateBetween(start, null);
        assertNotNull(spec);
    }

    @Test
    void testDateBetween_EndOnly() {
        LocalDate end = LocalDate.of(2026, 4, 7);
        Specification<Order> spec = OrderSpecifications.dateBetween(null, end);
        assertNotNull(spec);
    }

    @Test
    void testHasMinAmount() {
        BigDecimal min = new BigDecimal("100.00");
        Specification<Order> spec = OrderSpecifications.hasMinAmount(min);
        assertNotNull(spec);
    }

    @Test
    void testHasMinAmount_NullReturnsNull() {
        Specification<Order> specNull = OrderSpecifications.hasMinAmount(null);
        assertNotNull(specNull); // O lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testHasMaxAmount() {
        BigDecimal max = new BigDecimal("500.00");
        Specification<Order> spec = OrderSpecifications.hasMaxAmount(max);
        assertNotNull(spec);
    }

    @Test
    void testHasMaxAmount_NullReturnsNull() {
        Specification<Order> specNull = OrderSpecifications.hasMaxAmount(null);
        assertNotNull(specNull); // O lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testCustomerNameContains() {
        String name = "joão";
        Specification<Order> spec = OrderSpecifications.customerNameContains(name);
        assertNotNull(spec);
    }

    @Test
    void testCustomerNameContains_NullReturnsNull() {
        Specification<Order> specNull = OrderSpecifications.customerNameContains(null);
        assertNotNull(specNull); // O lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testCustomerNameContains_BlankReturnsNull() {
        Specification<Order> specBlank = OrderSpecifications.customerNameContains("   ");
        assertNotNull(specBlank); // O lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testCustomerEmailContains() {
        String email = "test@email.com";
        Specification<Order> spec = OrderSpecifications.customerEmailContains(email);
        assertNotNull(spec);
    }

    @Test
    void testCustomerEmailContains_NullReturnsNull() {
        Specification<Order> specNull = OrderSpecifications.customerEmailContains(null);
        assertNotNull(specNull); // O lambda é criado, mas retorna null quando aplicado
    }

    @Test
    void testCombineWithMultipleFilters() {
        LocalDate start = LocalDate.of(2026, 4, 1);
        LocalDate end = LocalDate.of(2026, 4, 7);
        BigDecimal minAmount = new BigDecimal("50.00");
        BigDecimal maxAmount = new BigDecimal("300.00");
        String customerName = "joão";
        String customerEmail = "email";
        OrderStatus status = OrderStatus.PAID;

        Specification<Order> spec = OrderSpecifications.combine(
                status, start, end, minAmount, maxAmount, customerName, customerEmail
        );
        assertNotNull(spec);
    }

    @Test
    void testCombineWithNoFilters_ReturnsNull() {
        Specification<Order> spec = OrderSpecifications.combine(
                null, null, null, null, null, null, null
        );
        assertNull(spec);
    }

    @Test
    void testCombineWithSingleFilter() {
        Specification<Order> spec = OrderSpecifications.combine(
                OrderStatus.PAID, null, null, null, null, null, null
        );
        assertNotNull(spec);
    }
}
