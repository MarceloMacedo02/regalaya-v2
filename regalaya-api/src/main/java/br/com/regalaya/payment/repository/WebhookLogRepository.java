package br.com.regalaya.payment.repository;

import br.com.regalaya.payment.domain.model.WebhookLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WebhookLogRepository extends JpaRepository<WebhookLog, UUID> {

    boolean existsByProviderEventId(String providerEventId);
}
