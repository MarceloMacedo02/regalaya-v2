package br.com.regalaya.settings.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.regalaya.settings.domain.model.StoreSettings;

@Repository
public interface StoreSettingsRepository extends JpaRepository<StoreSettings, UUID> {

    Optional<StoreSettings> findBySettingKey(String key);

    List<StoreSettings> findByCategoryOrderBySettingKeyAsc(String category);

    List<StoreSettings> findAllByOrderByCategoryAscSettingKeyAsc();
}
