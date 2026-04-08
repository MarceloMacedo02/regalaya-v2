package br.com.regalaya.contact.repository;

import br.com.regalaya.contact.domain.model.SpecialDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecialDateRepository extends JpaRepository<SpecialDate, UUID> {
    
    Optional<SpecialDate> findByIdAndContactId(UUID id, UUID contactId);
}
