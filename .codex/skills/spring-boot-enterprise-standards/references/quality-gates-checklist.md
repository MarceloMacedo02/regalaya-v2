# Quality Gates Checklist - Spring Boot Enterprise

## Pre-Implementation Checklist

### Architecture
- [ ] Bounded Context identificado corretamente
- [ ] Não existe duplicação com componentes em `shared/`
- [ ] Separação de camadas respeitada (Controller -> Service -> Repository)
- [ ] Nenhuma lógica de negócio em Controllers
- [ ] Nenhum acesso direto a Repository de outro módulo

### Code Quality
- [ ] Regra dos 3 aplicada (só abstrai após 3 duplicações)
- [ ] YAGNI respeitado (não implementou para "o futuro")
- [ ] Fail Fast implementado (validações nas bordas)
- [ ] Logs adequados (nível apropriado, mensagens claras)
- [ ] Auditoria implementada quando necessária

## Code Review Checklist

### 1. Estrutura de Pacotes
```
✅ Correto:
src/main/java/br/com/plataforma/conexaodigital/
├── shared/
│   ├── config/
│   ├── domain/
│   ├── exception/
│   └── utils/
└── modulo/
    ├── controller/
    ├── dto/
    │   ├── requests/
    │   └── responses/
    ├── mapper/
    ├── services/
    │   ├── impl/
    │   └── service/
    ├── domain/
    │   └── model/
    ├── exception/
    ├── repository/
    └── infrastructure/

❌ Errado:
src/main/java/br/com/plataforma/conexaodigital/
├── config/  (deve estar em shared/)
├── controller/
├── model/   (deve estar em domain/model/)
├── service/
└── repository/
```

### 2. Injeção de Dependências
```java
// ✅ CORRETO - Injeção via Construtor
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
}

// ❌ ERRADO - @Autowired em campo
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}

// ❌ ERRADO - @Autowired no construtor (redundante)
@Service
public class UserService {
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### 3. DTOs (Devem ser Records)
```java
// ✅ CORRETO - Record com validação
public record CreateUserRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100)
    String name,
    
    @NotBlank(message = "Email é obrigatório")
    @Email
    String email
) {}

// ❌ ERRADO - Classe tradicional
@Data
public class CreateUserRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String email;
}
```

### 4. Entidades JPA
```java
// ✅ CORRETO - Anotações específicas, NÃO use @Data
@Entity
@Getter
@Setter
@ToString(exclude = {"orders"})
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, length = 100)
    private String name;
}

// ❌ ERRADO - @Data em entidade
@Data  // Gera problemas de performance e recursão
@Entity
public class User {
    @Id
    private UUID id;
}
```

### 5. Validações
```java
// ✅ CORRETO - Jakarta Validation
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// ❌ ERRADO - javax.validation (deprecado no Spring Boot 3)
import javax.validation.constraints.Email;
```

### 6. Configurações
```java
// ✅ CORRETO - @ConfigurationProperties
@Configuration
@ConfigurationProperties(prefix = "app.email")
@Getter
@Setter
public class EmailProperties {
    private String from;
    private String host;
    private int port;
    private boolean tls;
}

// ❌ ERRADO - @Value em várias propriedades
@Service
public class EmailService {
    @Value("${app.email.from}")
    private String from;
    
    @Value("${app.email.host}")
    private String host;
}
```

### 7. Exception Handling
```java
// ✅ CORRETO - Exception específica
public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(UUID id) {
        super("Usuário não encontrado com ID: " + id);
    }
}

// ❌ ERRADO - Exception genérica
throw new RuntimeException("User not found");

// ❌ ERRADO - Mensagem técnica
throw new BusinessException("SQL Error 0x345: Constraint violation on table USR_TBL");
```

### 8. Repository
```java
// ✅ CORRETO - Com Specification e projeções
@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT new com.example.UserProjection(u.id, u.name, u.email) FROM User u")
    List<UserProjection> findAllProjections();
}

// ❌ ERRADO - Métodos desnecessários
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Já existe no JpaRepository
    List<User> findAll();
    Optional<User> findById(UUID id);
    void deleteById(UUID id);
}
```

### 9. Tratamento de Null
```java
// ✅ CORRETO - Fail Fast
@Service
@RequiredArgsConstructor
public class UserService {
    
    public UserResponse findById(UUID id) {
        Assert.notNull(id, "ID não pode ser nulo");
        
        return userRepository.findById(id)
            .map(userMapper::toResponse)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}

// ✅ CORRETO - Optional
public void processUser(Optional<User> optionalUser) {
    optionalUser.ifPresent(user -> {
        // process
    });
}

// ❌ ERRADO - Null check excessivo
public void processUser(User user) {
    if (user != null) {
        if (user.getName() != null) {
            // process
        }
    }
}
```

### 10. Logging
```java
// ✅ CORRETO - Uso adequado de níveis
@Slf4j
@Service
public class OrderService {
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.debug("Iniciando criação de pedido para cliente: {}", request.customerId());
        log.info("Pedido criado com sucesso. ID: {}, Valor: {}", orderId, totalValue);
        log.warn("Estoque baixo para produto: {}", productId);
        log.error("Erro ao processar pagamento do pedido: {}", orderId, exception);
    }
}

