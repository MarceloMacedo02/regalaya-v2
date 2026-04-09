---
name: spring-boot-enterprise-standards
description: This skill should be used when writing Java Spring Boot 3.x code, creating new features, implementing classes and methods, or reviewing code for enterprise applications. It provides architectural standards, coding patterns, quality gates, and anti-patterns based on Clean Architecture, Domain-Driven Design (DDD), and SOLID principles. Stack - Java 21, Spring Boot 3.4+, PostgreSQL, SpringDoc OpenAPI, Maven, Spring Data JPA.
---

# Spring Boot Enterprise Standards

## Overview

This skill enforces enterprise-grade coding standards for Spring Boot 3.x applications following Clean Architecture, DDD, and SOLID principles. It ensures consistency, maintainability, and scalability across all codebases.

## Architecture Philosophy & Principles

All code must be written with these pillars:

- **SOLID**: Single responsibility, open for extension/closed for modification, dependency inversion
- **DRY**: Avoid logic duplication. If logic repeats in 3 places, abstract it
- **YAGNI**: Don't implement "future-proof" features. Solve the current problem simply
- **TDD**: Write tests before implementation to ensure solid API contracts
- **Fail Fast**: Validate inputs and edge conditions immediately using `Assert.notNull()`, `jakarta.validation`

## Package Structure Standards (Taxonomia Modular)

Module isolation is the absolute priority to prevent "Big Ball of Mud":

```
src/main/java/br/com/plataforma/conexaodigital/
│
├── shared/                    # KERNEL COMPARTILHADO (Core imutável)
│   ├── config/               # Security, Swagger, Jackson Global
│   ├── domain/               # Value Objects e Base Entities globais
│   ├── exception/            # ProblemDetail handlers globais
│   └── utils/                # Helpers genéricos
│
└── [nome_do_modulo]/         # BOUNDED CONTEXT
    ├── controller/           # Spring REST Controllers
    ├── dto/                  # Pacotes para requests e responses
    │   ├── requests/         # Pacote
    │   └── responses/        # Pacote
    │
    ├── mapper/               # Pacote mapeamento com Lombok Builder
    │
    ├── services/             # APPLICATION LAYER
    │   ├── impl/             # Implementações de Service
    │   └── service/          # Interfaces de Domínio (@Service)
    │
    ├── domain/               # DOMAIN LAYER (Business Logic)
    │   └── model/            # Entidades JPA (@Entity)
    │
    ├── exception/            # Business Exceptions
    │
    ├── repository/           # Interfaces Spring Data JPA
    │
    ├── infrastructure/       # FRAMEWORKS & DRIVERS (Externo)
    │   ├── client/           # RestClient (SB 3.2+) ou Feign
    │   └── messaging/        # Spring Cloud Stream
    │
    └── utils/                # Helpers específicos do módulo
```

**NOTA CRÍTICA**: Nunca recrie métodos, classes, DTOs ou utilitários que já existem em `shared/utils` ou `shared/exceptions`. Verifique sempre antes de criar novos componentes.

## Quality Gates: Regras de Ouro

### Performance & Modernidade

