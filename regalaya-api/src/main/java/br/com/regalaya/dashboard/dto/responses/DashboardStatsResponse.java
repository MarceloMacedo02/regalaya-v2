package br.com.regalaya.dashboard.dto.responses;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStatsResponse(
    BigDecimal totalRevenue,
    Long totalOrders,
    Long totalCustomers,
    BigDecimal averageTicket,
    BigDecimal revenueChange,
    BigDecimal ordersChange,
    BigDecimal customersChange
) {}
