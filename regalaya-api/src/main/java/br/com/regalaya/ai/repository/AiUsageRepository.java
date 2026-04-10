package br.com.regalaya.ai.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.ai.domain.model.AiUsage;

@Repository
public interface AiUsageRepository extends JpaRepository<AiUsage, UUID> {

    Optional<AiUsage> findByUserIdAndUsageDate(UUID userId, LocalDate usageDate);

    @Query("SELECT a FROM AiUsage a WHERE a.userId = :userId AND a.usageDate BETWEEN :start AND :end ORDER BY a.usageDate ASC")
    List<AiUsage> findByUserIdAndDateRange(@Param("userId") UUID userId,
                                           @Param("start") LocalDate start,
                                           @Param("end") LocalDate end);

    @Query("SELECT SUM(a.requestCount) FROM AiUsage a WHERE a.userId = :userId AND a.usageDate BETWEEN :start AND :end")
    Long sumRequestsByUserIdAndDateRange(@Param("userId") UUID userId,
                                         @Param("start") LocalDate start,
                                         @Param("end") LocalDate end);

    @Query("SELECT SUM(a.costEstimate) FROM AiUsage a WHERE a.usageDate BETWEEN :start AND :end")
    Double sumCostByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a.usageDate, SUM(a.requestCount) FROM AiUsage a WHERE a.usageDate BETWEEN :start AND :end GROUP BY a.usageDate ORDER BY a.usageDate ASC")
    List<Object[]> sumRequestsGroupedByDate(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
