package br.com.regalaya.auth.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.auth.domain.model.RevokedToken;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, UUID> {

    boolean existsByJti(String jti);

    Optional<RevokedToken> findByJti(String jti);

    List<RevokedToken> findByUserId(UUID userId);

    @Modifying
    @Query("DELETE FROM RevokedToken rt WHERE rt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM RevokedToken rt WHERE rt.userId = :userId")
    void revokeAllUserTokens(@Param("userId") UUID userId);
}
