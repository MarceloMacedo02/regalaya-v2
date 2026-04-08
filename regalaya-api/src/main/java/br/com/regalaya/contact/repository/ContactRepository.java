package br.com.regalaya.contact.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.contact.domain.model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findByUserId(UUID userId);
    
    List<Contact> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    List<Contact> findByUserIdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(UUID userId, String name);
    
    Optional<Contact> findByIdAndUserId(UUID id, UUID userId);
    
    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.specialDates WHERE c.id = :id AND c.user.id = :userId")
    Optional<Contact> findByIdAndUserIdWithSpecialDates(@Param("id") UUID id, @Param("userId") UUID userId);
    
    void deleteByUserId(UUID userId);
}
