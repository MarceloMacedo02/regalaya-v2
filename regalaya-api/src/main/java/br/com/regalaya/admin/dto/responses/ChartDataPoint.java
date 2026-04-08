package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;

public record ChartDataPoint(
    String label, // mês/ano ou categoria
    BigDecimal value,
    Long count
) {}
