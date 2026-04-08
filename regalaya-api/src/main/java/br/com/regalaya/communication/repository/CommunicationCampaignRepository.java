package br.com.regalaya.communication.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.regalaya.communication.domain.model.CommunicationCampaign;

@Repository
public interface CommunicationCampaignRepository extends JpaRepository<CommunicationCampaign, UUID> {
}