- **Virtual Threads**: Ative via `spring.threads.virtual.enabled=true`
- **Records**: Padrão obrigatório para DTOs e Projeções (imutabilidade nativa)
- **UUID v7**: Padrão para ID primário (time-ordered para melhor performance de indexação PostgreSQL)
- **Lombok**: Use `@Data`, `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Slf4j`, `@Builder`
- **Entidades JPA**: Em entidades, NÃO use `@Data` (problemas de performance e recursão Hibernate). Use apenas: `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
- **Injeção via Construtor**: Única forma permitida. **PROIBIDO** `@Autowired` em campos
- **Porta Backend**: NUNCA mude as portas da aplicação

### DTOs com Records

```java
public record CreateUserRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    String name,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "Papel é obrigatório")
    @Size(min = 2, max = 50, message = "Papel deve ter entre 2 e 50 caracteres")
    String role
) {}
```

### Persistência & Configurações

- **Type-safe Config**: Use `@ConfigurationProperties` em vez de `@Value`
- **Jakarta Validation**: Use `jakarta.validation` (não `javax.validation`) para compatibilidade Spring Boot 3.x

### Gestão de Memória & JVM Tuning

- **Generational ZGC**: `-XX:+UseZGC -XX:+ZGenerational`
- **Projeções**: Nunca carregue `@Entity` completa se precisar apenas de 2-3 campos. Use **Projeções com Records**
- **Streaming**: Para processamento massivo, use `Stream<Entity>` ou `Slice`
- **Jackson**: Use `JsonInclude.Include.NON_NULL` para reduzir payload

## Isolamento do Monólito Modular

- **Comunicação**: Prefira `ApplicationEventPublisher` (assíncrono) para desacoplar módulos
- **Transactional Events**: Use `@TransactionalEventListener` para garantir que eventos só ocorram após commit
- **Chamadas Síncronas**: Apenas via Interfaces de `@Service`. **NUNCA** injete um Repository de outro módulo

## Design Patterns de Implementação

- **Strategy**: Use interfaces e `Map<Type, Strategy>` para eliminar blocos if/else ou switch
- **Specification**: Use `org.springframework.data.jpa.domain.Specification` para filtros dinâmicos reutilizáveis
- **State**: Use para entidades com ciclos de vida complexos (ex: Status de Pedido)
- **Exceptions Personalizadas**: SEMPRE use exceptions personalizadas com mensagens diretas, claras, sem jargões técnicos
- **Auditoria**: Todos os eventos devem ser registrados na auditoria usando funcionalidades existentes

## Anti-Patterns: O Que NÃO Fazer ❌

- **NUNCA use Eager Loading**: Causa problema N+1 e consumo massivo de memória. Use Join Fetch seletivamente
- **NUNCA ignore o Tracing**: Todas as requisições devem ter traceId propagado pelo Micrometer Tracing
- **Evite Exceptions Genéricos**: Nunca use exceptions genéricos
- **Não Duplique Código**: Verifique `shared/` antes de criar novos componentes
- **Não Mude Portas**: É uma ação criminosa e antiética
- **Não Use @Autowired em Campos**: Sempre use injeção via construtor
- **Não Use @Data em Entidades JPA**: Use anotações específicas
- **Não Implemente para o Futuro**: Siga YAGNI

## Observabilidade & Entrega

- **Actuator**: `/actuator/health` e `/actuator/prometheus`
- **Swagger/OpenAPI**:
  - Interface Swagger UI: `/swagger-ui.html`
  - Documentação OpenAPI 3.0: `/api-docs`
  - Configuração via `OpenApiConfig`
- **Structured Logging**: Logs em formato JSON para produção
- **ArchUnit**: Testes automatizados de arquitetura são **OBRIGATÓRIOS**
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`

## Quick Reference Templates

### Entidade JPA Padrão

```java
@Entity
@Table(name = "users")
@Getter
@Setter
@ToString(exclude = {"sensitiveField"})
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### Service Interface + Implementação

```java
// Interface
public interface UserService {
    UserResponse createUser(CreateUserRequest request);
    UserResponse findById(UUID id);
    Page<UserResponse> findAll(Pageable pageable);
}

// Implementação
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating user with email: {}", request.email());
        
        // Fail Fast
        Assert.notNull(request, "Request cannot be null");
        
        // Business Logic
        var user = userMapper.toEntity(request);
        var saved = userRepository.save(user);
        
        return userMapper.toResponse(saved);
    }
}
```

### Controller REST

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management operations")
public class UserController {
    
    private final UserService userService;
    
    @PostMapping
    @Operation(summary = "Create new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<UserResponse> create(
            @Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(userService.createUser(request));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Find user by ID")
    public ResponseEntity<UserResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findById(id));
    }
}
```

### Exception Handler Global

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {}", ex.getMessage());
        
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Business Error");
        problem.setDetail(ex.getMessage());
        
        return problem;
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationException(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation Error");
        
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));
        
        problem.setProperty("errors", errors);
        return problem;
    }
}
```

### Repository com Specification

```java
@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    // Projeção com Record
    @Query("SELECT new com.example.UserProjection(u.id, u.name, u.email) FROM User u WHERE u.status = :status")
    List<UserProjection> findProjectionsByStatus(UserStatus status);
}

// Specification
public class UserSpecifications {
    public static Specification<User> hasNameLike(String name) {
        return (root, query, cb) -> 
            name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
    
    public static Specification<User> hasStatus(UserStatus status) {
        return (root, query, cb) -> 
            status == null ? null : cb.equal(root.get("status"), status);
    }
}
```

## Resources

### references/
- `architecture-patterns.md` - Padrões de arquitetura detalhados (Strategy, Specification, State)
- `quality-gates-checklist.md` - Checklist completo de quality gates
- `entity-templates.md` - Templates específicos para diferentes tipos de entidades
- `testing-standards.md` - Padrões de testes (Unit, Integration, ArchUnit)
- `swagger-config-template.md` - Configuração completa do SpringDoc OpenAPI

### assets/
- `boilerplate/` - Templates de classes boilerplate prontos para copiar

## References

Para detalhes específicos, consulte:
- `references/architecture-patterns.md` - Padrões de design e arquitetura
- `references/quality-gates-checklist.md` - Checklist de validação de código
- `references/entity-templates.md` - Templates para entidades JPA
- `references/testing-standards.md` - Padrões de testes automatizados
- `references/swagger-config-template.md` - Configuração Swagger/OpenAPI
