package br.com.regalaya.notification.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.contact.domain.model.SpecialDate;
import br.com.regalaya.contact.repository.SpecialDateRepository;
import br.com.regalaya.notification.config.NotificationProperties;
import br.com.regalaya.notification.domain.enums.NotificationType;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.repository.NotificationQueueRepository;
import br.com.regalaya.notification.service.NotificationSchedulingService;
import br.com.regalaya.notification.service.NotificationTemplateRenderer;
import br.com.regalaya.notification.service.model.NotificationPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSchedulingServiceImpl implements NotificationSchedulingService {

    private final SpecialDateRepository specialDateRepository;
    private final NotificationQueueRepository notificationQueueRepository;
    private final NotificationTemplateRenderer notificationTemplateRenderer;
    private final NotificationProperties notificationProperties;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public int checkUpcomingDates() {
        return checkUpcomingDates(LocalDate.now(resolveDefaultZoneId()));
    }

    @Override
    @Transactional
    public int checkUpcomingDates(LocalDate notificationDate) {
        int created = 0;
        created += createNotificationsForOffset(notificationDate, 7, NotificationType.DATE_REMINDER_7D);
        created += createNotificationsForOffset(notificationDate, 1, NotificationType.DATE_REMINDER_1D);
        log.info("Notification scheduling finished. created={}, notificationDate={}", created, notificationDate);
        return created;
    }

    public int createNotificationsForOffset(LocalDate notificationDate, int offsetDays) {
        return createNotificationsForOffset(notificationDate, offsetDays, resolveNotificationType(offsetDays));
    }

    private int createNotificationsForOffset(LocalDate notificationDate, int offsetDays, NotificationType type) {
        LocalDate targetDate = notificationDate.plusDays(offsetDays);
        List<SpecialDate> eligibleDates = specialDateRepository.findEligibleForReminder(targetDate, notificationDate);
        int created = 0;

        for (SpecialDate specialDate : eligibleDates) {
            ZoneId zoneId = resolveDefaultZoneId();
            LocalDateTime dayStart = notificationDate.atStartOfDay();
            LocalDateTime dayEnd = notificationDate.atTime(LocalTime.MAX);

            if (notificationQueueRepository.existsBySpecialDateIdAndTypeAndScheduledAtBetween(
                    specialDate.getId(),
                    type,
                    dayStart,
                    dayEnd
            )) {
                continue;
            }

            NotificationPayload payload = buildPayload(specialDate, type, zoneId);
            NotificationQueue queue = NotificationQueue.builder()
                    .userId(payload.userId())
                    .contactId(payload.contactId())
                    .specialDateId(payload.specialDateId())
                    .type(type)
                    .recipientPhone(payload.recipientPhone())
                    .recipientEmail(payload.recipientEmail())
                    .messageTemplate(notificationTemplateRenderer.renderMessage(payload))
                    .messageData(serializePayload(payload))
                    .scheduledAt(payload.scheduledAt())
                    .maxRetries(notificationProperties.getMaxRetries())
                    .build();

            notificationQueueRepository.save(queue);
            specialDate.setLastNotified(notificationDate);
            specialDateRepository.save(specialDate);
            created++;
        }

        return created;
    }

    private NotificationPayload buildPayload(SpecialDate specialDate, NotificationType type, ZoneId zoneId) {
        String ctaLabel = "Ver sugestoes";
        String ctaUrl = notificationProperties.getAccountNotificationsPath()
                + "?contactId=" + specialDate.getContact().getId()
                + "&specialDateId=" + specialDate.getId();

        return new NotificationPayload(
                specialDate.getContact().getUser().getId(),
                specialDate.getContact().getId(),
                specialDate.getId(),
                type,
                specialDate.getContact().getName(),
                specialDate.getType(),
                specialDate.getDate(),
                ctaLabel,
                ctaUrl,
                LocalDateTime.now(zoneId),
                specialDate.getContact().getPhone(),
                specialDate.getContact().getUser().getEmail()
        );
    }

    private String serializePayload(NotificationPayload payload) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("title", notificationTemplateRenderer.renderTitle(payload));
        data.put("contactName", payload.contactName());
        data.put("specialDateType", payload.specialDateType());
        data.put("specialDate", payload.specialDate().toString());
        data.put("ctaLabel", payload.ctaLabel());
        data.put("ctaUrl", payload.ctaUrl());
        data.put("recipientPhone", payload.recipientPhone());
        data.put("recipientEmail", payload.recipientEmail());

        try {
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Falha ao serializar payload da notificacao", ex);
        }
    }

    private NotificationType resolveNotificationType(int daysBefore) {
        return switch (daysBefore) {
            case 7 -> NotificationType.DATE_REMINDER_7D;
            case 1 -> NotificationType.DATE_REMINDER_1D;
            default -> throw new IllegalArgumentException("Offset de lembrete nao suportado: " + daysBefore);
        };
    }

    private ZoneId resolveDefaultZoneId() {
        return ZoneId.of(notificationProperties.getDefaultTimezone());
    }
}
