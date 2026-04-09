package br.com.regalaya.ai.repository;

import br.com.regalaya.ai.domain.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
    List<Recommendation> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
