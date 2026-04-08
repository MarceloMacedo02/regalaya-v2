package br.com.regalaya.order.mapper;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderItem;
import br.com.regalaya.order.domain.model.OrderStatusHistory;
import br.com.regalaya.order.dto.responses.OrderDetailResponse;
import br.com.regalaya.order.dto.responses.OrderItemResponse;
import br.com.regalaya.order.dto.responses.OrderListResponse;
import br.com.regalaya.order.dto.responses.OrderResponse;
import br.com.regalaya.order.dto.responses.OrderStatusHistoryResponse;

@Component
public class OrderMapper {

  public OrderResponse toResponse(Order order) {
    String userPlan = order.getUser() != null ? order.getUser().getPlan().name() : null;
    UUID userId = order.getUser() != null ? order.getUser().getId() : null;
    return new OrderResponse(
        order.getId(),
        order.getOrderNumber(),
        order.getCustomerName(),
        order.getCustomerEmail(),
        userId,
        userPlan,
        order.getTotal(),
        order.getStatus().name(),
        order.getPaymentStatus(),
        order.getCreatedAt(),
        order.getOrderItems() != null ? order.getOrderItems().size() : 0);
  }

  public OrderListResponse toListResponse(Order order) {
    return new OrderListResponse(
        order.getId(),
        order.getOrderNumber(),
        order.getCustomerName(),
        order.getCustomerEmail(),
        order.getCustomerPhone(),
        order.getTotal(),
        order.getStatus().name(),
        order.getPaymentMethod(),
        order.getCreatedAt(),
        order.getOrderItems() != null ? order.getOrderItems().size() : 0
    );
  }

  public OrderDetailResponse toDetailResponse(Order order) {
    List<OrderItemResponse> items = order.getOrderItems() != null
        ? order.getOrderItems().stream().map(this::toItemResponse).toList()
        : List.of();

    List<OrderStatusHistoryResponse> history = order.getStatusHistory() != null
        ? order.getStatusHistory().stream().map(this::toHistoryResponse).toList()
        : List.of();

    // Calcular histórico de pedidos do cliente (simplificado por agora)
    String customerHistory = order.getUser() != null
        ? "Cliente: " + order.getUser().getName()
        : "Sem histórico";

    return new OrderDetailResponse(
        order.getId(),
        order.getOrderNumber(),
        order.getCustomerName(),
        order.getCustomerEmail(),
        order.getCustomerPhone(),
        order.getTotal(),
        order.getStatus().name(),
        order.getPaymentStatus(),
        order.getCreatedAt(),
        items.size(),
        order.getShippingAddress(),
        order.getNotes(),
        order.getTrackingCode(),
        items,
        order.getSubtotal(),
        order.getShipping(),
        order.getDiscount(),
        order.getPaymentMethod(),
        order.getTransactionId(),
        order.getPaidAt(),
        customerHistory,
        order.getTrackingUrl(),
        history
    );
  }

  public OrderItemResponse toItemResponse(OrderItem item) {
    return new OrderItemResponse(
        item.getId(),
        item.getProductName(),
        item.getProductSku(),
        item.getQuantity(),
        item.getUnitPrice(),
        item.getTotal(),
        item.getImageUrl());
  }

  public OrderStatusHistoryResponse toHistoryResponse(OrderStatusHistory history) {
    return new OrderStatusHistoryResponse(
        history.getId(),
        history.getPreviousStatus() != null ? history.getPreviousStatus().name() : null,
        history.getNewStatus().name(),
        history.getChangedBy(),
        history.getReason(),
        history.getChangedAt()
    );
  }
}
