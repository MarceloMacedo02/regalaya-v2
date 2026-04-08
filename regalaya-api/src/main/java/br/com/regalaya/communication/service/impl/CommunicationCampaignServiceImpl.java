package br.com.regalaya.communication.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.admin.repository.CustomerProfileRepository;
import br.com.regalaya.admin.services.CustomerSegmentationService;
import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.communication.domain.enums.CommunicationCampaignStatus;
import br.com.regalaya.communication.domain.enums.CommunicationDeliveryStatus;
import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.domain.model.CommunicationCampaign;
import br.com.regalaya.communication.domain.model.CommunicationDelivery;
import br.com.regalaya.communication.dto.request.CommunicationCampaignRequest;
import br.com.regalaya.communication.dto.response.CommunicationCampaignResponse;
import br.com.regalaya.communication.dto.response.CommunicationDeliveryResponse;
import br.com.regalaya.communication.repository.CommunicationCampaignRepository;
import br.com.regalaya.communication.repository.CommunicationDeliveryRepository;
import br.com.regalaya.communication.repository.CommunicationTemplateRepository;
import br.com.regalaya.communication.service.CommunicationCampaignService;
import br.com.regalaya.shared.exception.BusinessException;
import br.com.regalaya.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunicationCampaignServiceImpl implements CommunicationCampaignService {

    private static final int WHATSAPP_LIMIT_PER_24H = 100;

    private final CommunicationCampaignRepository campaignRepository;
    private final CommunicationDeliveryRepository deliveryRepository;
    private final CommunicationTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public CommunicationCampaignResponse sendCampaign(CommunicationCampaignRequest request) {
        Assert.notNull(request, "Communication campaign request cannot be null");

        var template = templateRepository.findById(request.templateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template não encontrado: " + request.templateId()));

        if (request.type() != template.getType()) {
            throw new BusinessException("O template selecionado não corresponde ao canal da campanha");
        }
        if (!request.sendNow() && request.scheduledAt() == null) {
            throw new BusinessException("Campanhas agendadas exigem data e hora");
        }

        List<User> recipients = resolveRecipients(request);
        String previewContent = renderPreview(template.getContent(), request.customization());

        CommunicationCampaign campaign = campaignRepository.save(CommunicationCampaign.builder()
                .name(request.name())
                .type(request.type())
                .segmentCode(request.segmentCode().toUpperCase(Locale.ROOT))
                .filtersJson(writeJson(request.customFilters()))
                .templateId(template.getId())
                .templateName(template.getName())
                .status(request.sendNow() ? CommunicationCampaignStatus.SENT : CommunicationCampaignStatus.SCHEDULED)
                .scheduledAt(request.sendNow() ? null : request.scheduledAt())
                .recipientCount(recipients.size())
                .rateLimitedCount(0)
                .previewContent(previewContent)
                .build());

        int rateLimitedCount = 0;
        List<CommunicationDelivery> deliveries = new ArrayList<>();
        LocalDateTime dispatchTime = request.sendNow() ? LocalDateTime.now() : null;
        LocalDateTime rateLimitWindow = LocalDateTime.now().minusHours(24);

        for (User recipient : recipients) {
            CommunicationDeliveryStatus status = request.sendNow()
                    ? CommunicationDeliveryStatus.SENT
                    : CommunicationDeliveryStatus.PENDING;
            String errorMessage = null;

            if (request.type() == CommunicationType.WHATSAPP) {
                if (recipient.getPhone() == null || recipient.getPhone().isBlank()) {
                    status = CommunicationDeliveryStatus.FAILED;
                    errorMessage = "Cliente sem número de WhatsApp";
                } else {
                    long recentCount = deliveryRepository.countByRecipientPhoneAndTypeAndDispatchedAtAfter(
                            recipient.getPhone(), CommunicationType.WHATSAPP, rateLimitWindow
                    );
                    if (recentCount >= WHATSAPP_LIMIT_PER_24H) {
                        status = CommunicationDeliveryStatus.FAILED;
                        errorMessage = "Rate limit de WhatsApp excedido para este número";
                        rateLimitedCount++;
                    }
                }
            }

            if (request.type() == CommunicationType.EMAIL && (recipient.getEmail() == null || recipient.getEmail().isBlank())) {
                status = CommunicationDeliveryStatus.FAILED;
                errorMessage = "Cliente sem email cadastrado";
            }

            deliveries.add(CommunicationDelivery.builder()
                    .campaign(campaign)
                    .recipientId(recipient.getId())
                    .recipientName(recipient.getName())
                    .recipientEmail(recipient.getEmail())
                    .recipientPhone(recipient.getPhone())
                    .type(request.type())
                    .status(status)
                    .errorMessage(errorMessage)
                    .dispatchedAt(status == CommunicationDeliveryStatus.SENT ? dispatchTime : null)
                    .opened(false)
                    .clicked(false)
                    .build());
        }

        deliveryRepository.saveAll(deliveries);
        campaign.setRateLimitedCount(rateLimitedCount);
        campaign = campaignRepository.save(campaign);

        log.info("Campanha {} criada com {} destinatários", campaign.getId(), campaign.getRecipientCount());
        return toResponse(campaign, deliveries);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommunicationCampaignResponse> findAll() {
        return campaignRepository.findAll().stream()
                .sorted(Comparator.comparing(CommunicationCampaign::getCreatedAt).reversed())
                .map(campaign -> toResponse(campaign, deliveryRepository.findByCampaignId(campaign.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CommunicationCampaignResponse findById(UUID id) {
        var campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada: " + id));
        return toResponse(campaign, deliveryRepository.findByCampaignId(id));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Campanha não encontrada: " + id);
        }
        deliveryRepository.deleteAll(deliveryRepository.findByCampaignId(id));
        campaignRepository.deleteById(id);
    }

    private List<User> resolveRecipients(CommunicationCampaignRequest request) {
        List<User> baseRecipients = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.USER || user.getRole() == Role.CLIENT)
                .toList();

        if (request.selectedCustomerIds() != null && !request.selectedCustomerIds().isEmpty()) {
            return baseRecipients.stream()
                    .filter(user -> request.selectedCustomerIds().contains(user.getId()))
                    .toList();
        }

        return switch (request.segmentCode().toUpperCase(Locale.ROOT)) {
            case "ALL" -> baseRecipients;
            case "VIP" -> baseRecipients.stream().filter(this::isVip).toList();
            case "NEW" -> baseRecipients.stream().filter(this::isNewCustomer).toList();
            case "INACTIVE" -> baseRecipients.stream().filter(this::isInactiveCustomer).toList();
            case "CUSTOM" -> applyCustomFilters(baseRecipients, request.customFilters());
            default -> throw new BusinessException("Segmento de clientes inválido: " + request.segmentCode());
        };
    }

    private List<User> applyCustomFilters(List<User> recipients, Map<String, String> filters) {
        if (filters == null || filters.isEmpty()) {
            return recipients;
        }

        return recipients.stream()
                .filter(user -> {
                    String search = filters.get("search");
                    if (search != null && !search.isBlank()) {
                        String normalizedSearch = search.toLowerCase(Locale.ROOT);
                        boolean matches = user.getName().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                                || user.getEmail().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                                || (user.getPhone() != null && user.getPhone().contains(normalizedSearch));
                        if (!matches) {
                            return false;
                        }
                    }

                    String status = filters.get("status");
                    if (status != null && !status.isBlank() && !status.equalsIgnoreCase(user.getStatus())) {
                        return false;
                    }

                    String minOrders = filters.get("minOrders");
                    if (minOrders != null && customerProfileRepository.countByUserId(user.getId()) < Integer.parseInt(minOrders)) {
                        return false;
                    }

                    String minTotalSpent = filters.get("minTotalSpent");
                    if (minTotalSpent != null) {
                        BigDecimal ltv = customerProfileRepository.getLtvByUserId(user.getId());
                        if (ltv.compareTo(new BigDecimal(minTotalSpent)) < 0) {
                            return false;
                        }
                    }

                    return true;
                })
                .toList();
    }

    private boolean isVip(User user) {
        return customerProfileRepository.getLtvByUserId(user.getId())
                .compareTo(CustomerSegmentationService.VIP_LTV_THRESHOLD) > 0;
    }

    private boolean isNewCustomer(User user) {
        return user.getCreatedAt() != null && user.getCreatedAt().isAfter(LocalDateTime.now().minusMonths(3));
    }

    private boolean isInactiveCustomer(User user) {
        LocalDate lastPurchase = customerProfileRepository.getLastPurchaseDate(user.getId());
        return lastPurchase == null || ChronoUnit.MONTHS.between(lastPurchase, LocalDate.now()) >= 6;
    }

    private String renderPreview(String content, Map<String, String> customization) {
        String preview = content;
        if (customization == null || customization.isEmpty()) {
            return preview;
        }

        for (Map.Entry<String, String> entry : customization.entrySet()) {
            preview = preview.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return preview;
    }

    private String writeJson(Map<String, String> value) {
        if (value == null || value.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new BusinessException("Não foi possível serializar os filtros da campanha", e);
        }
    }

    private CommunicationCampaignResponse toResponse(CommunicationCampaign campaign, List<CommunicationDelivery> deliveries) {
        long opened = deliveries.stream().filter(CommunicationDelivery::isOpened).count();
        long clicked = deliveries.stream().filter(CommunicationDelivery::isClicked).count();
        int base = Math.max(deliveries.size(), 1);

        return new CommunicationCampaignResponse(
                campaign.getId(),
                campaign.getName(),
                campaign.getType(),
                campaign.getSegmentCode(),
                campaign.getTemplateName(),
                campaign.getStatus(),
                campaign.getRecipientCount(),
                campaign.getRateLimitedCount(),
                campaign.getScheduledAt(),
                campaign.getCreatedAt(),
                campaign.getPreviewContent(),
                (opened * 100.0) / base,
                (clicked * 100.0) / base,
                deliveries.stream().map(delivery -> new CommunicationDeliveryResponse(
                        delivery.getId(),
                        delivery.getRecipientId(),
                        delivery.getRecipientName(),
                        delivery.getRecipientEmail(),
                        delivery.getRecipientPhone(),
                        delivery.getStatus(),
                        delivery.getErrorMessage(),
                        delivery.getDispatchedAt(),
                        delivery.isOpened(),
                        delivery.isClicked()
                )).toList()
        );
    }
}
