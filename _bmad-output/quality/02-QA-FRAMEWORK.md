# QUALITY ASSURANCE (QA) - FRAMEWORK DE TESTES

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Vigente  
**Artefato:** QA - Quality Assurance  
**Aplicável a:** Backend (Java/Spring) e Frontend (TypeScript/Next.js)  

---

## 1. VISÃO GERAL DA ESTRATÉGIA DE TESTES

### 1.1 Pirâmide de Testes

```
                            ┌─────────────────┐
                            │                 │
                            │   E2E / UI      │  ← 10% (Playwright)
                            │                 │
                    ┌───────┴─────────────────┴───────┐
                    │                               │
                    │      Integração / API         │  ← 30% (Supertest)
                    │                               │
            ┌───────┴───────────────────────────────┴───────┐
            │                                               │
            │              Unitários                        │  ← 60% (JUnit, Vitest)
            │                                               │
            └───────────────────────────────────────────────┘
```

### 1.2 Objetivos de Cobertura

| Nível | Cobertura Mínima | Cobertura Alvo |
|-------|-------------------|-----------------|
| Unitário | 70% | 80% |
| Integração | 50% | 70% |
| E2E | Critical paths | All paths |

---

## 2. BACKEND - TESTES JAVA/SPRING

### 2.1 Estrutura de Testes

```
src/test/java/br/com/regalaya/
├── auth/
│   ├── service/
│   │   └── AuthServiceTest.java
│   ├── controller/
│   │   └── AuthControllerTest.java
│   └── integration/
│       └── AuthIntegrationTest.java
├── product/
│   ├── service/
│   ├── controller/
│   └── integration/
└── ...
```

### 2.2 Testes Unitários - Service

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("should return product when exists")
    void shouldReturnProductWhenExists() {
        // Given
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .id(productId)
                .name("Test Product")
                .price(BigDecimal.valueOf(99.90))
                .build();
        
        ProductResponse response = ProductResponse.builder()
                .id(productId)
                .name("Test Product")
                .price(BigDecimal.valueOf(99.90))
                .build();

        when(productRepository.findById(productId))
                .thenReturn(Optional.of(product));
        when(productMapper.toResponse(product))
                .thenReturn(response);

        // When
        ProductResponse result = productService.findById(productId);

        // Then
        assertThat(result.getId()).isEqualTo(productId);
        assertThat(result.getName()).isEqualTo("Test Product");
        verify(productRepository).findById(productId);
    }

    @Test
    @DisplayName("should throw exception when product not found")
    void shouldThrowExceptionWhenProductNotFound() {
        // Given
        UUID productId = UUID.randomUUID();
        when(productRepository.findById(productId))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> productService.findById(productId))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining(productId.toString());
    }

    @Test
    @DisplayName("should create product successfully")
    void shouldCreateProductSuccessfully() {
        // Given
        CreateProductRequest request = new CreateProductRequest(
                "Test",
                "test",
                "Description",
                BigDecimal.valueOf(99.90),
                UUID.randomUUID(),
                List.of("image1.jpg")
        );

        Category category = Category.builder()
                .id(request.categoryId())
                .name("Category")
                .build();

        Product product = Product.builder()
                .name(request.name())
                .slug(request.slug())
                .build();

        Product savedProduct = Product.builder()
                .id(UUID.randomUUID())
                .name(request.name())
                .build();

        ProductResponse expectedResponse = ProductResponse.builder()
                .id(savedProduct.getId())
                .name(request.name())
                .build();

        when(productRepository.existsBySlug(request.slug())).thenReturn(false);
        when(categoryRepository.findById(request.categoryId()))
                .thenReturn(Optional.of(category));
        when(productMapper.toEntity(request, category)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(savedProduct);
        when(productMapper.toResponse(savedProduct)).thenReturn(expectedResponse);

        // When
        ProductResponse result = productService.create(request);

        // Then
        assertThat(result.getName()).isEqualTo(request.name());
        verify(productRepository).save(product);
    }
}
```

### 2.3 Testes de Integração - Controller

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    @DisplayName("GET /api/v1/products - should return paginated products")
    void shouldReturnPaginatedProducts() throws Exception {
        // Given
        for (int i = 0; i < 15; i++) {
            createTestProduct("Product " + i);
        }

        // When/Then
        mockMvc.perform(get("/api/v1/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.totalElements").value(15))
                .andExpect(jsonPath("$.totalPages").value(2));
    }

    @Test
    @DisplayName("GET /api/v1/products/{id} - should return product when exists")
    void shouldReturnProductWhenExists() throws Exception {
        // Given
        Product product = createTestProduct("Test Product");

        // When/Then
        mockMvc.perform(get("/api/v1/products/{id}", product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId().toString()))
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    @DisplayName("POST /api/v1/products - should create product")
    @WithMockUser(roles = "ADMIN")
    void shouldCreateProduct() throws Exception {
        // Given
        CreateProductRequest request = new CreateProductRequest(
                "New Product",
                "new-product",
                "Description",
                BigDecimal.valueOf(99.90),
                null,
                List.of("image.jpg")
        );

        // When/Then
        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Product"))
                .andExpect(jsonPath("$.slug").value("new-product"));
    }

    @Test
    @DisplayName("POST /api/v1/products - should return 400 for invalid data")
    @WithMockUser(roles = "ADMIN")
    void shouldReturn400ForInvalidData() throws Exception {
        // Given
        CreateProductRequest request = new CreateProductRequest(
                "",  // name vazio
                null, // slug null
                null,
                null,
                null,
                null
        );

        // When/Then
        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    private Product createTestProduct(String name) {
        return productRepository.save(Product.builder()
                .name(name)
                .slug(name.toLowerCase().replace(" ", "-"))
                .price(BigDecimal.valueOf(99.90))
                .category(createTestCategory())
                .isActive(true)
                .build());
    }

    private Category createTestCategory() {
        return categoryRepository.save(Category.builder()
                .name("Test Category")
                .slug("test-category")
                .build());
    }
}
```

