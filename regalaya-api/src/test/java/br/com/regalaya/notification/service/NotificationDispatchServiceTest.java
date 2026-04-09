package br.com.regalaya.notification.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.regalaya.notification.config.NotificationProperties;
import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.enums.NotificationType;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.repository.NotificationQueueRepository;
import br.com.regalaya.notification.service.impl.NotificationDispatchServiceImpl;

@ExtendWith(MockitoExtension.class)
class NotificationDispatchServiceTest {

    @Mock
    private NotificationQueueRepository notificationQueueRepository;

    @Mock
    private NotificationDeliveryAdapter notificationDeliveryAdapter;

    @InjectMocks
    private NotificationDispatchServiceImpl notificationDispatchService;

    @BeforeEach
    void setUp() {
        NotificationProperties properties = new NotificationProperties();
        properties.setPollingBatchSize(20);
        notificationDispatchService = new NotificationDispatchServiceImpl(
                notificationQueueRepository,
                List.of(notificationDeliveryAdapter),
                properties
        );
    }

    @Test
    void dispatchPendingMessages_MarksNotificationAsSent() {
        NotificationQueue notification = NotificationQueue.builder()
                .userId(UUID.randomUUID())
                .type(NotificationType.DATE_REMINDER_7D)
                .messageTemplate("Mensagem")
                .scheduledAt(LocalDateTime.now().minusMinutes(2))
                .status(NotificationStatus.PENDING)
                .build();

        when(notificationQueueRepository.findPendingForUpdate(eq(NotificationStatus.PENDING), any(), any()))
                .thenReturn(List.of(notification));

        int processed = notificationDispatchService.dispatchPendingMessages();

        assertEquals(1, processed);
        assertEquals(NotificationStatus.SENT, notification.getStatus());
        verify(notificationDeliveryAdapter).deliver(notification);
        verify(notificationQueueRepository, times(2)).save(notification);
    }

    @Test
    void dispatchPendingMessages_WhenAdapterFails_MarksNotificationAsFailed() {
        NotificationQueue notification = NotificationQueue.builder()
                .userId(UUID.randomUUID())
                .type(NotificationType.DATE_REMINDER_1D)
                .messageTemplate("Mensagem")
                .scheduledAt(LocalDateTime.now().minusMinutes(2))
                .status(NotificationStatus.PENDING)
                .retryCount(0)
                .maxRetries(3)
                .build();

        when(notificationQueueRepository.findPendingForUpdate(eq(NotificationStatus.PENDING), any(), any()))
                .thenReturn(List.of(notification));
        doThrow(new IllegalStateException("Canal indisponível")).when(notificationDeliveryAdapter).deliver(notification);

        int processed = notificationDispatchService.dispatchPendingMessages();

        assertEquals(0, processed);
        assertEquals(NotificationStatus.FAILED, notification.getStatus());
        assertEquals(1, notification.getRetryCount());
    }

    @Test
    void retryFailedMessages_RequeuesEligibleNotifications() {
        NotificationQueue notification = NotificationQueue.builder()
                .userId(UUID.randomUUID())
                .type(NotificationType.DATE_REMINDER_7D)
                .messageTemplate("Mensagem")
                .scheduledAt(LocalDateTime.now().minusHours(1))
                .status(NotificationStatus.FAILED)
                .retryCount(1)
                .maxRetries(3)
                .build();

        when(notificationQueueRepository.findRetryableForUpdate(eq(NotificationStatus.FAILED), any(), any()))
                .thenReturn(List.of(notification));

        int requeued = notificationDispatchService.retryFailedMessages();

        assertEquals(1, requeued);
        assertEquals(NotificationStatus.PENDING, notification.getStatus());
        verify(notificationQueueRepository).saveAll(List.of(notification));
    }
}
