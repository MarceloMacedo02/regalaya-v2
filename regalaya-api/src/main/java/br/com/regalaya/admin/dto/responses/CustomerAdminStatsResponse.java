package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;

public record CustomerAdminStatsResponse(
        long totalCustomers,
        long activeCustomers,
        BigDecimal averageTicket,
        BigDecimal totalRevenue
) {}
