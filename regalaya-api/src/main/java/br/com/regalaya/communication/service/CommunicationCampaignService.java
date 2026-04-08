package br.com.regalaya.communication.service;

import java.util.List;
import java.util.UUID;

import br.com.regalaya.communication.dto.request.CommunicationCampaignRequest;
import br.com.regalaya.communication.dto.response.CommunicationCampaignResponse;

public interface CommunicationCampaignService {

    CommunicationCampaignResponse sendCampaign(CommunicationCampaignRequest request);

    List<CommunicationCampaignResponse> findAll();

    CommunicationCampaignResponse findById(UUID id);

    void delete(UUID id);
}
