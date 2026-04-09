package br.com.regalaya.notification.domain.model;

import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "email_enabled", nullable = false)
    @Builder.Default
    private Boolean emailEnabled = true;

    @Column(name = "whatsapp_enabled", nullable = false)
    @Builder.Default
    private Boolean whatsappEnabled = true;

    @Column(name = "marketing_enabled", nullable = false)
    @Builder.Default
    private Boolean marketingEnabled = true;

    @Column(name = "transactional_enabled", nullable = false)
    @Builder.Default
    private Boolean transactionalEnabled = true;

    @Column(name = "unsubscribe_token", unique = true)
    private String unsubscribeToken;
}
