package br.com.regalaya.communication.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.communication.domain.enums.CommunicationDeliveryStatus;
import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "communication_deliveries")
@Getter
@Setter
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationDelivery extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private CommunicationCampaign campaign;

    @Column(nullable = false)
    private UUID recipientId;

    @Column(nullable = false, length = 100)
    private String recipientName;

    @Column(length = 150)
    private String recipientEmail;

    @Column(length = 30)
    private String recipientPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommunicationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommunicationDeliveryStatus status;

    @Column(length = 255)
    private String errorMessage;

    private LocalDateTime dispatchedAt;

    @Column(nullable = false)
    private boolean opened;

    @Column(nullable = false)
    private boolean clicked;
}
