package br.com.regalaya.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.regalaya.order.domain.model.RefundTransaction;

@Repository
public interface RefundTransactionRepository extends JpaRepository<RefundTransaction, UUID> {

    List<RefundTransaction> findByOrderIdOrderByCreatedAtDesc(UUID orderId);
}