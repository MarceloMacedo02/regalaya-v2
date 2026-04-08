package br.com.regalaya.order.controller;

import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.order.dto.requests.CreateCheckoutRequest;
import br.com.regalaya.order.dto.requests.CreateOrderRequest;
import br.com.regalaya.order.dto.responses.OrderDetailResponse;
import br.com.regalaya.order.dto.responses.OrderResponse;
import br.com.regalaya.order.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/client/orders")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Client Orders", description = "Endpoints de pedidos para clientes")
public class ClientOrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Criar pedido", description = "Cria um novo pedido a partir do carrinho do usuário")
    public ResponseEntity<OrderDetailResponse> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateCheckoutRequest request) {
        OrderDetailResponse response = orderService.createFromCart(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar meus pedidos", description = "Lista todos os pedidos do usuário autenticado com paginação")
    public ResponseEntity<Page<OrderResponse>> findMyOrders(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(orderService.findByUserId(userDetails.getId(), pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Listar todos os meus pedidos", description = "Lista todos os pedidos do usuário autenticado")
    public ResponseEntity<List<OrderResponse>> findAllMyOrders(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(orderService.findByUserId(userDetails.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pedido por ID", description = "Retorna os detalhes de um pedido específico do usuário")
    public ResponseEntity<OrderDetailResponse> findById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.findByIdForUser(id, userDetails.getId()));
    }
}
