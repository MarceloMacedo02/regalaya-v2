package br.com.regalaya.order.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdWithItems(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.id = :id AND o.user.id = :userId")
    Optional<Order> findByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    Page<Order> findAllWithItemsOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findTop5WithItemsByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query(value = "SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at BETWEEN :startDate AND :endDate", nativeQuery = true)
    BigDecimal sumTotalByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT COUNT(*) FROM orders WHERE created_at BETWEEN :startDate AND :endDate", nativeQuery = true)
    long countByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT COALESCE(AVG(total), 0) FROM orders WHERE created_at BETWEEN :startDate AND :endDate", nativeQuery = true)
    BigDecimal avgTotalByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    long countByUserId(UUID userId);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.user.id = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") UUID userId);
}
