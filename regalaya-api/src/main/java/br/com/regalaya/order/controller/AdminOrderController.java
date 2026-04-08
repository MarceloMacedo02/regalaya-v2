package br.com.regalaya.order.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.order.domain.model.OrderStatus;
import br.com.regalaya.order.dto.requests.RefundRequest;
import br.com.regalaya.order.dto.responses.OrderDetailResponse;
import br.com.regalaya.order.dto.responses.OrderListResponse;
import br.com.regalaya.order.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/admin/orders")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin Orders", description = "Administrative order management endpoints")
@Validated
@RequiredArgsConstructor
@Slf4j
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "List all orders (admin)", description = "Returns a paginated list of all orders")
    public ResponseEntity<Page<OrderListResponse>> findAll(
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderListResponse> response = orderService.findAllAdmin(
                null, null, null, null, null,
                null, null, null, null, pageable
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Export orders to CSV", description = "Exports filtered orders to CSV format")
    public void exportToCsv(
            @Parameter(description = "Filter by order status") @RequestParam(required = false) OrderStatus status,
            @Parameter(description = "Filter by start date (YYYY-MM-DD)") @RequestParam(required = false) LocalDate startDate,
            @Parameter(description = "Filter by end date (YYYY-MM-DD)") @RequestParam(required = false) LocalDate endDate,
            @Parameter(description = "Filter by customer name (partial match)") @RequestParam(required = false) String customerName,
            @Parameter(description = "Filter by customer email (partial match)") @RequestParam(required = false) String customerEmail,
            @Parameter(description = "Minimum order total") @RequestParam(required = false) BigDecimal minAmount,
            @Parameter(description = "Maximum order total") @RequestParam(required = false) BigDecimal maxAmount,
            HttpServletResponse response) throws IOException {

        Page<OrderListResponse> ordersPage = orderService.findAllAdmin(
                status, startDate, endDate, customerName, customerEmail,
                minAmount, maxAmount, "createdAt", "desc",
                PageRequest.of(0, 10000) // limite alto para exportação
        );

        // Configurar headers para download CSV
        response.setContentType("text/csv; charset=utf-8");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"orders_export_" + System.currentTimeMillis() + ".csv\"");

        // Escrever CSV
        try (var writer = response.getWriter()) {
            // Header
            writer.println("ID,Order Number,Customer Name,Customer Email,Customer Phone,Total,Status,Payment Method,Created At,Items Count");

            // Dados
            for (OrderListResponse order : ordersPage.getContent()) {
                writer.println(String.join(",",
                        escapeCsv(order.id().toString()),
                        escapeCsv(order.orderNumber()),
                        escapeCsv(order.customerName()),
                        escapeCsv(order.customerEmail()),
                        escapeCsv(order.customerPhone() != null ? order.customerPhone() : ""),
                        escapeCsv(order.total().toString()),
                        escapeCsv(order.status()),
                        escapeCsv(order.paymentMethod() != null ? order.paymentMethod() : ""),
                        escapeCsv(order.createdAt() != null ? order.createdAt().toString() : ""),
                        String.valueOf(order.itemsCount())
                ));
            }
        }

        log.info("Admin exported {} orders to CSV", ordersPage.getTotalElements());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get order details (admin)", description = "Returns detailed information about a specific order for admin")
    public ResponseEntity<OrderDetailResponse> findById(
            @Parameter(description = "Order ID") @PathVariable UUID id) {

        OrderDetailResponse response = orderService.findById(id);

        log.info("Admin accessed order details for order ID: {}", id);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/refund")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Process refund for order", description = "Process a full or partial refund for an order")
    public ResponseEntity<OrderDetailResponse> processRefund(
            @Parameter(description = "Order ID") @PathVariable UUID id,
            @Validated @RequestBody RefundRequest request) {

        OrderDetailResponse response = orderService.processRefund(id, request);

        log.info("Admin processed {} refund for order {}: amount={}, reason={}",
                request.type(), id, request.amount(), request.reason());

        return ResponseEntity.ok(response);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        // Escapar aspas e usar aspas se contém vírgula, aspas ou nova linha
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private org.springframework.data.domain.PageRequest PageRequest(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection != null ? sortDirection : "desc");
        Sort.Order sortOrder = new Sort.Order(direction, sortBy != null ? sortBy : "createdAt");
        return org.springframework.data.domain.PageRequest.of(page, size, Sort.by(sortOrder));
    }
}