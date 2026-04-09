package br.com.regalaya.contact.repository;

import br.com.regalaya.contact.domain.model.SpecialDate;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecialDateRepository extends JpaRepository<SpecialDate, UUID> {
    
    Optional<SpecialDate> findByIdAndContactId(UUID id, UUID contactId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT sd
        FROM SpecialDate sd
        JOIN FETCH sd.contact c
        JOIN FETCH c.user u
        WHERE (
            (sd.recurrence = 'ONCE' AND sd.date = :targetDate)
            OR (sd.recurrence = 'YEARLY' AND MONTH(sd.date) = MONTH(:targetDate) AND DAY(sd.date) = DAY(:targetDate))
            OR (sd.recurrence = 'MONTHLY' AND DAY(sd.date) = DAY(:targetDate))
        )
        AND (sd.lastNotified IS NULL OR sd.lastNotified < :notificationDate)
        """)
    List<SpecialDate> findEligibleForReminder(
            @Param("targetDate") LocalDate targetDate,
            @Param("notificationDate") LocalDate notificationDate
    );
}
