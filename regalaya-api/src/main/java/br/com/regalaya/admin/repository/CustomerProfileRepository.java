package br.com.regalaya.admin.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.admin.dto.responses.CustomerOrderSummaryResponse;
import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderStatus;

@Repository
public interface CustomerProfileRepository extends JpaRepository<Order, UUID> {

    @Query("""
        SELECT NEW br.com.regalaya.admin.dto.responses.CustomerOrderSummaryResponse(
            o.id, o.orderNumber, o.total, CAST(o.status AS string), o.paymentMethod, o.createdAt,
            SIZE(o.orderItems)
        )
        FROM Order o
        WHERE o.user.id = :customerId
        AND (:status IS NULL OR o.status = :status)
        AND (:startDate IS NULL OR o.createdAt >= :startDate)
        AND (:endDate IS NULL OR o.createdAt <= :endDate)
        AND (:productName IS NULL OR EXISTS (
            SELECT 1 FROM OrderItem oi
            WHERE oi.order.id = o.id
            AND LOWER(oi.productName) LIKE LOWER(CONCAT('%', :productName, '%'))
        ))
        ORDER BY
            CASE WHEN :sortBy = 'createdAt' AND :sortDirection = 'asc' THEN o.createdAt END ASC,
            CASE WHEN :sortBy = 'createdAt' AND :sortDirection = 'desc' THEN o.createdAt END DESC,
            CASE WHEN :sortBy = 'total' AND :sortDirection = 'asc' THEN o.total END ASC,
            CASE WHEN :sortBy = 'total' AND :sortDirection = 'desc' THEN o.total END DESC,
            CASE WHEN :sortBy = 'status' AND :sortDirection = 'asc' THEN o.status END ASC,
            CASE WHEN :sortBy = 'status' AND :sortDirection = 'desc' THEN o.status END DESC,
            o.createdAt DESC
        """)
    Page<CustomerOrderSummaryResponse> findCustomerOrders(
            @Param("customerId") UUID customerId,
            @Param("status") OrderStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("productName") String productName,
            @Param("sortBy") String sortBy,
            @Param("sortDirection") String sortDirection,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.user.id = :userId AND (o.status = br.com.regalaya.order.domain.model.OrderStatus.PAID OR o.status = br.com.regalaya.order.domain.model.OrderStatus.DELIVERED)")
    BigDecimal getLtvByUserId(@Param("userId") UUID userId);

    @Query("SELECT MIN(o.createdAt) FROM Order o WHERE o.user.id = :userId AND (o.status = br.com.regalaya.order.domain.model.OrderStatus.PAID OR o.status = br.com.regalaya.order.domain.model.OrderStatus.DELIVERED)")
    LocalDate getFirstPurchaseDate(@Param("userId") UUID userId);

    @Query("SELECT MAX(o.createdAt) FROM Order o WHERE o.user.id = :userId AND (o.status = br.com.regalaya.order.domain.model.OrderStatus.PAID OR o.status = br.com.regalaya.order.domain.model.OrderStatus.DELIVERED)")
    LocalDate getLastPurchaseDate(@Param("userId") UUID userId);

    @Query("""
        SELECT o.createdAt, o.total
        FROM Order o
        WHERE o.user.id = :userId
        AND o.status IN (br.com.regalaya.order.domain.model.OrderStatus.PAID, br.com.regalaya.order.domain.model.OrderStatus.DELIVERED)
        AND o.createdAt >= :startDate
        AND o.createdAt <= :endDate
        ORDER BY o.createdAt ASC
        """)
    List<Object[]> getMonthlyOrderData(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    long countByUserId(UUID userId);
}
