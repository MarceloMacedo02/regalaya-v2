package br.com.regalaya.admin.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;

import br.com.regalaya.admin.dto.requests.OrderFilterRequest;
import br.com.regalaya.admin.dto.responses.CustomerOrderSummaryResponse;
import br.com.regalaya.admin.dto.responses.CustomerProfileResponse;
import br.com.regalaya.admin.repository.CustomerProfileRepository;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final CustomerAnalyticsService analyticsService;

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    public CustomerProfileResponse getCustomerProfile(UUID customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        var metrics = analyticsService.calculateMetrics(customerId);

        return new CustomerProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                null,
                null,
                metrics.segment().label(),
                metrics.segment().color(),
                metrics,
                user.getPlan() != null ? user.getPlan().name() : "FREE",
                user.getCreatedAt()
        );
    }

    public org.springframework.data.domain.Page<CustomerOrderSummaryResponse> getCustomerOrders(
            UUID customerId,
            OrderFilterRequest filter,
            int page,
            int size,
            String sortBy,
            String sortDirection
    ) {
        if (!userRepository.existsById(customerId)) {
            throw new RuntimeException("Cliente não encontrado");
        }

        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.fromString(sortDirection),
                sortBy
        ));

        return customerProfileRepository.findCustomerOrders(
                customerId,
                parseStatus(filter.status()),
                filter.startDate(),
                filter.endDate(),
                filter.productName(),
                sortBy,
                sortDirection,
                pageable
        );
    }

    private OrderStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status inválido: " + status);
        }
    }

    public String exportCustomerOrdersToCsv(
            UUID customerId,
            OrderFilterRequest filter,
            int page,
            int size,
            String sortBy,
            String sortDirection
    ) {
        var ordersPage = getCustomerOrders(customerId, filter, 0, 10000, sortBy, sortDirection);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Order Number,Valor Total,Status,Método Pagamento,Data,Criado em,Itens\n");

        ordersPage.getContent().forEach(order -> {
            String line = String.join(",",
                    escapeCsv(order.id().toString()),
                    escapeCsv(order.orderNumber()),
                    escapeCsv(order.total().toString()),
                    escapeCsv(order.status()),
                    escapeCsv(order.paymentMethod() != null ? order.paymentMethod() : ""),
                    escapeCsv(order.createdAt().toString()),
                    escapeCsv(String.valueOf(order.itemCount()))
            );
            csv.append(line).append("\n");
        });

        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    public br.com.regalaya.admin.dto.responses.CustomerChartDataResponse getCustomerChartData(
            UUID customerId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (!userRepository.existsById(customerId)) {
            throw new RuntimeException("Cliente não encontrado");
        }

        long monthsDiff = java.time.temporal.ChronoUnit.MONTHS.between(startDate, endDate);
        if (monthsDiff > 24) {
            throw new RuntimeException("Período máximo de análise é 24 meses");
        }

        return analyticsService.getChartData(customerId, startDate, endDate);
    }

    public YearMonth[] getDefaultPeriod() {
        YearMonth end = YearMonth.now();
        YearMonth start = end.minusMonths(11);
        return new YearMonth[]{start, end};
    }

    public void recalculateCustomerSegmentation(UUID customerId) {
        analyticsService.calculateMetrics(customerId);
    }
}