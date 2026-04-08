package br.com.regalaya.admin.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CustomerSegmentationServiceTest {

    private final CustomerSegmentationService segmentationService = new CustomerSegmentationService();

    @Test
    void calculateSegment_VipByLtv_ReturnsVip() {
        // Arrange
        BigDecimal ltv = new BigDecimal("1500.00");
        Integer totalOrders = 5;
        LocalDate firstPurchase = LocalDate.now().minusMonths(10);
        LocalDate lastPurchase = LocalDate.now().minusMonths(1);

        // Act
        var segment = segmentationService.calculateSegment(ltv, totalOrders, firstPurchase, lastPurchase);

        // Assert
        assertEquals(CustomerSegmentationService.Segment.VIP, segment);
    }

    @Test
    void calculateSegment_VipByOrderCount_ReturnsVip() {
        // Arrange
        BigDecimal ltv = new BigDecimal("800.00");
        Integer totalOrders = 15; // > 10
        LocalDate firstPurchase = LocalDate.now().minusMonths(10);
        LocalDate lastPurchase = LocalDate.now().minusMonths(1);

        // Act
        var segment = segmentationService.calculateSegment(ltv, totalOrders, firstPurchase, lastPurchase);

        // Assert
        assertEquals(CustomerSegmentationService.Segment.VIP, segment);
    }

    @Test
    void calculateSegment_Inactive_ReturnsInactive() {
        // Arrange
        BigDecimal ltv = new BigDecimal("500.00");
        Integer totalOrders = 3;
        LocalDate firstPurchase = LocalDate.now().minusMonths(10);
        LocalDate lastPurchase = LocalDate.now().minusMonths(7); // > 6 meses

        // Act
        var segment = segmentationService.calculateSegment(ltv, totalOrders, firstPurchase, lastPurchase);

        // Assert
        assertEquals(CustomerSegmentationService.Segment.INACTIVE, segment);
    }

    @Test
    void calculateSegment_New_ReturnsNew() {
        // Arrange
        BigDecimal ltv = new BigDecimal("200.00");
        Integer totalOrders = 1;
        LocalDate firstPurchase = LocalDate.now().minusMonths(2); // < 3 meses
        LocalDate lastPurchase = LocalDate.now().minusMonths(1);

        // Act
        var segment = segmentationService.calculateSegment(ltv, totalOrders, firstPurchase, lastPurchase);

        // Assert
        assertEquals(CustomerSegmentationService.Segment.NEW, segment);
    }

    @Test
    void calculateSegment_Regular_ReturnsRegular() {
        // Arrange
        BigDecimal ltv = new BigDecimal("600.00");
        Integer totalOrders = 5;
        LocalDate firstPurchase = LocalDate.now().minusMonths(10);
        LocalDate lastPurchase = LocalDate.now().minusMonths(2); // ativo, mas não VIP nem Novo

        // Act
        var segment = segmentationService.calculateSegment(ltv, totalOrders, firstPurchase, lastPurchase);

        // Assert
        assertEquals(CustomerSegmentationService.Segment.REGULAR, segment);
    }

    @Test
    void calculateSegment_NoData_ReturnsRegular() {
        // Arrange
        BigDecimal ltv = BigDecimal.ZERO;
        Integer totalOrders = 0;
        LocalDate firstPurchase = null;
        LocalDate lastPurchase = null;

        // Act
        var segment = segmentationService.calculateSegment(ltv, totalOrders, firstPurchase, lastPurchase);

        // Assert
        assertEquals(CustomerSegmentationService.Segment.REGULAR, segment);
    }

    @Test
    void isVip_TrueForHighLtv() {
        assertTrue(segmentationService.isVip(new BigDecimal("1500.00"), 5));
    }

    @Test
    void isVip_TrueForHighOrderCount() {
        assertTrue(segmentationService.isVip(new BigDecimal("500.00"), 15));
    }

    @Test
    void isVip_FalseForLowValues() {
        assertFalse(segmentationService.isVip(new BigDecimal("500.00"), 5));
    }

    @Test
    void isNew_TrueForRecentFirstPurchase() {
        LocalDate firstPurchase = LocalDate.now().minusMonths(2);
        assertTrue(segmentationService.isNew(firstPurchase));
    }

    @Test
    void isNew_FalseForOldFirstPurchase() {
        LocalDate firstPurchase = LocalDate.now().minusMonths(6);
        assertFalse(segmentationService.isNew(firstPurchase));
    }

    @Test
    void isNew_FalseForNull() {
        assertFalse(segmentationService.isNew(null));
    }

    @Test
    void isInactive_TrueForLongTimeNoPurchase() {
        LocalDate lastPurchase = LocalDate.now().minusMonths(7);
        assertTrue(segmentationService.isInactive(lastPurchase));
    }

    @Test
    void isInactive_FalseForRecentPurchase() {
        LocalDate lastPurchase = LocalDate.now().minusMonths(2);
        assertFalse(segmentationService.isInactive(lastPurchase));
    }

    @Test
    void isInactive_TrueForNeverPurchased() {
        assertTrue(segmentationService.isInactive(null));
    }
}