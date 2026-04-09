package br.com.regalaya.whatsapp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class WhatsAppRateLimiterTest {

    private WhatsAppRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new WhatsAppRateLimiter(5);
    }

    @Test
    void tryConsume_allowsRequestsWithinLimit() {
        for (int i = 0; i < 5; i++) {
            assertTrue(rateLimiter.tryConsume("+5511988887777"));
        }
    }

    @Test
    void tryConsume_blocksRequestsOverLimit() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.tryConsume("+5511988887777");
        }
        assertFalse(rateLimiter.tryConsume("+5511988887777"));
    }

    @Test
    void tryConsume_separateBucketsPerPhone() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.tryConsume("+5511988887777");
        }
        assertTrue(rateLimiter.tryConsume("+5511999997777"));
    }

    @Test
    void reset_clearsBucketForPhone() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.tryConsume("+5511988887777");
        }
        rateLimiter.reset("+5511988887777");
        assertTrue(rateLimiter.tryConsume("+5511988887777"));
    }

    @Test
    void getAvailableTokens_returnsCorrectCount() {
        rateLimiter.tryConsume("+5511988887777");
        rateLimiter.tryConsume("+5511988887777");
        
        assertEquals(3, rateLimiter.getAvailableTokens("+5511988887777"));
    }
}