package br.com.regalaya.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.order.domain.model.OrderStatusHistory;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, UUID> {

    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.id = :orderId ORDER BY h.changedAt ASC")
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtAsc(@Param("orderId") UUID orderId);
}