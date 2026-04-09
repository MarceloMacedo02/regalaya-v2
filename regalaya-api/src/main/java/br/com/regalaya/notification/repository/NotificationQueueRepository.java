package br.com.regalaya.notification.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.enums.NotificationType;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import jakarta.persistence.LockModeType;

@Repository
public interface NotificationQueueRepository extends JpaRepository<NotificationQueue, UUID> {

    @Query("""
        SELECT n
        FROM NotificationQueue n
        WHERE n.userId = :userId
          AND (:status IS NULL OR n.status = :status)
          AND (:type IS NULL OR n.type = :type)
        ORDER BY COALESCE(n.sentAt, n.scheduledAt) DESC, n.createdAt DESC
        """)
    Page<NotificationQueue> findByUserIdWithFilters(
            @Param("userId") UUID userId,
            @Param("status") NotificationStatus status,
            @Param("type") NotificationType type,
            Pageable pageable
    );

    Optional<NotificationQueue> findByIdAndUserId(UUID id, UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT n
        FROM NotificationQueue n
        WHERE n.status = :status
          AND n.scheduledAt <= :scheduledAt
        ORDER BY n.scheduledAt ASC
        """)
    List<NotificationQueue> findPendingForUpdate(
            @Param("status") NotificationStatus status,
            @Param("scheduledAt") LocalDateTime scheduledAt,
            Pageable pageable
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT n
        FROM NotificationQueue n
        WHERE n.status = :status
          AND n.retryCount < n.maxRetries
          AND n.updatedAt <= :updatedBefore
        ORDER BY n.updatedAt ASC
        """)
    List<NotificationQueue> findRetryableForUpdate(
            @Param("status") NotificationStatus status,
            @Param("updatedBefore") LocalDateTime updatedBefore,
            Pageable pageable
    );

    boolean existsBySpecialDateIdAndTypeAndScheduledAtBetween(
            UUID specialDateId,
            NotificationType type,
            LocalDateTime start,
            LocalDateTime end
    );
}
