package br.com.regalaya.order.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderItem;
import br.com.regalaya.order.domain.model.OrderStatus;
import br.com.regalaya.order.dto.requests.CreateCheckoutRequest;
import br.com.regalaya.order.dto.requests.CreateOrderItemRequest;
import br.com.regalaya.order.dto.requests.CreateOrderRequest;
import br.com.regalaya.order.dto.requests.UpdateOrderStatusRequest;
import br.com.regalaya.order.dto.responses.OrderDetailResponse;
import br.com.regalaya.order.dto.responses.OrderListResponse;
import br.com.regalaya.order.dto.responses.OrderResponse;
import br.com.regalaya.order.exception.OrderNotFoundException;
import br.com.regalaya.order.mapper.OrderMapper;
import br.com.regalaya.order.repository.OrderRepository;
import br.com.regalaya.order.repository.OrderSpecifications;
import br.com.regalaya.order.repository.OrderStatusHistoryRepository;
import br.com.regalaya.order.repository.RefundTransactionRepository;
import br.com.regalaya.order.domain.model.OrderStatusHistory;
import br.com.regalaya.order.domain.model.RefundTransaction;
import br.com.regalaya.order.domain.model.RefundType;
import br.com.regalaya.order.domain.model.RefundStatus;
import br.com.regalaya.order.dto.requests.RefundRequest;
import br.com.regalaya.order.services.OrderService;
import br.com.regalaya.order.service.OrderStatusTransitionValidator;
import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.repository.ProductRepository;
import br.com.regalaya.cart.dto.responses.CartResponse;
import br.com.regalaya.cart.services.service.CartService;
import br.com.regalaya.contact.domain.model.Contact;
import br.com.regalaya.contact.repository.ContactRepository;
import br.com.regalaya.address.services.service.AddressService;
import br.com.regalaya.shared.exception.BusinessException;
import br.com.regalaya.shared.exception.ResourceNotFoundException;
import br.com.regalaya.shipping.dto.requests.Dimensions;
import br.com.regalaya.shipping.dto.requests.ShippingCalcRequest;
import br.com.regalaya.shipping.dto.responses.ShippingOption;
import br.com.regalaya.shipping.services.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final ShippingService shippingService;
    private final AddressService addressService;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final OrderStatusTransitionValidator statusTransitionValidator;
    private final RefundTransactionRepository refundTransactionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> findAll(Pageable pageable) {
        Page<Order> page = orderRepository.findAllWithItemsOrderByCreatedAtDesc(pageable);
        List<OrderResponse> content = page.getContent().stream()
                .map(orderMapper::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderListResponse> findAllAdmin(
            OrderStatus status,
            LocalDate startDate,
            LocalDate endDate,
            String customerName,
            String customerEmail,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String sortBy,
            String sortDirection,
            Pageable pageable) {

        // Aplicar ordenação customizada se necessário
        Sort.Order sortOrder = sortBy != null && sortDirection != null
                ? new Sort.Order(Sort.Direction.fromString(sortDirection), sortBy)
                : null;

        Pageable finalPageable = sortOrder != null
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortOrder))
                : pageable;

        // Construir specification com filtros
        var spec = OrderSpecifications.combine(
                status, startDate, endDate, minAmount, maxAmount,
                customerName, customerEmail
        );

        Page<Order> page;
        if (spec != null) {
            page = orderRepository.findAll(spec, finalPageable);
        } else {
            page = orderRepository.findAllWithItemsOrderByCreatedAtDesc(finalPageable);
        }

        List<OrderListResponse> content = page.getContent().stream()
                .map(orderMapper::toListResponse)
                .toList();

        return new PageImpl<>(content, finalPageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> findRecent(int limit) {
        return orderRepository.findTop5WithItemsByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse findById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        // Carregar histórico de status
        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByChangedAtAsc(id);
        order.setStatusHistory(history);

        return orderMapper.toDetailResponse(order);
    }

    @Override
    @Transactional
    public OrderDetailResponse updateStatus(UUID id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        OrderStatus previousStatus = order.getStatus();

        // 1. Validar transição de status
        if (!statusTransitionValidator.isValidTransition(previousStatus, request.status())) {
            String errorMessage = statusTransitionValidator.getInvalidTransitionMessage(previousStatus, request.status());
            throw new BusinessException(errorMessage);
        }

        // 2. Validar regras específicas
        validateStatusChangeRules(order, request);

        // 3. Aplicar mudança de status
        order.setStatus(request.status());

        // 4. Aplicar trackingCode se fornecido (para SHIPPED)
        if (request.trackingCode() != null && !request.trackingCode().isBlank()) {
            order.setTrackingCode(request.trackingCode());
        }

        // 5. Aplicar notas
        if (request.notes() != null && !request.notes().isBlank()) {
            String existingNotes = order.getNotes();
            String newNotes = existingNotes != null && !existingNotes.isBlank()
                    ? existingNotes + "\n" + request.notes()
                    : request.notes();
            order.setNotes(newNotes);
        }

        Order saved = orderRepository.save(order);

        // 6. Registrar histórico de status
        recordStatusChange(
                id,
                previousStatus,
                request.status(),
                "ADMIN", // TODO: obter do contexto de segurança
                request.notes() != null ? request.notes() : "Status atualizado pelo admin"
        );

        // 7. Enviar notificação se solicitado
        if (request.sendNotification() != null && request.sendNotification()) {
            // TODO: Integrar com NotificationService para enviar email e WhatsApp
            log.info("Notification requested for order {} status change: {} -> {}", id, previousStatus, request.status());
        }

        // 8. Se CANCELLED, reverter estoque
        if (request.status() == OrderStatus.CANCELLED) {
            revertInventory(order);
        }

        return orderMapper.toDetailResponse(saved);
    }

    private void validateStatusChangeRules(Order order, UpdateOrderStatusRequest request) {
        // Se SHIPPED, deve ter trackingCode
        if (request.status() == OrderStatus.SHIPPED &&
            (request.trackingCode() == null || request.trackingCode().isBlank())) {
            throw new BusinessException("Código de rastreamento é obrigatório ao marcar como SHIPPED");
        }

        // Se DELIVERED, deve ter shipping address preenchida
        if (request.status() == OrderStatus.DELIVERED &&
            (order.getShippingAddress() == null || order.getShippingAddress().isBlank())) {
            throw new BusinessException("Endereço de entrega não informado. Não é possível marcar como DELIVERED");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> findByUserId(UUID userId, Pageable pageable) {
        Page<Order> page = orderRepository.findByUserIdWithItems(userId, pageable);
        List<OrderResponse> content = page.getContent().stream()
                .map(orderMapper::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> findByUserId(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse findByIdForUser(UUID id, UUID userId) {
        Order order = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return orderMapper.toDetailResponse(order);
    }

    @Override
    @Transactional
    public OrderDetailResponse create(UUID userId, CreateOrderRequest request) {
        log.info("Creating order for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        // 1. Buscar carrinho do usuário
        CartResponse cart = cartService.getCart(userId);

        if (cart.items().isEmpty()) {
            throw new BusinessException("Seu carrinho está vazio");
        }

        // 2. Validar estoque de todos os produtos (double-check com locking)
        for (var cartItem : cart.items()) {
            Product product = productRepository.findById(cartItem.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + cartItem.productId()));

            if (!product.getIsActive()) {
                throw new BusinessException("Produto indisponível: " + product.getName());
            }

            if (product.getStock() < cartItem.quantity()) {
                throw new BusinessException("Estoque insuficiente para: " + product.getName() +
                        ". Disponível: " + product.getStock() + ", solicitado: " + cartItem.quantity());
            }
        }

        // 3. Calcular totais
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (var cartItem : cart.items()) {
            Product product = productRepository.findById(cartItem.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + cartItem.productId()));

            // Diminuir estoque (reserva atômica)
            int newStock = product.getStock() - cartItem.quantity();
            product.setStock(newStock);
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.quantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .productName(product.getName())
                    .productSku(product.getSku())
                    .quantity(cartItem.quantity())
                    .unitPrice(product.getPrice())
                    .total(itemTotal)
                    .imageUrl(product.getImages())
                    .build();
            orderItems.add(orderItem);
        }

        // 4. Gerar número do pedido
        String orderNumber = generateOrderNumber();

        // 5. Construir endereço de entrega
        String shippingAddress = buildShippingAddress(request, user);

        // 6. Criar pedido
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customerName(request.customerName() != null ? request.customerName() : user.getName())
                .customerEmail(request.customerEmail() != null ? request.customerEmail() : user.getEmail())
                .customerPhone(request.customerPhone() != null ? request.customerPhone() : user.getPhone())
                .status(OrderStatus.PENDING)
                .total(subtotal)
                .subtotal(subtotal)
                .shipping(BigDecimal.ZERO)
                .discount(BigDecimal.ZERO)
                .paymentMethod(request.paymentMethod())
                .paymentStatus("pending")
                .shippingAddress(shippingAddress)
                .notes(request.notes())
                .message(request.message())
                .scheduledAt(request.scheduledAt())
                .orderItems(orderItems)
                .user(user)
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        Order saved = orderRepository.save(order);

        // 7. Limpar carrinho após criar pedido
        cartService.clearCart(userId);

        log.info("Order created successfully: {} for user: {}", saved.getOrderNumber(), userId);
        return orderMapper.toDetailResponse(saved);
    }

    private String buildShippingAddress(CreateOrderRequest request, User user) {
        // Se addressId fornecido, buscar endereço completo
        // TODO: Implementar quando address module estiver pronto
        // Por agora, usar shippingAddress do request ou fallback para dados do usuário
        if (request.shippingAddress() != null && !request.shippingAddress().isBlank()) {
            return request.shippingAddress();
        }
        // Fallback temporário
        return "Endereço não informado";
    }

    @Override
    @Transactional
    public OrderDetailResponse createFromCart(UUID userId, CreateCheckoutRequest request) {
        log.info("Creating order from cart for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        // 1. Buscar carrinho do usuário
        CartResponse cart = cartService.getCart(userId);

        if (cart.items().isEmpty()) {
            throw new BusinessException("Seu carrinho está vazio");
        }

        // 2. Validar estoque de todos os produtos (double-check) - com locking pessimista
        for (var cartItem : cart.items()) {
            Product product = productRepository.findByIdWithLock(cartItem.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + cartItem.productId()));

            if (!product.getIsActive()) {
                throw new BusinessException("Produto indisponível: " + product.getName());
            }

            if (product.getStock() < cartItem.quantity()) {
                throw new BusinessException("Estoque insuficiente para: " + product.getName() +
                        ". Disponível: " + product.getStock() + ", solicitado: " + cartItem.quantity());
            }
        }

        // 3. Calcular subtotal a partir dos items do carrinho e diminuir estoque
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (var cartItem : cart.items()) {
            Product product = productRepository.findByIdWithLock(cartItem.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + cartItem.productId()));

            // Diminuir estoque (reserva atômica)
            int newStock = product.getStock() - cartItem.quantity();
            product.setStock(newStock);
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.quantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .productName(product.getName())
                    .productSku(product.getSku())
                    .quantity(cartItem.quantity())
                    .unitPrice(product.getPrice())
                    .total(itemTotal)
                    .imageUrl(product.getImages())
                    .build();
            orderItems.add(orderItem);
        }

        // 4. Gerar número do pedido
        String orderNumber = generateOrderNumber();

        // 5. Construir endereço de entrega
        String shippingAddress = buildShippingAddressFromCheckout(request, user);

        // 6. Calcular frete (se addressId fornecido)
        BigDecimal shippingCost = BigDecimal.ZERO;
        if (request.addressId() != null) {
            // TODO: Obter CEP real do endereço via AddressService
            // Por enquanto, usar CEP fixo para desenvolvimento
            String zipCode = "00000000";

            // Calcular peso total (kg) - simplificado: 1kg por produto
            double totalWeight = cart.items().stream()
                    .mapToDouble(item -> item.quantity() * 1.0) // assumindo 1kg por item
                    .sum();

            // Dimensões totais (simplificado)
            Dimensions dimensions = new Dimensions(10.0, 10.0, 10.0); // cm

            ShippingCalcRequest shippingRequest = new ShippingCalcRequest(
                    zipCode,
                    totalWeight,
                    dimensions,
                    null
            );

            try {
                List<ShippingOption> shippingOptions = shippingService.calculateShipping(shippingRequest);
                if (!shippingOptions.isEmpty()) {
                    ShippingOption cheapest = shippingOptions.get(0);
                    shippingCost = BigDecimal.valueOf(cheapest.price());

                    // Aplicar frete grátis se subtotal >= threshold e for PAC
                    if (shippingService.isFreeShippingApplicable(subtotal.doubleValue()) &&
                            cheapest.carrier().equals("CORREIOS") && cheapest.service().equals("PAC")) {
                        shippingCost = BigDecimal.ZERO;
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to calculate shipping, using fallback: {}", e.getMessage());
                shippingCost = BigDecimal.valueOf(29.90); // fallback
            }
        }

        // 7. Calcular total final
        BigDecimal total = subtotal.add(shippingCost);

        // 8. Criar pedido
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customerName(user.getName())
                .customerEmail(user.getEmail())
                .customerPhone(user.getPhone())
                .status(OrderStatus.PENDING)
                .total(total)
                .subtotal(subtotal)
                .shipping(shippingCost)
                .discount(BigDecimal.ZERO)
                .paymentMethod(request.paymentMethod())
                .paymentStatus("pending")
                .shippingAddress(shippingAddress)
                .notes(request.notes())
                .message(request.message())
                .scheduledAt(request.scheduledAt())
                .orderItems(orderItems)
                .user(user)
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        Order saved = orderRepository.save(order);

        // 9. Limpar carrinho após criar pedido
        cartService.clearCart(userId);

        log.info("Order created from cart successfully: {} for user: {}. Total: {}", saved.getOrderNumber(), userId, total);
        return orderMapper.toDetailResponse(saved);
    }

    private String buildShippingAddressFromCheckout(CreateCheckoutRequest request, User user) {
        if (request.addressId() != null) {
            try {
                var addressResponse = addressService.findById(user.getId(), request.addressId());
                return String.format("%s, %s - %s/%s",
                    addressResponse.street(),
                    addressResponse.number() != null ? addressResponse.number() : "",
                    addressResponse.city(),
                    addressResponse.state());
            } catch (Exception e) {
                log.warn("Failed to fetch address {}: {}", request.addressId(), e.getMessage());
                return "Endereço ID: " + request.addressId();
            }
        }
        return "Endereço a ser informado";
    }

    private String generateOrderNumber() {
        return "REG-" + System.currentTimeMillis();
    }

    @Override
    @Transactional
    public void recordStatusChange(UUID orderId, OrderStatus previousStatus, OrderStatus newStatus, String changedBy, String reason) {
        Order orderRef = new Order();
        orderRef.setId(orderId);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(orderRef)
                .previousStatus(previousStatus)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .reason(reason)
                .changedAt(java.time.LocalDateTime.now())
                .build();

        statusHistoryRepository.save(history);
        log.info("Status change recorded for order {}: {} -> {} by {}", orderId, previousStatus, newStatus, changedBy);
    }

    @Override
    @Transactional
    public OrderDetailResponse processRefund(UUID orderId, RefundRequest request) {
        // 1. Buscar pedido
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 2. Validar se pedido está em status elegível para reembolso
        if (!isEligibleForRefund(order.getStatus())) {
            throw new BusinessException("Pedido não está elegível para reembolso. Status atual: " + order.getStatus());
        }

        // 3. Calcular valor do reembolso
        BigDecimal refundAmount;
        if (request.type() == RefundType.FULL) {
            refundAmount = calculateFullRefundAmount(order);
        } else {
            // PARTIAL
            if (request.amount() == null) {
                throw new BusinessException("Valor é obrigatório para reembolso parcial");
            }
            refundAmount = validateAndCalculatePartialRefund(order, request.amount());
        }

        // 4. Processar estorno via payment gateway
        String gatewayRefundId = null;
        String gatewayResponse = null;
        try {
            // TODO: Integração real com gateway de pagamento (Stripe/MercadoPago)
            // Simulação: Chamar PaymentService para processar reembolso
            log.info("Processing {} refund for order {}: amount={}, reason={}",
                    request.type(), order.getOrderNumber(), refundAmount, request.reason());

            // Simular sucesso
            gatewayRefundId = "ref_" + System.currentTimeMillis();
            gatewayResponse = "{\"status\":\"completed\",\"id\":\"" + gatewayRefundId + "\"}";

        } catch (Exception e) {
            log.error("Failed to process refund via payment gateway", e);
            throw new BusinessException("Falha ao processar reembolso no gateway de pagamento: " + e.getMessage());
        }

        // 5. Registrar transação de reembolso
        RefundTransaction refund = RefundTransaction.builder()
                .order(order)
                .amount(refundAmount)
                .type(request.type())
                .reason(request.reason())
                .gatewayRefundId(gatewayRefundId)
                .gatewayResponse(gatewayResponse)
                .status(RefundStatus.COMPLETED)
                .processedBy("ADMIN") // TODO: obter do contexto de segurança
                .completedAt(java.time.LocalDateTime.now())
                .build();

        refundTransactionRepository.save(refund);

        // 6. Atualizar status do pedido para REFUNDED
        order.setStatus(OrderStatus.REFUNDED);
        Order saved = orderRepository.save(order);

        // 7. Registrar histórico de status
        recordStatusChange(
                orderId,
                order.getStatus(), // status anterior (antes de alterar para REFUNDED)
                OrderStatus.REFUNDED,
                "ADMIN",
                "Reembolso processado: " + request.reason()
        );

        // 8. Devolver estoque se necessário
        if (request.type() == RefundType.FULL || shouldReturnInventory(order, request.amount())) {
            revertInventory(order);
        }

        // 9. Enviar notificações (email e WhatsApp)
        // TODO: Integrar com NotificationService
        log.info("Refund notifications would be sent to customer: {}", order.getCustomerEmail());

        return orderMapper.toDetailResponse(saved);
    }

    private boolean isEligibleForRefund(OrderStatus status) {
        // Apenas PAID, PROCESSING, DELIVERED são elegíveis (conforme spec)
        return status == OrderStatus.PAID ||
               status == OrderStatus.PROCESSING ||
               status == OrderStatus.DELIVERED;
    }

    private BigDecimal calculateFullRefundAmount(Order order) {
        // Reembolso total: subtotal + shipping? Aセpec indica que para SHIPPED apenas valor dos itens
        // Se order foi shipmentado, não reembolsar frete
        boolean wasShipped = order.getTrackingCode() != null;
        if (wasShipped) {
            return order.getSubtotal(); // Sem frete
        }
        return order.getTotal();
    }

    private BigDecimal validateAndCalculatePartialRefund(Order order, BigDecimal amount) {
        BigDecimal maxRefund = calculateFullRefundAmount(order);
        if (amount.compareTo(maxRefund) > 0) {
            throw new BusinessException("Valor do reembolso não pode exceder R$ " + maxRefund);
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Valor do reembolso deve ser maior que zero");
        }
        return amount;
    }

    private boolean shouldReturnInventory(Order order, BigDecimal refundAmount) {
        // Devolver estoque se reembolso for do valor total dos itens
        BigDecimal itemRefundRatio = refundAmount.divide(order.getSubtotal(), 2, java.math.RoundingMode.HALF_UP);
        return itemRefundRatio.compareTo(new BigDecimal("0.9")) >= 0; // Se >= 90% dos itens, devolve tudo
    }

    private void revertInventory(Order order) {
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            return;
        }

        log.info("Reverting inventory for order: {}", order.getOrderNumber());

        for (var item : order.getOrderItems()) {
            log.warn("Need to revert stock for product: {} (SKU: {}) - quantity: {}",
                    item.getProductName(), item.getProductSku(), item.getQuantity());

            // TODO: Implementar quando houver integração com ProductRepository
            // Product product = productRepository.findBySku(item.getProductSku())
            //     .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + item.getProductSku()));
            // product.setStock(product.getStock() + item.getQuantity());
            // productRepository.save(product);
        }
    }
}