### 2.4 Testcontainers para Integração

```java
@Testcontainers
@SpringBootTest
class DatabaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}
```

---

## 3. FRONTEND - TESTES TYPESCRIPT/NEXT.JS

### 3.1 Estrutura de Testes

```
src/
├── __tests__/
│   ├── components/
│   │   ├── product-card.test.tsx
│   │   └── checkout-form.test.tsx
│   ├── hooks/
│   │   └── use-auth.test.ts
│   ├── services/
│   │   └── products.service.test.ts
│   └── pages/
│       └── products.test.tsx
├── components/
│   └── product-card/
│       ├── ProductCard.tsx
│       └── ProductCard.test.tsx
└── ...
```

### 3.2 Testes de Componente (Vitest + Testing Library)

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: '1',
  name: 'Caixa de Bombons Belga',
  slug: 'caixa-bombons-belga',
  price: 89.90,
  images: ['/chocolate.jpg'],
  category: 'Chocolates',
  stock: 10,
  isActive: true,
}

describe('ProductCard', () => {
  const onAddToCart = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    expect(screen.getByText('Caixa de Bombons Belga')).toBeInTheDocument()
    expect(screen.getByText('R$ 89,90')).toBeInTheDocument()
    expect(screen.getByAltText('Caixa de Bombons Belga')).toBeInTheDocument()
  })

  it('should call onAddToCart when add button is clicked', async () => {
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i })
    fireEvent.click(addButton)

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id)
  })

  it('should show out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} onAddToCart={onAddToCart} />)

    expect(screen.getByText(/esgotado/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /adicionar ao carrinho/i }))
        .toBeDisabled()
  })

  it('should show discount badge when compareAtPrice exists', () => {
    const productWithDiscount = {
      ...mockProduct,
      compareAtPrice: 109.90,
    }
    render(<ProductCard product={productWithDiscount} onAddToCart={onAddToCart} />)

    expect(screen.getByText(/-18%/i)).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)
    expect(container).toMatchSnapshot()
  })
})
```

### 3.3 Testes de Hook (React Query)

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { useProducts } from './useProducts'
import { productsService } from '@/services/products.service'

vi.mock('@/services/products.service')

describe('useProducts', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('should return products on successful fetch', async () => {
    const mockProducts = {
      items: [
        { id: '1', name: 'Product 1', price: 99.90 },
        { id: '2', name: 'Product 2', price: 149.90 },
      ],
      total: 2,
    }

    vi.mocked(productsService.getAll).mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockProducts)
    expect(result.current.data?.items).toHaveLength(2)
  })

  it('should return error on failure', async () => {
    vi.mocked(productsService.getAll).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useProducts(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })

  it('should refetch when category changes', async () => {
    vi.mocked(productsService.getAll).mockResolvedValue({ items: [], total: 0 })

    const { result, rerender } = renderHook(
      ({ categoryId }: { categoryId?: string }) => useProducts(categoryId),
      { wrapper }
    )

    await waitFor(() => !result.current.isLoading)

    rerender({ categoryId: 'category-1' })

    expect(productsService.getAll).toHaveBeenCalledTimes(2)
    expect(productsService.getAll).toHaveBeenLastCalledWith(
      expect.objectContaining({ categoryId: 'category-1' })
    )
  })
})
```

### 3.4 Testes E2E com Playwright

