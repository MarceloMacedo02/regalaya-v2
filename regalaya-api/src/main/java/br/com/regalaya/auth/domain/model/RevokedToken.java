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
@Table(name = "revoked_tokens", indexes = {
    @Index(name = "idx_revoked_token_jti", columnList = "jti", unique = true),
    @Index(name = "idx_revoked_token_expires", columnList = "expiresAt")
})
@Getter
@Setter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, of = "jti")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevokedToken extends BaseEntity {

    @Column(name = "jti", nullable = false, unique = true, length = 255)
    private String jti;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "token_type", nullable = false, length = 20)
    private String tokenType;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "revoked_at", nullable = false)
    private LocalDateTime revokedAt;

    @Column(name = "revocation_reason", length = 100)
    private String revocationReason;
}
