# Padrões de Arquitetura - Spring Boot Enterprise

## 1. Strategy Pattern

Use para eliminar blocos if/else ou switch crescentes.

```java
// Interface Strategy
public interface PaymentStrategy {
    PaymentResult process(PaymentRequest request);
    boolean supports(PaymentType type);
}

// Implementações
@Component
public class CreditCardPaymentStrategy implements PaymentStrategy {
    @Override
    public PaymentResult process(PaymentRequest request) {
        // Lógica específica
    }
    
    @Override
    public boolean supports(PaymentType type) {
        return type == PaymentType.CREDIT_CARD;
    }
}

@Component
public class PixPaymentStrategy implements PaymentStrategy {
    @Override
    public PaymentResult process(PaymentRequest request) {
        // Lógica específica
    }
    
    @Override
    public boolean supports(PaymentType type) {
        return type == PaymentType.PIX;
    }
}

// Service que utiliza Strategy
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final List<PaymentStrategy> strategies;
    
    public PaymentResult process(PaymentRequest request) {
        PaymentStrategy strategy = strategies.stream()
            .filter(s -> s.supports(request.type()))
            .findFirst()
            .orElseThrow(() -> new UnsupportedPaymentException("Payment type not supported: " + request.type()));
        
        return strategy.process(request);
    }
}
```

## 2. Specification Pattern

Use `org.springframework.data.jpa.domain.Specification` para filtros dinâmicos reutilizáveis.

```java
public class OrderSpecifications {
    
    public static Specification<Order> hasCustomerName(String customerName) {
        return (root, query, cb) -> {
            if (customerName == null || customerName.isBlank()) {
                return null;
            }
            return cb.like(
                cb.lower(root.get("customer").get("name")),
                "%" + customerName.toLowerCase() + "%"
            );
        };
    }
    
    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return null;
            }
            return cb.equal(root.get("status"), status);
        };
    }
    
    public static Specification<Order> createdBetween(LocalDateTime start, LocalDateTime end) {
        return (root, query, cb) -> {
            if (start == null && end == null) {
                return null;
            }
            if (start == null) {
                return cb.lessThanOrEqualTo(root.get("createdAt"), end);
            }
            if (end == null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), start);
            }
            return cb.between(root.get("createdAt"), start, end);
        };
    }
    
    public static Specification<Order> hasMinValue(BigDecimal minValue) {
        return (root, query, cb) -> {
            if (minValue == null) {
                return null;
            }
            return cb.greaterThanOrEqualTo(root.get("totalValue"), minValue);
        };
    }
}

// Uso no Service
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public Page<OrderResponse> search(OrderSearchRequest request, Pageable pageable) {
        Specification<Order> spec = Specification.where(null)
            .and(OrderSpecifications.hasCustomerName(request.customerName()))
            .and(OrderSpecifications.hasStatus(request.status()))
            .and(OrderSpecifications.createdBetween(request.startDate(), request.endDate()))
            .and(OrderSpecifications.hasMinValue(request.minValue()));
        
        return orderRepository.findAll(spec, pageable)
            .map(orderMapper::toResponse);
    }
}

// Repository
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {
}
```

## 3. State Pattern

Use para entidades com ciclos de vida complexos (ex: Status de Pedido).

```java
// Interface State
public interface OrderState {
    OrderStatus getStatus();
    void process(Order order);
    void cancel(Order order);
    void complete(Order order);
    boolean canTransitionTo(OrderStatus newStatus);
}

// Implementações de Estado
@Component
public class PendingOrderState implements OrderState {
    
    @Override
    public OrderStatus getStatus() {
        return OrderStatus.PENDING;
    }
    
    @Override
    public void process(Order order) {
        order.setStatus(OrderStatus.PROCESSING);
        order.setProcessedAt(LocalDateTime.now());
    }
    
    @Override
    public void cancel(Order order) {
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
    }
    
    @Override
    public void complete(Order order) {
        throw new InvalidStateTransitionException("Cannot complete a pending order");
    }
    
    @Override
    public boolean canTransitionTo(OrderStatus newStatus) {
        return newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.CANCELLED;
    }
}

@Component
public class ProcessingOrderState implements OrderState {
    
    @Override
    public OrderStatus getStatus() {
        return OrderStatus.PROCESSING;
    }
    
    @Override
    public void process(Order order) {
        throw new InvalidStateTransitionException("Order is already being processed");
    }
    
    @Override
    public void cancel(Order order) {
        throw new InvalidStateTransitionException("Cannot cancel order in processing");
    }
    
    @Override
    public void complete(Order order) {
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
    }
    
    @Override
    public boolean canTransitionTo(OrderStatus newStatus) {
        return newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.FAILED;
    }
}

// Factory para estados
@Component
@RequiredArgsConstructor
public class OrderStateFactory {
    
    private final List<OrderState> states;
    
    public OrderState getState(OrderStatus status) {
        return states.stream()
            .filter(s -> s.getStatus() == status)
            .findFirst()
            .orElseThrow(() -> new InvalidStateException("Unknown status: " + status));
    }
}

// Uso na Entidade
@Entity
public class Order {
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @Transient
    private OrderState state;
    
    @PostLoad
    public void postLoad() {
        this.state = stateFactory.getState(this.status);
    }
    
    public void process() {
        state.process(this);
    }
    
    public void cancel() {
        state.cancel(this);
    }
    
    public void complete() {
        state.complete(this);
    }
}
```

