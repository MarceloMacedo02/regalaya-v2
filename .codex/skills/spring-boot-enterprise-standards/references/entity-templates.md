# Entity Templates - Spring Boot Enterprise

## Template Base para Entidades JPA

```java
@Entity
@Table(name = "entities")
@Getter
@Setter
@ToString(exclude = {"relatedEntities"})
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class EntityName {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Version
    private Long version;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    private String lastModifiedBy;
}
```

## Entidade com Soft Delete

```java
@Entity
@Table(name = "products")
@Getter
@Setter
@ToString(exclude = {"category", "suppliers"})
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE products SET deleted = true, deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted = false")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal price;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;
    
    // Soft delete
    @Builder.Default
    private boolean deleted = false;
    
    private LocalDateTime deletedAt;
    
    // Auditoria
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Relacionamentos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_suppliers",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "supplier_id")
    )
    @Builder.Default
    private Set<Supplier> suppliers = new HashSet<>();
    
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();
    
    // Element Collection
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "product_attributes", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "attribute_name")
    @Column(name = "attribute_value")
    @Builder.Default
    private Map<String, String> attributes = new HashMap<>();
    
    // Métodos de negócio
    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }
    
    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }
    
    public void addSupplier(Supplier supplier) {
        suppliers.add(supplier);
    }
    
    public void removeSupplier(Supplier supplier) {
        suppliers.remove(supplier);
    }
    
    public void applyDiscount(BigDecimal percentage) {
        Assert.isTrue(percentage.compareTo(BigDecimal.ZERO) >= 0 && 
                     percentage.compareTo(BigDecimal.valueOf(100)) <= 0,
                     "Desconto deve estar entre 0 e 100%");
        
        BigDecimal discount = price.multiply(percentage).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        this.price = this.price.subtract(discount);
    }
    
    public void decreaseStock(int quantity) {
        Assert.isTrue(quantity > 0, "Quantidade deve ser positiva");
        Assert.isTrue(this.stock >= quantity, "Estoque insuficiente");
        
        this.stock -= quantity;
    }
    
    public void increaseStock(int quantity) {
        Assert.isTrue(quantity > 0, "Quantidade deve ser positiva");
        
        this.stock += quantity;
    }
    
    @PrePersist
    @PreUpdate
    public void prePersist() {
        if (this.price != null && this.price.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Preço não pode ser negativo");
        }
    }
}
```

## Entidade com Hierarquia (Herança)

```java
// Classe base (não é entity)
@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
}

// Estratégia SINGLE_TABLE
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class User extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;
}

@Entity
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser extends User {
    
    @Column(name = "admin_level")
    private Integer adminLevel;
    
    @ElementCollection
    @CollectionTable(name = "admin_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "permission")
    private Set<AdminPermission> permissions;
}

@Entity
@DiscriminatorValue("CUSTOMER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUser extends User {
    
    @Column(name = "loyalty_points")
    private Integer loyaltyPoints;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Address> addresses;
}

// Estratégia JOINED (preferida para normalização)
@Entity
@Table(name = "payments")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "payment_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Payment extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String transactionId;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}

@Entity
@Table(name = "credit_card_payments")
@DiscriminatorValue("CREDIT_CARD")
@PrimaryKeyJoinColumn(name = "payment_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditCardPayment extends Payment {
    
    @Column(name = "card_last_four", length = 4)
    private String cardLastFour;
    
    @Column(name = "card_brand")
    private String cardBrand;
    
    @Column(name = "installments")
    private Integer installments;
}

@Entity
@Table(name = "pix_payments")
@DiscriminatorValue("PIX")
@PrimaryKeyJoinColumn(name = "payment_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PixPayment extends Payment {
    
    @Column(name = "pix_key")
    private String pixKey;
    
    @Column(name = "qr_code", columnDefinition = "TEXT")
    private String qrCode;
    
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
}
```

## Entidade com Status e Transições

```java
@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true, length = 20)
    private String orderNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalValue;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
    
    // Datas de transição
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime confirmedAt;
    private LocalDateTime paidAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;
    
    // Motivo de cancelamento
    private String cancellationReason;
    
    @PrePersist
    public void prePersist() {
        if (this.orderNumber == null) {
            this.orderNumber = generateOrderNumber();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
    
    // Transições de estado
    public void confirm() {
        validateTransition(OrderStatus.CONFIRMED);
        this.status = OrderStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }
    
    public void markAsPaid() {
        validateTransition(OrderStatus.PAID);
        this.status = OrderStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }
    
    public void ship(String trackingCode) {
        validateTransition(OrderStatus.SHIPPED);
        Assert.hasText(trackingCode, "Código de rastreio é obrigatório");
        this.status = OrderStatus.SHIPPED;
        this.shippedAt = LocalDateTime.now();
    }
    
    public void deliver() {
        validateTransition(OrderStatus.DELIVERED);
        this.status = OrderStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }
    
    public void cancel(String reason) {
        validateTransition(OrderStatus.CANCELLED);
        Assert.hasText(reason, "Motivo de cancelamento é obrigatório");
        this.status = OrderStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = reason;
    }
    
    private void validateTransition(OrderStatus newStatus) {
        if (!this.status.canTransitionTo(newStatus)) {
            throw new InvalidStateTransitionException(
                String.format("Não é possível transitar de %s para %s", this.status, newStatus)
            );
        }
    }
    
    // Métodos de negócio
    public void addItem(Product product, int quantity, BigDecimal unitPrice) {
        Assert.isTrue(quantity > 0, "Quantidade deve ser positiva");
        Assert.notNull(product, "Produto é obrigatório");
        Assert.notNull(unitPrice, "Preço é obrigatório");
        
        OrderItem item = OrderItem.builder()
            .product(product)
            .quantity(quantity)
            .unitPrice(unitPrice)
            .order(this)
            .build();
        
        items.add(item);
        recalculateTotal();
    }
    
    public void removeItem(OrderItem item) {
        items.remove(item);
        recalculateTotal();
    }
    
    private void recalculateTotal() {
        this.totalValue = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() + ThreadLocalRandom.current().nextInt(1000, 9999);
    }
}

// Enum com regras de transição
public enum OrderStatus {
    PENDING(Set.of(CONFIRMED, CANCELLED)),
    CONFIRMED(Set.of(PAID, CANCELLED)),
    PAID(Set.of(SHIPPED)),
    SHIPPED(Set.of(DELIVERED)),
    DELIVERED(Set.of()),
    CANCELLED(Set.of());
    
    private final Set<OrderStatus> allowedTransitions;
    
    OrderStatus(Set<OrderStatus> allowedTransitions) {
        this.allowedTransitions = allowedTransitions;
    }
    
    public boolean canTransitionTo(OrderStatus newStatus) {
        return allowedTransitions.contains(newStatus);
    }
}
```

