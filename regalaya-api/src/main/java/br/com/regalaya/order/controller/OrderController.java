package br.com.regalaya.order.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.order.dto.requests.UpdateOrderStatusRequest;
import br.com.regalaya.order.dto.responses.OrderDetailResponse;
import br.com.regalaya.order.dto.responses.OrderResponse;
import br.com.regalaya.order.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/v1/orders")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "List all orders", description = "Returns a paginated list of all orders ordered by creation date")
    public ResponseEntity<Page<OrderResponse>> findAll(
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(orderService.findAll(pageable));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get recent orders", description = "Returns the most recent orders (default: 5)")
    public ResponseEntity<List<OrderResponse>> findRecent(
            @Parameter(description = "Number of recent orders to return")
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(orderService.findRecent(limit));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get order by ID", description = "Returns detailed information about a specific order")
    public ResponseEntity<OrderDetailResponse> findById(
            @Parameter(description = "Order ID")
            @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update order status", description = "Updates the status of an order and optionally appends notes")
    public ResponseEntity<OrderDetailResponse> updateStatus(
            @Parameter(description = "Order ID")
            @PathVariable UUID id,
            @Validated @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }
}
