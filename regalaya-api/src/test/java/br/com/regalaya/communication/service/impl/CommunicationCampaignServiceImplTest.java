package br.com.regalaya.communication.service.impl;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.admin.repository.CustomerProfileRepository;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.domain.model.CommunicationTemplate;
import br.com.regalaya.communication.dto.request.CommunicationCampaignRequest;
import br.com.regalaya.communication.repository.CommunicationCampaignRepository;
import br.com.regalaya.communication.repository.CommunicationDeliveryRepository;
import br.com.regalaya.communication.repository.CommunicationTemplateRepository;
import br.com.regalaya.shared.exception.BusinessException;

@ExtendWith(MockitoExtension.class)
class CommunicationCampaignServiceImplTest {

    @Mock
    private CommunicationCampaignRepository campaignRepository;

    @Mock
    private CommunicationDeliveryRepository deliveryRepository;

    @Mock
    private CommunicationTemplateRepository templateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private CommunicationCampaignServiceImpl communicationCampaignService;

    @Test
    void sendCampaign_ShouldRejectTemplateWithDifferentChannel() {
        UUID templateId = UUID.randomUUID();
        CommunicationTemplate template = CommunicationTemplate.builder()
                .name("Boas-vindas")
                .type(CommunicationType.EMAIL)
                .content("Olá {{nome}}")
                .build();
        template.setId(templateId);

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));

        CommunicationCampaignRequest request = new CommunicationCampaignRequest(
                "Campanha WhatsApp",
                CommunicationType.WHATSAPP,
                "ALL",
                templateId,
                Map.of("nome", "Maria"),
                true,
                null,
                Map.of(),
                java.util.List.of()
        );

        assertThrows(BusinessException.class, () -> communicationCampaignService.sendCampaign(request));
    }
}
