package br.com.regalaya.cart.controller;

import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.cart.dto.requests.AddToCartRequest;
import br.com.regalaya.cart.dto.requests.ApplyCouponRequest;
import br.com.regalaya.cart.dto.requests.UpdateCartItemRequest;
import br.com.regalaya.cart.dto.responses.CartResponse;
import br.com.regalaya.cart.services.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/cart")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Gerenciamento do carrinho de compras")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Obter carrinho", description = "Retorna o carrinho do usuário autenticado")
    public ResponseEntity<CartResponse> getCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(cartService.getCart(userDetails.getId()));
    }

    @PostMapping("/items")
    @Operation(summary = "Adicionar ao carrinho", description = "Adiciona um produto ao carrinho")
    public ResponseEntity<CartResponse> addToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userDetails.getId(), request));
    }

    @PatchMapping("/items/{productId}")
    @Operation(summary = "Atualizar quantidade", description = "Atualiza a quantidade de um item no carrinho")
    public ResponseEntity<CartResponse> updateItem(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID productId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(userDetails.getId(), productId, request));
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remover do carrinho", description = "Remove um produto do carrinho")
    public ResponseEntity<CartResponse> removeFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID productId) {
        return ResponseEntity.ok(cartService.removeFromCart(userDetails.getId(), productId));
    }

    @DeleteMapping
    @Operation(summary = "Limpar carrinho", description = "Remove todos os itens do carrinho")
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/apply-coupon")
    @Operation(summary = "Aplicar cupom", description = "Aplica um cupom de desconto ao carrinho")
    public ResponseEntity<CartResponse> applyCoupon(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ApplyCouponRequest request) {
        return ResponseEntity.ok(cartService.applyCoupon(userDetails.getId(), request.code()));
    }

    @DeleteMapping("/coupon")
    @Operation(summary = "Remover cupom", description = "Remove o cupom de desconto do carrinho")
    public ResponseEntity<CartResponse> removeCoupon(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(cartService.removeCoupon(userDetails.getId()));
    }
}
