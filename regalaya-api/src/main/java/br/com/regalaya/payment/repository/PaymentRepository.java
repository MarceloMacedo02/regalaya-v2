package br.com.regalaya.payment.repository;

import br.com.regalaya.payment.domain.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByProviderPaymentId(String providerPaymentId);

    Optional<Payment> findByOrderId(UUID orderId);

    Optional<Payment> findByIdempotencyKey(String idempotencyKey);

    @Query("SELECT p FROM Payment p WHERE p.status = 'pending' " +
           "AND p.paymentMethodType = br.com.regalaya.payment.domain.enums.PaymentMethodType.PIX " +
           "AND p.expiresAt < :now")
    List<Payment> findExpiredPixPayments(@Param("now") LocalDateTime now);

    @Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.providerPaymentId = :providerPaymentId")
    Optional<Payment> findByProviderPaymentIdWithOrder(@Param("providerPaymentId") String providerPaymentId);
}
