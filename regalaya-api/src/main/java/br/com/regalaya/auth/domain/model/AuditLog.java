package br.com.regalaya.auth.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user_id", columnList = "userId"),
    @Index(name = "idx_audit_event_type", columnList = "eventType"),
    @Index(name = "idx_audit_created_at", columnList = "createdAt")
})
@Getter
@Setter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "success", nullable = false)
    private Boolean success = true;
}