## 4. Builder Pattern com Lombok

Use para construção complexa de objetos.

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;
    
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Método de negócio
    public void applyDiscount(BigDecimal percentage) {
        if (percentage.compareTo(BigDecimal.ZERO) < 0 || percentage.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new BusinessException("Discount percentage must be between 0 and 100");
        }
        
        BigDecimal discount = price.multiply(percentage).divide(BigDecimal.valueOf(100));
        this.price = this.price.subtract(discount);
    }
}

// Uso do Builder
Product product = Product.builder()
    .name("Smartphone XYZ")
    .description("Latest model with advanced features")
    .price(new BigDecimal("999.99"))
    .tags(Set.of("electronics", "mobile", "gadget"))
    .build();
```

## 5. Mapper Pattern

Use para conversão entre entidades e DTOs.

```java
@Mapper(componentModel = "spring")
public interface UserMapper {
    
    // Entity -> Response DTO
    UserResponse toResponse(User user);
    
    // Request DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    User toEntity(CreateUserRequest request);
    
    // Update Entity from Request
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "email", ignore = true) // Email cannot be updated
    void updateEntity(@MappingTarget User user, UpdateUserRequest request);
    
    // List conversions
    List<UserResponse> toResponseList(List<User> users);
    
    // Projeção
    default UserSummaryResponse toSummaryResponse(UserProjection projection) {
        if (projection == null) {
            return null;
        }
        return new UserSummaryResponse(
            projection.getId(),
            projection.getName(),
            projection.getEmail()
        );
    }
}

// Se não usar MapStruct, implementação manual
@Component
public class UserMapperImpl implements UserMapper {
    
