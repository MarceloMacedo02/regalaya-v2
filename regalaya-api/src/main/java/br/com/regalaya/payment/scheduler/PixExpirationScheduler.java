package br.com.regalaya.payment.scheduler;

import br.com.regalaya.payment.services.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for processing expired PIX payments.
 * Runs every minute to check and update expired PIX payments.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PixExpirationScheduler {

    private final PaymentService paymentService;

    @Scheduled(fixedRate = 60000) // Every 1 minute
    public void processExpiredPixPayments() {
        log.debug("Running PIX expiration check");
        try {
            int count = paymentService.processExpiredPixPayments();
            if (count > 0) {
                log.info("Processed {} expired PIX payments", count);
            }
        } catch (Exception e) {
            log.error("Error processing expired PIX payments", e);
        }
    }
}
