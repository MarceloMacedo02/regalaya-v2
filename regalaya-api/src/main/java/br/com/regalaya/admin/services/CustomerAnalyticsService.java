package br.com.regalaya.admin.services;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import br.com.regalaya.admin.dto.responses.ChartDataPoint;
import br.com.regalaya.admin.dto.responses.CustomerChartDataResponse;
import br.com.regalaya.admin.dto.responses.CustomerMetricsResponse;
import br.com.regalaya.admin.dto.responses.CustomerSegmentResponse;
import br.com.regalaya.admin.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerAnalyticsService {

    private final CustomerProfileRepository customerProfileRepository;
    private final CustomerSegmentationService segmentationService;

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    @Transactional(readOnly = true)
    @Cacheable(value = "customerAnalytics", key = "#userId")
    public CustomerMetricsResponse calculateMetrics(UUID userId) {
        BigDecimal ltv = customerProfileRepository.getLtvByUserId(userId);
        LocalDate firstPurchase = customerProfileRepository.getFirstPurchaseDate(userId);
        LocalDate lastPurchase = customerProfileRepository.getLastPurchaseDate(userId);
        long totalOrders = customerProfileRepository.countByUserId(userId);

        Integer purchaseFrequency = calculatePurchaseFrequency(firstPurchase, lastPurchase, (int) totalOrders);
        Integer daysSinceLastPurchase = lastPurchase != null
                ? (int) ChronoUnit.DAYS.between(lastPurchase, LocalDate.now())
                : null;

        Map<String, BigDecimal> categorySpending = calculateCategorySpending(userId);
        Map.Entry<String, BigDecimal> topCategory = categorySpending.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        String favoriteCategory = topCategory != null ? topCategory.getKey() : null;
        BigDecimal categoryPercentage = topCategory != null && ltv.compareTo(ZERO) > 0
                ? topCategory.getValue().divide(ltv, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : ZERO;

        CustomerSegmentationService.Segment segment = segmentationService.calculateSegment(
                ltv,
                (int) totalOrders,
                firstPurchase,
                lastPurchase
        );

        CustomerSegmentResponse segmentResponse = new CustomerSegmentResponse(
                segment.code(),
                segment.label(),
                segment.color(),
                segment.description(),
                CustomerSegmentationService.VIP_LTV_THRESHOLD,
                CustomerSegmentationService.NEW_MONTHS_THRESHOLD
        );

        Boolean isActive = !segmentationService.isInactive(lastPurchase);

        return new CustomerMetricsResponse(
                ltv,
                totalOrders > 0 ? ltv.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP) : ZERO,
                (int) totalOrders,
                purchaseFrequency,
                lastPurchase,
                daysSinceLastPurchase,
                favoriteCategory,
                categoryPercentage,
                segmentResponse,
                isActive
        );
    }

    private Integer calculatePurchaseFrequency(LocalDate firstPurchase, LocalDate lastPurchase, int totalOrders) {
        if (firstPurchase == null || lastPurchase == null || totalOrders == 0) {
            return 0;
        }
        long monthsBetween = ChronoUnit.MONTHS.between(firstPurchase, lastPurchase) + 1;
        if (monthsBetween <= 0) return totalOrders;
        double frequency = (double) totalOrders / monthsBetween;
        return (int) Math.round(frequency);
    }

    private Map<String, BigDecimal> calculateCategorySpending(UUID userId) {
        // Category spending não está disponível pois OrderItem não tem relacionamento com Product/Category
        // Retorna mapa vazio como fallback
        return Map.of();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "customerAnalytics", key = "#userId + ':charts:' + #startPeriod + ':' + #endPeriod")
    public CustomerChartDataResponse getChartData(
            UUID userId,
            LocalDate startPeriod,
            LocalDate endPeriod
    ) {
        List<Object[]> monthlyData = customerProfileRepository.getMonthlyOrderData(userId, startPeriod, endPeriod);

        // Agregar dados por mês
        Map<java.time.YearMonth, BigDecimal> ltvByMonth = monthlyData.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        row -> java.time.YearMonth.from((LocalDate) row[0]),
                        java.util.stream.Collectors.reducing(ZERO, row -> (BigDecimal) row[1], BigDecimal::add)
                ));

        Map<java.time.YearMonth, Long> ordersByMonth = monthlyData.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        row -> java.time.YearMonth.from((LocalDate) row[0]),
                        java.util.stream.Collectors.counting()
                ));

        // Gerar LTV Evolution (cumulativo)
        List<YearMonth> monthsRange = generateYearMonthRange(
                java.time.YearMonth.from(startPeriod),
                java.time.YearMonth.from(endPeriod)
        );

        List<ChartDataPoint> ltvEvolution = monthsRange.stream()
                .map(ym -> {
                    BigDecimal cumulative = ltvByMonth.entrySet().stream()
                            .filter(e -> !e.getKey().isBefore(java.time.YearMonth.from(startPeriod)) &&
                                         !e.getKey().isAfter(ym))
                            .map(Map.Entry::getValue)
                            .reduce(ZERO, BigDecimal::add);
                    return new ChartDataPoint(
                            ym.toString(),
                            cumulative,
                            ordersByMonth.getOrDefault(ym, 0L)
                    );
                })
                .toList();

        // Purchase Frequency (barras)
        List<ChartDataPoint> purchaseFrequency = monthsRange.stream()
                .map(ym -> new ChartDataPoint(
                        ym.toString(),
                        ZERO,
                        ordersByMonth.getOrDefault(ym, 0L)
                ))
                .toList();

        // AOV Distribution - usar dados de categoria por enquanto
        List<ChartDataPoint> aovDistribution = List.of(
                new ChartDataPoint("R$ 0-200", ZERO, 0L),
                new ChartDataPoint("R$ 200-500", ZERO, 0L),
                new ChartDataPoint("R$ 500+", ZERO, 0L)
        );

        // Top Categories
        List<ChartDataPoint> topCategories = calculateTopCategories(userId);

        return new CustomerChartDataResponse(
                ltvEvolution,
                purchaseFrequency,
                aovDistribution,
                topCategories,
                java.time.YearMonth.from(startPeriod),
                java.time.YearMonth.from(endPeriod)
        );
    }

    private List<ChartDataPoint> calculateTopCategories(UUID userId) {
        // Category spending não está disponível pois OrderItem não tem relacionamento com Product/Category
        // Retorna lista vazia como fallback
        return List.of();
    }

    /**
     * Gera uma lista de YearMonth entre start e end (inclusive).
     * YearMonth não possui método datesUntil, então implementamos manualmente.
     */
    private List<YearMonth> generateYearMonthRange(YearMonth start, YearMonth end) {
        List<YearMonth> result = new ArrayList<>();
        YearMonth current = start;
        while (!current.isAfter(end)) {
            result.add(current);
            current = current.plusMonths(1);
        }
        return result;
    }
}