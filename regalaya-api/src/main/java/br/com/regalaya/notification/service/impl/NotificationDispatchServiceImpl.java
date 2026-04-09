package br.com.regalaya.notification.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.notification.config.NotificationProperties;
import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.repository.NotificationQueueRepository;
import br.com.regalaya.notification.service.NotificationDeliveryAdapter;
import br.com.regalaya.notification.service.NotificationDispatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationDispatchServiceImpl implements NotificationDispatchService {

    private final NotificationQueueRepository notificationQueueRepository;
    private final List<NotificationDeliveryAdapter> deliveryAdapters;
    private final NotificationProperties notificationProperties;

    @Override
    @Transactional
    public int dispatchPendingMessages() {
        List<NotificationQueue> pending = notificationQueueRepository.findPendingForUpdate(
                NotificationStatus.PENDING,
                LocalDateTime.now(),
                PageRequest.of(0, notificationProperties.getPollingBatchSize())
        );

        int processed = 0;
        for (NotificationQueue notification : pending) {
            processed += dispatchSingle(notification);
        }

        log.info("Notification dispatch finished. processed={}", processed);
        return processed;
    }

    @Override
    @Transactional
    public int retryFailedMessages() {
        List<NotificationQueue> retryable = notificationQueueRepository.findRetryableForUpdate(
                NotificationStatus.FAILED,
                LocalDateTime.now().minusMinutes(30),
                PageRequest.of(0, notificationProperties.getPollingBatchSize())
        );

        for (NotificationQueue notification : retryable) {
            notification.setStatus(NotificationStatus.PENDING);
            notification.setErrorMessage(null);
            notification.setScheduledAt(LocalDateTime.now());
        }

        notificationQueueRepository.saveAll(retryable);
        log.info("Notification retry queue reset finished. retryable={}", retryable.size());
        return retryable.size();
    }

    private int dispatchSingle(NotificationQueue notification) {
        notification.setStatus(NotificationStatus.SENDING);
        notificationQueueRepository.save(notification);

        try {
            for (NotificationDeliveryAdapter adapter : deliveryAdapters) {
                adapter.deliver(notification);
            }
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notification.setErrorMessage(null);
            notificationQueueRepository.save(notification);
            return 1;
        } catch (Exception ex) {
            int nextRetryCount = notification.getRetryCount() + 1;
            notification.setRetryCount(nextRetryCount);
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(ex.getMessage());
            notificationQueueRepository.save(notification);
            log.warn("Notification dispatch failed. id={}, retryCount={}, maxRetries={}",
                    notification.getId(), nextRetryCount, notification.getMaxRetries(), ex);
            return 0;
        }
    }
}
