package br.com.regalaya.admin.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import br.com.regalaya.admin.repository.CustomerProfileRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CustomerAnalyticsServiceTest {

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private CustomerSegmentationService segmentationService;

    @InjectMocks
    private CustomerAnalyticsService customerAnalyticsService;

    private final UUID userId = UUID.randomUUID();

    @Test
    void calculateMetrics_WithOrders_ReturnsCorrectMetrics() {
        // Arrange
        LocalDate firstDate = LocalDate.now().minusMonths(3);
        LocalDate lastDate = LocalDate.now().minusMonths(1);

        when(customerProfileRepository.countByUserId(userId)).thenReturn(3L);
        when(customerProfileRepository.getLtvByUserId(userId)).thenReturn(new BigDecimal("1000.00"));
        when(customerProfileRepository.getFirstPurchaseDate(userId)).thenReturn(firstDate);
        when(customerProfileRepository.getLastPurchaseDate(userId)).thenReturn(lastDate);
        when(segmentationService.calculateSegment(new BigDecimal("1000.00"), 3, firstDate, lastDate))
                .thenReturn(CustomerSegmentationService.Segment.VIP);
        when(segmentationService.isInactive(lastDate)).thenReturn(false);

        // Act
        var metrics = customerAnalyticsService.calculateMetrics(userId);

        // Assert
        assertEquals(new BigDecimal("1000.00"), metrics.ltv());
        assertEquals(new BigDecimal("333.33"), metrics.averageOrderValue()); // 1000/3 arredondado
        assertEquals(3, metrics.totalOrders());
        assertNotNull(metrics.segment());
        assertEquals("VIP", metrics.segment().segment());
        assertTrue(metrics.isActive());
        assertNull(metrics.favoriteCategory());
        assertEquals(BigDecimal.ZERO, metrics.categorySpentPercentage());
    }

    @Test
    void calculateMetrics_NoOrders_ReturnsZeroMetrics() {
        // Arrange
        when(customerProfileRepository.countByUserId(userId)).thenReturn(0L);
        when(customerProfileRepository.getLtvByUserId(userId)).thenReturn(BigDecimal.ZERO);
        when(customerProfileRepository.getFirstPurchaseDate(userId)).thenReturn(null);
        when(customerProfileRepository.getLastPurchaseDate(userId)).thenReturn(null);
        when(segmentationService.calculateSegment(BigDecimal.ZERO, 0, null, null))
                .thenReturn(CustomerSegmentationService.Segment.REGULAR);
        when(segmentationService.isInactive(null)).thenReturn(true);

        // Act
        var metrics = customerAnalyticsService.calculateMetrics(userId);

        // Assert
        assertEquals(BigDecimal.ZERO, metrics.ltv());
        assertEquals(BigDecimal.ZERO, metrics.averageOrderValue());
        assertEquals(0, metrics.totalOrders());
        assertEquals(0, metrics.purchaseFrequency());
        assertNull(metrics.lastPurchaseDate());
        assertNull(metrics.favoriteCategory());
        assertEquals("Regular", metrics.segment().segment());
        assertFalse(metrics.isActive());
    }

    @Test
    void getChartData_AcceptsLocalDateTimeRowsFromRepository() {
        LocalDate startDate = LocalDate.of(2026, 4, 1);
        LocalDate endDate = LocalDate.of(2026, 4, 30);

        when(customerProfileRepository.getMonthlyOrderData(
                eq(userId),
                eq(startDate.atStartOfDay()),
                eq(endDate.atTime(java.time.LocalTime.MAX))
        )).thenReturn(java.util.List.of(
                new Object[]{LocalDateTime.of(2026, 4, 8, 10, 0), new BigDecimal("100.00")},
                new Object[]{LocalDateTime.of(2026, 4, 15, 15, 30), new BigDecimal("50.00")}
        ));

        var chartData = customerAnalyticsService.getChartData(userId, startDate, endDate);

        assertEquals(1, chartData.ltvEvolution().size());
        assertEquals(new BigDecimal("150.00"), chartData.ltvEvolution().get(0).value());
        assertEquals(2L, chartData.ltvEvolution().get(0).count());
    }
}
