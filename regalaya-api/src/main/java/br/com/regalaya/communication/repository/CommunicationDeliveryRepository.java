package br.com.regalaya.communication.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.domain.model.CommunicationDelivery;

@Repository
public interface CommunicationDeliveryRepository extends JpaRepository<CommunicationDelivery, UUID> {

    List<CommunicationDelivery> findByCampaignId(UUID campaignId);

    long countByRecipientPhoneAndTypeAndDispatchedAtAfter(
            String recipientPhone,
            CommunicationType type,
            LocalDateTime dispatchedAt
    );
}
