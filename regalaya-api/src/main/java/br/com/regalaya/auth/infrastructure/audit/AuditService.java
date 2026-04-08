package br.com.regalaya.auth.infrastructure.audit;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import br.com.regalaya.auth.domain.model.AuditLog;
import br.com.regalaya.auth.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAuditEvent(AuditEvent event) {
        AuditLog auditLog = AuditLog.builder()
                .userId(event.userId())
                .eventType(event.eventType())
                .description(event.description())
                .ipAddress(event.ipAddress())
                .userAgent(event.userAgent())
                .metadata(event.metadata())
                .success(event.success())
                .build();

        auditLogRepository.save(auditLog);
        log.info("Audit logged: {} - {}", event.eventType(), event.description());
    }

    public Page<AuditLog> getUserAuditLogs(UUID userId, Pageable pageable) {
        return auditLogRepository.findByUserId(userId, pageable);
    }

    public Page<AuditLog> getFailedAttempts(Pageable pageable) {
        return auditLogRepository.findBySuccessFalse(pageable);
    }

    public long countEventsByTypeSince(String eventType, LocalDateTime since) {
        return auditLogRepository.countByEventTypeAndCreatedAtAfter(eventType, since);
    }

    public long countEventsByIpSince(String ipAddress, LocalDateTime since) {
        return auditLogRepository.countByIpAddressAndCreatedAtAfter(ipAddress, since);
    }

    public record AuditEvent(
            UUID userId,
            String eventType,
            String description,
            String ipAddress,
            String userAgent,
            String metadata,
            boolean success
    ) {
        public static AuditEvent loginSuccess(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "LOGIN_SUCCESS", "User logged in successfully", ip, ua, null, true);
        }

        public static AuditEvent loginFailed(String email, String ip, String ua) {
            return new AuditEvent(null, "LOGIN_FAILED", "Failed login attempt for email: " + email, ip, ua, null, false);
        }

        public static AuditEvent logout(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "LOGOUT", "User logged out", ip, ua, null, true);
        }

        public static AuditEvent registerSuccess(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "REGISTER_SUCCESS", "New user registered", ip, ua, null, true);
        }

        public static AuditEvent passwordResetRequested(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "PASSWORD_RESET_REQUESTED", "Password reset requested", ip, ua, null, true);
        }

        public static AuditEvent passwordResetSuccess(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "PASSWORD_RESET_SUCCESS", "Password reset successfully", ip, ua, null, true);
        }

        public static AuditEvent passwordResetFailed(String email, String ip, String ua) {
            return new AuditEvent(null, "PASSWORD_RESET_FAILED", "Failed password reset for: " + email, ip, ua, null, false);
        }

        public static AuditEvent emailVerified(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "EMAIL_VERIFIED", "Email verified successfully", ip, ua, null, true);
        }

        public static AuditEvent tokenRefreshed(UUID userId, String ip, String ua) {
            return new AuditEvent(userId, "TOKEN_REFRESHED", "Access token refreshed", ip, ua, null, true);
        }

        public static AuditEvent tokenRevoked(UUID userId, String ip, String ua, String reason) {
            return new AuditEvent(userId, "TOKEN_REVOKED", "Token revoked: " + reason, ip, ua, null, true);
        }
    }
}
