package br.com.regalaya.admin.dto.requests;

import java.time.LocalDate;
import java.util.List;

public record OrderFilterRequest(
    String status, // PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
    LocalDate startDate,
    LocalDate endDate,
    String productName, // busca por nome do produto
    Integer page,
    Integer size,
    String sortBy, // createdAt, total, status
    String sortDirection // asc, desc
) {
    public OrderFilterRequest {
        if (page == null) page = 0;
        if (size == null) size = 20;
        if (sortBy == null || sortBy.isBlank()) sortBy = "createdAt";
        if (sortDirection == null || sortDirection.isBlank()) sortDirection = "desc";
    }
}