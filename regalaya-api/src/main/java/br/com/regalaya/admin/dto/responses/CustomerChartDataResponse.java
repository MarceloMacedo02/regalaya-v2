package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

public record CustomerChartDataResponse(
    List<ChartDataPoint> ltvEvolution, // evolução mensal do LTV
    List<ChartDataPoint> purchaseFrequency, // compras por mês
    List<ChartDataPoint> averageOrderValueDistribution, // distribuição de valores médios
    List<ChartDataPoint> topCategories, // categorias mais compradas
    YearMonth startPeriod,
    YearMonth endPeriod
) {}