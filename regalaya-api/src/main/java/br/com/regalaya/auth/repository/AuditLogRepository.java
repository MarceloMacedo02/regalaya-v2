package br.com.regalaya.auth.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.auth.domain.model.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

  Page<AuditLog> findByUserId(UUID userId, Pageable pageable);

  Page<AuditLog> findByEventType(String eventType, Pageable pageable);

  Page<AuditLog> findBySuccessFalse(Pageable pageable);

  @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId AND a.createdAt >= :since ORDER BY a.createdAt DESC")
  List<AuditLog> findRecentByUser(@Param("userId") UUID userId, @Param("since") LocalDateTime since);

  long countByEventTypeAndCreatedAtAfter(String eventType, LocalDateTime since);

  long countByIpAddressAndCreatedAtAfter(String ipAddress, LocalDateTime since);
}
