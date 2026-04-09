package br.com.regalaya.notification.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.notification.domain.model.NotificationPreference;
import br.com.regalaya.notification.dto.NotificationPreferenceDto;
import br.com.regalaya.notification.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository repository;

    @Transactional(readOnly = true)
    public NotificationPreferenceDto getPreferences(UUID userId) {
        NotificationPreference pref = repository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
        
        return NotificationPreferenceDto.builder()
                .emailEnabled(pref.getEmailEnabled())
                .whatsappEnabled(pref.getWhatsappEnabled())
                .marketingEnabled(pref.getMarketingEnabled())
                .transactionalEnabled(pref.getTransactionalEnabled())
                .build();
    }

    @Transactional
    public NotificationPreferenceDto updatePreferences(UUID userId, NotificationPreferenceDto dto) {
        NotificationPreference pref = repository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
        
        if (dto.getEmailEnabled() != null) pref.setEmailEnabled(dto.getEmailEnabled());
        if (dto.getWhatsappEnabled() != null) pref.setWhatsappEnabled(dto.getWhatsappEnabled());
        if (dto.getMarketingEnabled() != null) pref.setMarketingEnabled(dto.getMarketingEnabled());
        if (dto.getTransactionalEnabled() != null) pref.setTransactionalEnabled(dto.getTransactionalEnabled());
        
        pref = repository.save(pref);
        
        return NotificationPreferenceDto.builder()
                .emailEnabled(pref.getEmailEnabled())
                .whatsappEnabled(pref.getWhatsappEnabled())
                .marketingEnabled(pref.getMarketingEnabled())
                .transactionalEnabled(pref.getTransactionalEnabled())
                .build();
    }

    @Transactional
    public boolean unsubscribe(String token) {
        return repository.findByUnsubscribeToken(token)
                .map(pref -> {
                    pref.setEmailEnabled(false);
                    pref.setMarketingEnabled(false);
                    repository.save(pref);
                    return true;
                })
                .orElse(false);
    }

    private NotificationPreference createDefaultPreferences(UUID userId) {
        return NotificationPreference.builder()
                .userId(userId)
                .emailEnabled(true)
                .whatsappEnabled(true)
                .marketingEnabled(true)
                .transactionalEnabled(true)
                .unsubscribeToken(UUID.randomUUID().toString())
                .build();
    }
}
