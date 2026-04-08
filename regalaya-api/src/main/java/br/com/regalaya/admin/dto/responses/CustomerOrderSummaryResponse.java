package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CustomerOrderSummaryResponse(
    UUID id,
    String orderNumber,
    BigDecimal total,
    String status,
    String paymentMethod,
    LocalDateTime createdAt,
    Integer itemCount
) {
    // Construtor explícito para compatibilidade com JPQL
    public CustomerOrderSummaryResponse(UUID id, String orderNumber, BigDecimal total,
                                        String status, String paymentMethod,
                                        LocalDateTime createdAt, Integer itemCount) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.total = total;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.createdAt = createdAt;
        this.itemCount = itemCount;
    }
}
