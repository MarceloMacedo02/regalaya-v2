package br.com.regalaya.cart.services.impl;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.cart.domain.model.Cart;
import br.com.regalaya.cart.domain.model.CartItem;
import br.com.regalaya.cart.dto.requests.AddToCartRequest;
import br.com.regalaya.cart.dto.requests.UpdateCartItemRequest;
import br.com.regalaya.cart.dto.responses.CartItemResponse;
import br.com.regalaya.cart.dto.responses.CartResponse;
import br.com.regalaya.cart.exception.CartItemNotFoundException;
import br.com.regalaya.cart.exception.ProductNotAvailableException;
import br.com.regalaya.cart.repository.CartItemRepository;
import br.com.regalaya.cart.repository.CartRepository;
import br.com.regalaya.cart.services.service.CartService;
import br.com.regalaya.coupon.service.CouponService;
import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId) {
        log.debug("Getting cart for user: {}", userId);
        Cart cart = getOrCreateCart(userId);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(UUID userId, AddToCartRequest request) {
        log.info("Adding product {} to cart for user: {}", request.productId(), userId);

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ProductNotAvailableException("Produto não encontrado"));

        if (!product.getIsActive()) {
            throw new ProductNotAvailableException("Produto não está disponível");
        }

        if (product.getStock() < request.quantity()) {
            throw new ProductNotAvailableException("Estoque insuficiente");
        }

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), request.productId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.quantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .productName(product.getName())
                    .productImage(product.getImages())
                    .unitPrice(product.getPrice())
                    .quantity(request.quantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        cart = cartRepository.findByUserIdWithItems(userId).orElse(cart);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItem(UUID userId, UUID productId, UpdateCartItemRequest request) {
        log.info("Updating product {} quantity to {} for user: {}", productId, request.quantity(), userId);

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new CartItemNotFoundException("Carrinho não encontrado"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new CartItemNotFoundException("Item não encontrado no carrinho"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotAvailableException("Produto não encontrado"));

        if (product.getStock() < request.quantity()) {
            throw new ProductNotAvailableException("Estoque insuficiente");
        }

        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        cart = cartRepository.findByUserIdWithItems(userId).orElse(cart);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(UUID userId, UUID productId) {
        log.info("Removing product {} from cart for user: {}", productId, userId);

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new CartItemNotFoundException("Carrinho não encontrado"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new CartItemNotFoundException("Item não encontrado no carrinho"));

        cartItemRepository.delete(item);

        cart = cartRepository.findByUserIdWithItems(userId).orElse(cart);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(UUID userId) {
        log.info("Clearing cart for user: {}", userId);
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
        }
    }

    @Override
    @Transactional
    public CartResponse applyCoupon(UUID userId, String couponCode) {
        log.info("Applying coupon {} for user: {}", couponCode, userId);

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new CartItemNotFoundException("Carrinho não encontrado"));

        BigDecimal subtotal = cart.getSubtotal();
        BigDecimal discount = couponService.applyCoupon(couponCode, subtotal);

        cart.setCouponCode(couponCode);
        cart.setCouponDiscount(discount);
        cartRepository.save(cart);

        cart = cartRepository.findByUserIdWithItems(userId).orElse(cart);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeCoupon(UUID userId) {
        log.info("Removing coupon for user: {}", userId);

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new CartItemNotFoundException("Carrinho não encontrado"));

        cart.setCouponCode(null);
        cart.setCouponDiscount(BigDecimal.ZERO);
        cartRepository.save(cart);

        cart = cartRepository.findByUserIdWithItems(userId).orElse(cart);
        return toCartResponse(cart);
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                items.add(new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getProductImage(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ));
            }
        }

        BigDecimal subtotal = cart.getSubtotal();
        BigDecimal couponDiscount = cart.getCouponDiscount() != null ? cart.getCouponDiscount() : BigDecimal.ZERO;
        BigDecimal total = subtotal.subtract(couponDiscount);

        return new CartResponse(
                cart.getUser().getId(),
                items,
                items.size(),
                cart.getTotalQuantity(),
                subtotal,
                BigDecimal.ZERO,
                couponDiscount,
                total,
                cart.getCouponCode(),
                couponDiscount
        );
    }
}
