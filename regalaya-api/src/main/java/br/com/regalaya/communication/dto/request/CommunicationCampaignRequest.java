package br.com.regalaya.communication.dto.request;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommunicationCampaignRequest(
        @NotBlank @Size(min = 3, max = 160) String name,
        @NotNull CommunicationType type,
        @NotBlank String segmentCode,
        @NotNull UUID templateId,
        Map<String, String> customization,
        boolean sendNow,
        LocalDateTime scheduledAt,
        Map<String, String> customFilters,
        List<UUID> selectedCustomerIds
) {}
