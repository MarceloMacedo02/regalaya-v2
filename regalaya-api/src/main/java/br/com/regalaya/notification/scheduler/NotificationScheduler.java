package br.com.regalaya.notification.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.com.regalaya.notification.service.NotificationDispatchService;
import br.com.regalaya.notification.service.NotificationSchedulingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationSchedulingService notificationSchedulingService;
    private final NotificationDispatchService notificationDispatchService;

    @Scheduled(cron = "0 0 * * * *")
    public void checkUpcomingDates() {
        log.debug("Running upcoming special dates scheduler");
        notificationSchedulingService.checkUpcomingDates();
    }

    @Scheduled(cron = "0 * * * * *")
    public void dispatchPendingMessages() {
        log.debug("Running notification dispatch scheduler");
        notificationDispatchService.dispatchPendingMessages();
    }

    @Scheduled(cron = "0 */30 * * * *")
    public void retryFailedMessages() {
        log.debug("Running notification retry scheduler");
        notificationDispatchService.retryFailedMessages();
    }
}
