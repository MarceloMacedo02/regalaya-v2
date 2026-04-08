package br.com.regalaya.order.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.regalaya.order.domain.model.OrderStatus;
import br.com.regalaya.order.dto.requests.CreateCheckoutRequest;
import br.com.regalaya.order.dto.requests.CreateOrderRequest;
import br.com.regalaya.order.dto.requests.RefundRequest;
import br.com.regalaya.order.dto.requests.UpdateOrderStatusRequest;
import br.com.regalaya.order.dto.responses.OrderDetailResponse;
import br.com.regalaya.order.dto.responses.OrderListResponse;
import br.com.regalaya.order.dto.responses.OrderResponse;

public interface OrderService {
    Page<OrderResponse> findAll(Pageable pageable);
    Page<OrderListResponse> findAllAdmin(
            OrderStatus status,
            LocalDate startDate,
            LocalDate endDate,
            String customerName,
            String customerEmail,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String sortBy,
            String sortDirection,
            Pageable pageable
    );
    List<OrderResponse> findRecent(int limit);
    OrderDetailResponse findById(UUID id);
    OrderDetailResponse updateStatus(UUID id, UpdateOrderStatusRequest request);

    Page<OrderResponse> findByUserId(UUID userId, Pageable pageable);
    List<OrderResponse> findByUserId(UUID userId);
    OrderDetailResponse findByIdForUser(UUID id, UUID userId);
    OrderDetailResponse create(UUID userId, CreateOrderRequest request);

    @org.springframework.transaction.annotation.Transactional
    OrderDetailResponse createFromCart(UUID userId, CreateCheckoutRequest request);

    void recordStatusChange(UUID orderId, OrderStatus previousStatus, OrderStatus newStatus, String changedBy, String reason);

    /**
     * Processa reembolso de um pedido
     * @param orderId ID do pedido
     * @param request requisição de reembolso (tipo, valor, razão)
     * @return Detalhes do pedido após processamento
     */
    OrderDetailResponse processRefund(UUID orderId, RefundRequest request);
}
