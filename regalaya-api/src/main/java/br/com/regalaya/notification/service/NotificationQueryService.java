package br.com.regalaya.notification.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.enums.NotificationType;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.dto.responses.NotificationItemResponse;
import br.com.regalaya.notification.dto.responses.NotificationPageResponse;
import br.com.regalaya.notification.dto.responses.NotificationReadResponse;
import br.com.regalaya.notification.repository.NotificationQueueRepository;
import br.com.regalaya.shared.exception.BusinessException;
import br.com.regalaya.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationQueryService {

    private final NotificationQueueRepository notificationQueueRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public NotificationPageResponse listUserNotifications(
            UUID userId,
            String status,
            String type,
            int page,
            int size
    ) {
        var notificationsPage = notificationQueueRepository.findByUserIdWithFilters(
                userId,
                parseStatus(status),
                parseType(type),
                PageRequest.of(page, size)
        );

        return new NotificationPageResponse(
                notificationsPage.getContent().stream().map(this::toResponse).toList(),
                notificationsPage.getNumber(),
                notificationsPage.getSize(),
                notificationsPage.getTotalElements(),
                notificationsPage.getTotalPages(),
                notificationsPage.isFirst(),
                notificationsPage.isLast(),
                notificationsPage.isEmpty(),
                notificationsPage.getNumberOfElements()
        );
    }

    @Transactional
    public NotificationReadResponse markAsRead(UUID userId, UUID notificationId) {
        NotificationQueue notification = notificationQueueRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação", notificationId));

        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
            notificationQueueRepository.save(notification);
        }

        return new NotificationReadResponse(notification.getId(), notification.getReadAt());
    }

    private NotificationItemResponse toResponse(NotificationQueue notification) {
        Map<String, String> messageData = readMessageData(notification.getMessageData());
        LocalDate specialDate = parseSpecialDate(messageData.get("specialDate"));
        LocalDateTime specialDateValue = specialDate != null ? specialDate.atStartOfDay() : null;

        return new NotificationItemResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getStatus().name(),
                messageData.getOrDefault("title", "Notificação"),
                notification.getMessageTemplate(),
                messageData.getOrDefault("ctaLabel", "Abrir"),
                messageData.get("ctaUrl"),
                messageData.get("contactName"),
                messageData.get("specialDateType"),
                specialDateValue,
                notification.getScheduledAt(),
                notification.getSentAt(),
                notification.getReadAt(),
                notification.isRead(),
                notification.getRetryCount()
        );
    }

    private Map<String, String> readMessageData(String rawData) {
        if (rawData == null || rawData.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(rawData, new TypeReference<>() {});
        } catch (Exception ex) {
            return Map.of();
        }
    }

    private LocalDate parseSpecialDate(String rawDate) {
        if (rawDate == null || rawDate.isBlank()) {
            return null;
        }
        return LocalDate.parse(rawDate);
    }

    private NotificationStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return NotificationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Status de notificação inválido: " + status);
        }
    }

    private NotificationType parseType(String type) {
        if (type == null || type.isBlank()) {
            return null;
        }
        try {
            return NotificationType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Tipo de notificação inválido: " + type);
        }
    }
}
