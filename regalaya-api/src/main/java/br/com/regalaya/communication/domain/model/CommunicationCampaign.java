package br.com.regalaya.communication.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.communication.domain.enums.CommunicationCampaignStatus;
import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "communication_campaigns")
@Getter
@Setter
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationCampaign extends BaseEntity {

    @Column(nullable = false, length = 160)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommunicationType type;

    @Column(nullable = false, length = 40)
    private String segmentCode;

    @Column(columnDefinition = "TEXT")
    private String filtersJson;

    @Column(nullable = false)
    private UUID templateId;

    @Column(nullable = false, length = 120)
    private String templateName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommunicationCampaignStatus status;

    private LocalDateTime scheduledAt;

    @Column(nullable = false)
    private Integer recipientCount;

    @Column(nullable = false)
    private Integer rateLimitedCount;

    @Column(columnDefinition = "TEXT")
    private String previewContent;
}
