package br.com.regalaya.address.repository;

import br.com.regalaya.address.domain.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {

    List<Address> findByUserIdAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(UUID userId);

    Optional<Address> findByIdAndUserId(UUID id, UUID userId);

    Optional<Address> findByUserIdAndIsDefaultTrueAndIsActiveTrue(UUID userId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.id <> :addressId")
    void clearDefaultForUser(@Param("userId") UUID userId, @Param("addressId") UUID addressId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
    void clearAllDefaultsForUser(@Param("userId") UUID userId);

    boolean existsByIdAndUserId(UUID id, UUID userId);
}
