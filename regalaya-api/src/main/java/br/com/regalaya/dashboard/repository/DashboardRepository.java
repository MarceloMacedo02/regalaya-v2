package br.com.regalaya.dashboard.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.order.domain.model.Order;

@Repository
public interface DashboardRepository extends JpaRepository<Order, java.util.UUID> {

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.createdAt BETWEEN :start AND :end AND o.status NOT IN ('CANCELLED', 'REFUNDED')")
    BigDecimal sumRevenueByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :start AND :end AND o.status NOT IN ('CANCELLED', 'REFUNDED')")
    Long countOrdersByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(AVG(o.total), 0) FROM Order o WHERE o.createdAt BETWEEN :start AND :end AND o.status NOT IN ('CANCELLED', 'REFUNDED')")
    BigDecimal avgTicketByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(u) FROM br.com.regalaya.auth.domain.model.User u WHERE u.role = br.com.regalaya.auth.domain.model.Role.CLIENT AND u.createdAt BETWEEN :start AND :end")
    Long countNewCustomersByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(u) FROM br.com.regalaya.auth.domain.model.User u WHERE u.role = br.com.regalaya.auth.domain.model.Role.CLIENT")
    Long countTotalCustomers();

    @Query(value = """
        SELECT DATE(o.created_at) as sale_date,
               COALESCE(SUM(o.total), 0) as revenue,
               COUNT(o.id) as orders
        FROM orders o
        WHERE o.created_at BETWEEN :start AND :end
          AND o.status NOT IN ('CANCELLED', 'REFUNDED')
        GROUP BY DATE(o.created_at)
        ORDER BY sale_date ASC
        """, nativeQuery = true)
    List<Object[]> findSalesByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = """
        SELECT oi.product_name, SUM(oi.quantity) as units_sold, SUM(oi.total) as revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at BETWEEN :start AND :end
          AND o.status NOT IN ('CANCELLED', 'REFUNDED')
        GROUP BY oi.product_name
        ORDER BY units_sold DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopProductsByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("limit") int limit);
}
