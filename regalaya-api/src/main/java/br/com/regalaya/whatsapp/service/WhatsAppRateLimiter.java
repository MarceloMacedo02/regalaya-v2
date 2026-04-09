package br.com.regalaya.whatsapp.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WhatsAppRateLimiter {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppRateLimiter.class);

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final int callsPerHour;

    public WhatsAppRateLimiter(@org.springframework.beans.factory.annotation.Value("${app.whatsapp.rate-limit.calls-per-hour:10}") int callsPerHour) {
        this.callsPerHour = callsPerHour;
    }

    public boolean tryConsume(String phoneNumber) {
        Bucket bucket = buckets.computeIfAbsent(phoneNumber, this::createBucket);
        return bucket.tryConsume(1);
    }

    private Bucket createBucket(String key) {
        Bandwidth limit = Bandwidth.simple(callsPerHour, Duration.ofHours(1));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public void reset(String phoneNumber) {
        buckets.remove(phoneNumber);
        log.info("Rate limit reset for {}", maskPhone(phoneNumber));
    }

    public int getAvailableTokens(String phoneNumber) {
        Bucket bucket = buckets.get(phoneNumber);
        return bucket != null ? (int) bucket.getAvailableTokens() : callsPerHour;
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "***";
        return phone.substring(0, 2) + "****" + phone.substring(phone.length() - 2);
    }
}