// ❌ ERRADO - Concatenação de strings
log.info("Pedido " + orderId + " criado para cliente " + customerId);

// ❌ ERRADO - Nível inadequado
log.error("Iniciando processamento..."); // Deve ser debug
```

## Performance Checklist

### Database
- [ ] Nenhum Eager Loading sem justificativa
- [ ] Índices apropriados criados
- [ ] Queries N+1 identificadas e corrigidas (EntityGraph ou Fetch Join)
- [ ] Projeções usadas quando apenas poucos campos são necessários
- [ ] Paginação implementada para listagens
- [ ] Streaming considerado para grandes volumes

### JVM
- [ ] Virtual Threads ativadas (`spring.threads.virtual.enabled=true`)
- [ ] UUID v7 usado para IDs (time-ordered)
- [ ] ZGC configurado para produção
- [ ] Records usados para DTOs (menor overhead)
- [ ] `JsonInclude.Include.NON_NULL` configurado

## Security Checklist

- [ ] Validação de entrada em todos os endpoints
- [ ] Sanitização de dados sensíveis nos logs
- [ ] Autorização verificada em endpoints protegidos
- [ ] Senhas nunca logadas
- [ ] Dados sensíveis não expostos em DTOs de resposta
- [ ] HTTPS em produção
- [ ] Headers de segurança configurados

## Testing Checklist

- [ ] Testes unitários para lógica de negócio
- [ ] Testes de integração para repositories
- [ ] Testes de API para controllers (@WebMvcTest ou @SpringBootTest)
- [ ] Testes ArchUnit para validação de arquitetura
- [ ] Cobertura mínima de 80%
- [ ] Mocks utilizados adequadamente (@MockBean, @Mock)

## Documentation Checklist

- [ ] Swagger/OpenAPI anotado em todos os endpoints
- [ ] Descrições claras nos @Operation e @ApiResponse
- [ ] Exemplos de request/response quando necessário
- [ ] README atualizado se houver mudanças significativas

## Git Checklist

- [ ] Commits seguem Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`)
- [ ] Commits atômicos (um propósito por commit)
- [ ] Mensagens descritivas
- [ ] Branch nomeada corretamente (`feature/`, `fix/`, `refactor/`)

## Portas e Configurações Críticas

### ⚠️ PROIBIDO ALTERAR
```yaml
# NUNCA mude estas configurações sem aprovação arquitetural:
server:
  port: 8080  # Ou a porta padrão definida do projeto

spring:
  threads:
    virtual:
      enabled: true  # Sempre manter true
```

## Verificação Automática

Use ArchUnit para validar regras de arquitetura:

```java
@ArchTest
static final ArchRule controllers_should_not_access_repositories_directly = 
    noClasses()
        .that().resideInAPackage("..controller..")
        .should().accessClassesThat().resideInAPackage("..repository..");

@ArchTest
static final ArchRule services_should_not_depend_on_other_services = 
    noClasses()
        .that().resideInAPackage("..service..")
        .should().dependOnClassesThat()
        .resideInAPackage("..service..")
        .andShould().notBeAssignableTo(NotificationService.class);

@ArchTest
static final ArchRule dtos_should_be_records = 
    classes()
        .that().haveSimpleNameEndingWith("Request")
        .or().haveSimpleNameEndingWith("Response")
        .should().beRecords();

@ArchTest
static final ArchRule no_field_injection = 
    noFields()
        .should().beAnnotatedWith(Autowired.class);
```

## Métricas de Qualidade

- **Cobertura de Testes**: ≥ 80%
- **Complexidade Ciclomática**: ≤ 10 por método
- **Tamanho de Método**: ≤ 50 linhas
- **Tamanho de Classe**: ≤ 300 linhas
- **Número de Parâmetros**: ≤ 5 por método
- **Nesting Depth**: ≤ 3 níveis

## Exceptions e Códigos HTTP

| Cenário | Exception | HTTP Status |
|---------|-----------|-------------|
| Recurso não encontrado | `ResourceNotFoundException` | 404 |
| Dados inválidos | `ValidationException` | 400 |
| Conflito de dados | `ConflictException` | 409 |
| Acesso negado | `AccessDeniedException` | 403 |
| Não autenticado | `AuthenticationException` | 401 |
| Erro de negócio | `BusinessException` | 422 |
| Erro interno | `InternalErrorException` | 500 |
