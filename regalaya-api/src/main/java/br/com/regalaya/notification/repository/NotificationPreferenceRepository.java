package br.com.regalaya.notification.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.regalaya.notification.domain.model.NotificationPreference;

public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, UUID> {
    Optional<NotificationPreference> findByUserId(UUID userId);
    Optional<NotificationPreference> findByUnsubscribeToken(String unsubscribeToken);
}
