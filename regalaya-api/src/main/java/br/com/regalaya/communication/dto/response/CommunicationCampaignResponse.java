package br.com.regalaya.communication.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.com.regalaya.communication.domain.enums.CommunicationCampaignStatus;
import br.com.regalaya.communication.domain.enums.CommunicationType;

public record CommunicationCampaignResponse(
        UUID id,
        String name,
        CommunicationType type,
        String segmentCode,
        String templateName,
        CommunicationCampaignStatus status,
        Integer recipientCount,
        Integer rateLimitedCount,
        LocalDateTime scheduledAt,
        LocalDateTime createdAt,
        String previewContent,
        double openRate,
        double clickRate,
        List<CommunicationDeliveryResponse> deliveries
) {}
