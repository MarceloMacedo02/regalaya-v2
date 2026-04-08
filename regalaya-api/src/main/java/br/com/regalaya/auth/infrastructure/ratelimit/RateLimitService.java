package br.com.regalaya.auth.infrastructure.ratelimit;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private final Map<String, RateLimitConfig> configs = Map.of(
            "login", new RateLimitConfig(5, Duration.ofMinutes(15)),
            "register", new RateLimitConfig(3, Duration.ofMinutes(30)),
            "forgot-password", new RateLimitConfig(3, Duration.ofHours(1)),
            "reset-password", new RateLimitConfig(5, Duration.ofHours(1)),
            "validate-email", new RateLimitConfig(10, Duration.ofHours(1)),
            "refresh-token", new RateLimitConfig(30, Duration.ofHours(1))
    );

    public boolean tryConsume(String key, String action) {
        Bucket bucket = buckets.computeIfAbsent(key + ":" + action,
                k -> createBucket(action));

        boolean consumed = bucket.tryConsume(1);
        if (!consumed) {
            log.warn("Rate limit exceeded for key: {} action: {}", key, action);
        }
        return consumed;
    }

    public long getRemainingTokens(String key, String action) {
        Bucket bucket = buckets.get(key + ":" + action);
        if (bucket == null) {
            return 0;
        }
        return bucket.getAvailableTokens();
    }

    public void resetBucket(String key, String action) {
        buckets.remove(key + ":" + action);
    }

    private Bucket createBucket(String action) {
        RateLimitConfig config = configs.getOrDefault(action,
                new RateLimitConfig(10, Duration.ofMinutes(15)));

        Bandwidth limit = Bandwidth.classic(
                config.capacity,
                Refill.intervally(config.capacity, config.period)
        );

        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    private record RateLimitConfig(int capacity, Duration period) {
    }
}
