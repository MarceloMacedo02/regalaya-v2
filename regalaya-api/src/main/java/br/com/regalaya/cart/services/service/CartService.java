package br.com.regalaya.cart.services.service;

import br.com.regalaya.cart.dto.requests.AddToCartRequest;
import br.com.regalaya.cart.dto.requests.UpdateCartItemRequest;
import br.com.regalaya.cart.dto.responses.CartResponse;

import java.util.UUID;

public interface CartService {

    CartResponse getCart(UUID userId);

    CartResponse addToCart(UUID userId, AddToCartRequest request);

    CartResponse updateItem(UUID userId, UUID productId, UpdateCartItemRequest request);

    CartResponse removeFromCart(UUID userId, UUID productId);

    void clearCart(UUID userId);

    CartResponse applyCoupon(UUID userId, String couponCode);

    CartResponse removeCoupon(UUID userId);

    CartResponse updateGiftInfo(UUID userId, String giftMessage, String senderName, String recipientName, String giftContext);
}