    @Override
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .status(user.getStatus())
            .createdAt(user.getCreatedAt())
            .build();
    }
    
    @Override
    public User toEntity(CreateUserRequest request) {
        if (request == null) {
            return null;
        }
        
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setStatus(UserStatus.ACTIVE);
        
        return user;
    }
}
```

## 6. Repository Pattern Avançado

```java
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order>, CustomOrderRepository {
    
    // Query Methods
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByCustomerIdAndStatus(UUID customerId, OrderStatus status);
    
    boolean existsByOrderNumber(String orderNumber);
    
    // Projeção com JPQL
    @Query("SELECT new com.example.OrderSummary(o.id, o.orderNumber, o.totalValue, o.status) " +
           "FROM Order o WHERE o.customer.id = :customerId")
    List<OrderSummary> findSummariesByCustomerId(@Param("customerId") UUID customerId);
    
    // Projeção com Record
    @Query("SELECT new com.example.OrderProjection(o.id, o.orderNumber, o.createdAt) " +
           "FROM Order o WHERE o.status = :status ORDER BY o.createdAt DESC")
    List<OrderProjection> findRecentOrdersByStatus(@Param("status") OrderStatus status, Pageable pageable);
    
    // Update com Query
    @Modifying
    @Query("UPDATE Order o SET o.status = :newStatus WHERE o.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("newStatus") OrderStatus newStatus);
    
    // Native Query (quando necessário)
    @Query(value = "SELECT * FROM orders WHERE created_at > :date ORDER BY total_value DESC", nativeQuery = true)
    List<Order> findHighValueOrdersSince(@Param("date") LocalDateTime date);
    
    // EntityGraph para evitar N+1
    @EntityGraph(attributePaths = {"customer", "items", "items.product"})
    Optional<Order> findWithDetailsById(UUID id);
    
    // Streaming para grandes volumes
    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Stream<Order> streamByStatus(@Param("status") OrderStatus status);
}

// Interface Custom para queries complexas
public interface CustomOrderRepository {
    List<OrderReport> generateReport(OrderReportCriteria criteria);
}

// Implementação Custom
@Repository
@RequiredArgsConstructor
public class CustomOrderRepositoryImpl implements CustomOrderRepository {
    
    private final EntityManager entityManager;
    
    @Override
    public List<OrderReport> generateReport(OrderReportCriteria criteria) {
        StringBuilder jpql = new StringBuilder("SELECT new com.example.OrderReport(" +
            "o.status, COUNT(o), SUM(o.totalValue), AVG(o.totalValue)) " +
            "FROM Order o WHERE 1=1");
        
        Map<String, Object> params = new HashMap<>();
        
        if (criteria.startDate() != null) {
            jpql.append(" AND o.createdAt >= :startDate");
            params.put("startDate", criteria.startDate());
        }
        
        if (criteria.endDate() != null) {
            jpql.append(" AND o.createdAt <= :endDate");
            params.put("endDate", criteria.endDate());
        }
        
        jpql.append(" GROUP BY o.status");
        
        TypedQuery<OrderReport> query = entityManager.createQuery(jpql.toString(), OrderReport.class);
        params.forEach(query::setParameter);
        
        return query.getResultList();
    }
}
```

## 7. Event-Driven Architecture

Use `ApplicationEventPublisher` para desacoplar módulos.

```java
// Event
public record OrderCreatedEvent(
    UUID orderId,
    UUID customerId,
    BigDecimal totalValue,
    LocalDateTime createdAt
) {}

// Publisher
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        // ... criação do pedido
        
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getCustomerId(),
            order.getTotalValue(),
            order.getCreatedAt()
        );
        
        eventPublisher.publishEvent(event);
        
        return orderMapper.toResponse(order);
    }
}

// Listener
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {
    
    private final EmailService emailService;
    private final InventoryService inventoryService;
    
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Order created: {}", event.orderId());
        
        // Enviar email de confirmação
        emailService.sendOrderConfirmation(event);
        
        // Atualizar inventário
        inventoryService.reserveStock(event);
    }
    
    // Transactional Event Listener - só executa após commit
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderCreatedAfterCommit(OrderCreatedEvent event) {
        log.info("Order committed: {}", event.orderId());
        
        // Operações que só devem ocorrer após commit bem-sucedido
        notificationService.notifyWarehouse(event);
    }
    
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void handleOrderRollback(OrderCreatedEvent event) {
        log.warn("Order rolled back: {}", event.orderId());
        
        // Cleanup em caso de rollback
        auditService.logFailedOrder(event);
    }
}
```

## 8. DTOs como Records

Padrão obrigatório para todos os DTOs.

```java
// Request DTOs
public record CreateUserRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    String name,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "Senha deve conter letra maiúscula, minúscula e número")
    String password,

    @NotNull(message = "Perfil é obrigatório")
    UserRole role
) {}

public record UpdateUserRequest(
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    String name,

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Formato de telefone inválido")
    String phone
) {}

// Response DTOs
public record UserResponse(
    UUID id,
    String name,
    String email,
    UserStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

public record UserDetailResponse(
    UUID id,
    String name,
    String email,
    String phone,
    UserRole role,
    UserStatus status,
    CompanySummaryResponse company,
    List<AddressResponse> addresses,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

// Projeções como Records
public record UserProjection(
    UUID id,
    String name,
    String email
) {}

public record OrderSummary(
    UUID id,
    String orderNumber,
    BigDecimal totalValue,
    OrderStatus status
) {}

// DTOs para operações específicas
public record ChangePasswordRequest(
    @NotBlank(message = "Senha atual é obrigatória")
    String currentPassword,

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "Senha deve conter letra maiúscula, minúscula e número")
    String newPassword,

    @NotBlank(message = "Confirmação de senha é obrigatória")
    String confirmPassword
) {
    public ChangePasswordRequest {
        if (!newPassword.equals(confirmPassword)) {
            throw new BusinessException("Nova senha e confirmação não coincidem");
        }
    }
}
```
