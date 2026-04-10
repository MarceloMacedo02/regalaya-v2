package br.com.regalaya.settings.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.settings.domain.model.StoreSettings;
import br.com.regalaya.settings.dto.requests.UpdateStoreSettingsRequest;
import br.com.regalaya.settings.dto.responses.StoreSettingResponse;
import br.com.regalaya.settings.repository.StoreSettingsRepository;

@Service
public class StoreSettingsService {

    private final StoreSettingsRepository storeSettingsRepository;

    public StoreSettingsService(StoreSettingsRepository storeSettingsRepository) {
        this.storeSettingsRepository = storeSettingsRepository;
    }

    @Transactional(readOnly = true)
    public List<StoreSettingResponse> findAll() {
        return storeSettingsRepository.findAllByOrderByCategoryAscSettingKeyAsc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<StoreSettingResponse> findByCategory(String category) {
        return storeSettingsRepository.findByCategoryOrderBySettingKeyAsc(category)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public StoreSettingResponse findByKey(String key) {
        return storeSettingsRepository.findBySettingKey(key)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada: " + key));
    }

    @Transactional(readOnly = true)
    public Map<String, String> getAllAsMap() {
        return storeSettingsRepository.findAllByOrderByCategoryAscSettingKeyAsc()
                .stream()
                .collect(Collectors.toMap(StoreSettings::getSettingKey, StoreSettings::getSettingValue));
    }

    @Transactional
    public StoreSettingResponse update(String key, UpdateStoreSettingsRequest request) {
        StoreSettings setting = storeSettingsRepository.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada: " + key));
        setting.setSettingValue(request.getSettingValue());
        return toResponse(storeSettingsRepository.save(setting));
    }

    @Transactional
    public StoreSettingResponse updateBulk(Map<String, String> settings) {
        settings.forEach((key, value) -> {
            storeSettingsRepository.findBySettingKey(key).ifPresent(setting -> {
                setting.setSettingValue(value);
                storeSettingsRepository.save(setting);
            });
        });
        return findByKey(settings.keySet().iterator().next());
    }

    private StoreSettingResponse toResponse(StoreSettings setting) {
        return new StoreSettingResponse(
                setting.getSettingKey(), setting.getSettingValue(),
                setting.getCategory(), setting.getDescription());
    }
}
