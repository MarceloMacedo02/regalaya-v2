package br.com.regalaya.communication.repository;

import br.com.regalaya.communication.domain.model.CommunicationTemplate;
import br.com.regalaya.communication.domain.enums.CommunicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommunicationTemplateRepository extends JpaRepository<CommunicationTemplate, UUID> {

    List<CommunicationTemplate> findByType(CommunicationType type);

    List<CommunicationTemplate> findByIsActiveTrue();

    List<CommunicationTemplate> findByCategory(String category);

    Optional<CommunicationTemplate> findByName(String name);

    List<CommunicationTemplate> findByNameContainingIgnoreCase(String name);
}
