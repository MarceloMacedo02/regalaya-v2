package br.com.regalaya.dashboard.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.dashboard.dto.responses.DashboardStatsResponse;
import br.com.regalaya.dashboard.dto.responses.SalesDataResponse;
import br.com.regalaya.dashboard.dto.responses.TopProductResponse;
import br.com.regalaya.dashboard.repository.DashboardRepository;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentStart = getPeriodStart(now, period);
        LocalDateTime previousStart = getPreviousPeriodStart(currentStart, period);

        BigDecimal currentRevenue = dashboardRepository.sumRevenueByDateRange(currentStart, now);
        Long currentOrders = dashboardRepository.countOrdersByDateRange(currentStart, now);
        Long currentCustomers = dashboardRepository.countNewCustomersByDateRange(currentStart, now);

        BigDecimal previousRevenue = dashboardRepository.sumRevenueByDateRange(previousStart, currentStart);
        Long previousOrders = dashboardRepository.countOrdersByDateRange(previousStart, currentStart);
        Long previousCustomers = dashboardRepository.countNewCustomersByDateRange(previousStart, currentStart);

        Long totalCustomers = dashboardRepository.countTotalCustomers();
        BigDecimal avgTicket = currentOrders > 0 ? currentRevenue.divide(BigDecimal.valueOf(currentOrders), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO;

        BigDecimal revenueChange = calculateChange(previousRevenue, currentRevenue);
        BigDecimal ordersChange = calculateChange(previousOrders != null ? BigDecimal.valueOf(previousOrders) : BigDecimal.ZERO, currentOrders != null ? BigDecimal.valueOf(currentOrders) : BigDecimal.ZERO);
        BigDecimal customersChange = calculateChange(previousCustomers != null ? BigDecimal.valueOf(previousCustomers) : BigDecimal.ZERO, currentCustomers != null ? BigDecimal.valueOf(currentCustomers) : BigDecimal.ZERO);

        return new DashboardStatsResponse(
                currentRevenue != null ? currentRevenue : BigDecimal.ZERO,
                currentOrders != null ? currentOrders : 0L,
                totalCustomers != null ? totalCustomers : 0L,
                avgTicket,
                revenueChange,
                ordersChange,
                customersChange
        );
    }

    @Transactional(readOnly = true)
    public List<SalesDataResponse> getSalesData(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = getPeriodStart(now, period);

        List<Object[]> results = dashboardRepository.findSalesByDateRange(start, now);
        List<SalesDataResponse> salesData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (Object[] row : results) {
            String date = row[0] != null ? row[0].toString() : "";
            BigDecimal revenue = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;
            Long orders = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            salesData.add(new SalesDataResponse(date, revenue, orders));
        }

        return salesData;
    }

    @Transactional(readOnly = true)
    public List<TopProductResponse> getTopProducts(String period, int limit) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = getPeriodStart(now, period);

        List<Object[]> results = dashboardRepository.findTopProductsByDateRange(start, now, limit);
        List<TopProductResponse> topProducts = new ArrayList<>();

        for (Object[] row : results) {
            String productName = row[0] != null ? row[0].toString() : "";
            Long unitsSold = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            BigDecimal revenue = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;
            topProducts.add(new TopProductResponse("", productName, unitsSold, revenue));
        }

        return topProducts;
    }

    private LocalDateTime getPeriodStart(LocalDateTime now, String period) {
        return switch (period) {
            case "today" -> now.toLocalDate().atStartOfDay();
            case "week" -> now.minusDays(7);
            case "month" -> now.minusDays(30);
            case "quarter" -> now.minusDays(90);
            case "year" -> LocalDateTime.of(now.getYear(), 1, 1, 0, 0);
            default -> now.minusDays(30);
        };
    }

    private LocalDateTime getPreviousPeriodStart(LocalDateTime currentStart, String period) {
        long daysBetween = java.time.Duration.between(currentStart, LocalDateTime.now()).toDays();
        return currentStart.minusDays(daysBetween);
    }

    private BigDecimal calculateChange(BigDecimal previous, BigDecimal current) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .multiply(BigDecimal.valueOf(100))
                .divide(previous, 1, java.math.RoundingMode.HALF_UP);
    }
}