```typescript
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('text=Fazer login')
  })

  test('should complete full checkout flow', async ({ page }) => {
    // 1. Login
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('text=Entrar')
    await expect(page.locator('text=Bem-vindo')).toBeVisible()

    // 2. Browse products
    await page.click('text=Produtos')
    await expect(page.locator('.product-card')).toHaveCount(10)

    // 3. Add to cart
    await page.click('.product-card >> nth=0 >> text=Adicionar')
    await expect(page.locator('.cart-badge')).toContainText('1')

    // 4. Go to cart
    await page.click('.cart-icon')
    await expect(page.locator('.cart-item')).toHaveCount(1)

    // 5. Proceed to checkout
    await page.click('text=Finalizar compra')
    await expect(page.locator('.checkout-step')).toHaveCount(3)

    // 6. Fill address
    await page.fill('[name="zipCode"]', '01310-100')
    await page.fill('[name="street"]', 'Av. Paulista')
    await page.fill('[name="number"]', '1000')
    await page.click('text=Continuar')

    // 7. Select shipping
    await page.click('text=SEDEX')
    await page.click('text=Continuar')

    // 8. Pay with PIX
    await page.click('text=Pagar com PIX')
    await expect(page.locator('.qr-code')).toBeVisible()

    // 9. Complete payment (mock)
    await page.click('text=Simular pagamento')
    await expect(page.locator('.order-success')).toBeVisible()
    await expect(page.locator('.order-number')).toBeVisible()
  })

  test('should validate empty cart', async ({ page }) => {
    await page.click('.cart-icon')
    await page.click('text=Finalizar compra')
    await expect(page.locator('.empty-cart-message')).toBeVisible()
  })

  test('should persist cart after refresh', async ({ page }) => {
    await page.goto('/products')
    await page.click('.product-card >> nth=0 >> text=Adicionar')
    
    await page.reload()
    await page.click('.cart-icon')
    
    await expect(page.locator('.cart-item')).toHaveCount(1)
  })
})

test.describe('Admin - Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('[name="email"]', 'admin@regalaya.com.br')
    await page.fill('[name="password"]', 'admin123')
    await page.click('text=Entrar')
    await page.goto('/admin/products')
  })

  test('should create new product', async ({ page }) => {
    await page.click('text=Novo Produto')
    
    await page.fill('[name="name"]', 'Novo Produto Teste')
    await page.fill('[name="slug"]', 'novo-produto-teste')
    await page.fill('[name="price"]', '99.90')
    await page.fill('[name="description"]', 'Descrição do produto')
    
    await page.click('text=Salvar')
    
    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.product-row').last()).toContainText('Novo Produto Teste')
  })

  test('should validate required fields', async ({ page }) => {
    await page.click('text=Novo Produto')
    await page.click('text=Salvar')
    
    await expect(page.locator('[name="name"] + .error')).toContainText('Obrigatório')
    await expect(page.locator('[name="price"] + .error')).toContainText('Obrigatório')
  })
})
```

---

## 4. MATRIZ DE RASTREABILIDADE DE TESTES

### 4.1 Testes vs Épicos

| Épico | Testes Unitários | Testes Integração | Testes E2E | Status |
|-------|-------------------|------------------|------------|--------|
| ÉPICO 01 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 02 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 03 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 04 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 05 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 06 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 07 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 08 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 09 | ✅ | ✅ | ⚠️ | Em progresso |
| ÉPICO 10 | ✅ | ⚠️ | ⚠️ | Em progresso |
| ÉPICO 11 | ✅ | ✅ | ✅ | Completo |
| ÉPICO 12 | ✅ | ✅ | ✅ | Completo |

### 4.2 Testes vs Critérios de Aceite

| História | Critério de Aceite | Teste | Status |
|----------|-------------------|-------|--------|
| HU-02.1 | Usuário consegue se registrar | E2E-001 | ✅ |
| HU-02.2 | Login com JWT funciona | E2E-002 | ✅ |
| HU-04.1 | Catálogo com 50-100 produtos | INT-001 | ✅ |
| HU-06.1 | Checkout em 3 passos | E2E-003 | ✅ |
| HU-06.2 | Pagamento PIX funciona | E2E-004 | ✅ |
| HU-09.1 | Notificação 7 dias antes | INT-002 | ✅ |
| HU-10.1 | 3-5 recomendações IA | INT-003 | ⚠️ |

---

## 5. RELATÓRIOS E MONITORAMENTO

### 5.1 Dashboard de Qualidade

| Métrica | Sprint Atual | Sprint Anterior | Meta |
|---------|-------------|----------------|------|
| Coverage Backend | 72% | 68% | 70% |
| Coverage Frontend | 65% | 60% | 70% |
| Testes Passando | 342/342 | 320/325 | 100% |
| Flaky Tests | 2 | 5 | 0 |
| Slow Tests | 8 | 12 | < 5 |

### 5.2 Relatório Semanal

```
=== QUALITY REPORT - Semana 14 ===

📊 COBERTURA
├── Backend: 72% (↑4%)
└── Frontend: 65% (↑5%)

🧪 TESTES
├── Unitários: 245 (100% passing)
├── Integração: 67 (100% passing)
└── E2E: 30 (↑5 novos)

⚠️ ISSUES
├── Bugs Abertos: 3 (↓2)
├── Divergências: 0
└── Débitos Técnicos: 12h (↓4h)

🎯 QUALIDADE
├── SonarQube: A
├── Security Scan: Pass
└── Performance: Pass

📅 PRÓXIMAS AÇÕES
1. Aumentar cobertura frontend para 70%
2. Corrigir 2 flaky tests
3. Adicionar testes para ÉPICO 10
```

---

**Documento criado:** 07 de abril de 2026  
**Versão:** 1.0  
**Status:** Vigente