## Entidade com Campos JSONB (PostgreSQL)

```java
@Entity
@Table(name = "configurations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class Configuration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String key;
    
    private String description;
    
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private ConfigValue value;
    
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Value Object
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConfigValue {
        private String type;
        private Object data;
        private boolean encrypted;
    }
}

// Configuração do Hibernate Types
@Configuration
public class HibernateConfig {
    
    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
        return hibernateProperties -> 
            hibernateProperties.put("hibernate.types.print.banner", false);
    }
}
```

## Entidade com Versão e Lock Otimista

```java
@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class InventoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer reservedQuantity = 0;
    
    @Version
    private Long version;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Métodos thread-safe com lock otimista
    public void addStock(int amount) {
        Assert.isTrue(amount > 0, "Quantidade deve ser positiva");
        this.quantity += amount;
    }
    
    public void reserve(int amount) {
        Assert.isTrue(amount > 0, "Quantidade deve ser positiva");
        Assert.isTrue(this.quantity - this.reservedQuantity >= amount, 
                     "Estoque insuficiente para reserva");
        this.reservedQuantity += amount;
    }
    
    public void releaseReservation(int amount) {
        Assert.isTrue(amount > 0, "Quantidade deve ser positiva");
        Assert.isTrue(this.reservedQuantity >= amount, 
                     "Quantidade de reserva insuficiente");
        this.reservedQuantity -= amount;
    }
    
    public void deductReserved(int amount) {
        Assert.isTrue(amount > 0, "Quantidade deve ser positiva");
        Assert.isTrue(this.reservedQuantity >= amount, 
                     "Quantidade de reserva insuficiente");
        this.quantity -= amount;
        this.reservedQuantity -= amount;
    }
    
    public int getAvailableQuantity() {
        return this.quantity - this.reservedQuantity;
    }
}
```

## Enum Patterns

```java
// Enum básico
public enum UserStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED,
    PENDING_ACTIVATION
}

// Enum com valores
public enum UserRole {
    ADMIN("Administrador", Set.of("READ", "WRITE", "DELETE", "MANAGE")),
    MANAGER("Gerente", Set.of("READ", "WRITE", "MANAGE")),
    USER("Usuário", Set.of("READ")),
    GUEST("Convidado", Set.of("READ_LIMITED"));
    
    private final String description;
    private final Set<String> permissions;
    
    UserRole(String description, Set<String> permissions) {
        this.description = description;
        this.permissions = permissions;
    }
    
    public String getDescription() {
        return description;
    }
    
    public Set<String> getPermissions() {
        return permissions;
    }
    
    public boolean hasPermission(String permission) {
        return permissions.contains(permission);
    }
}

// Enum com comportamento
public enum PaymentStatus {
    PENDING {
        @Override
        public boolean canProcess() {
            return true;
        }
        
        @Override
        public PaymentStatus nextStatus() {
            return PROCESSING;
        }
    },
    PROCESSING {
        @Override
        public boolean canProcess() {
            return false;
        }
        
        @Override
        public PaymentStatus nextStatus() {
            return COMPLETED;
        }
    },
    COMPLETED {
        @Override
        public boolean canProcess() {
            return false;
        }
        
        @Override
        public PaymentStatus nextStatus() {
            return this;
        }
    },
    FAILED {
        @Override
        public boolean canProcess() {
            return true;
        }
        
        @Override
        public PaymentStatus nextStatus() {
            return PROCESSING;
        }
    };
    
    public abstract boolean canProcess();
    public abstract PaymentStatus nextStatus();
}

// Enum com lookup por código
public enum OrderType {
    SALE("S", "Venda"),
    RETURN("R", "Devolução"),
    EXCHANGE("E", "Troca"),
    WARRANTY("W", "Garantia");
    
    private final String code;
    private final String description;
    
    private static final Map<String, OrderType> BY_CODE = Stream.of(values())
        .collect(Collectors.toMap(OrderType::getCode, Function.identity()));
    
    OrderType(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    public static OrderType fromCode(String code) {
        OrderType type = BY_CODE.get(code);
        if (type == null) {
            throw new IllegalArgumentException("Código de tipo de pedido inválido: " + code);
        }
        return type;
    }
}
```
