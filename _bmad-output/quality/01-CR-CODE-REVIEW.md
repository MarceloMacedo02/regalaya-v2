# CODE REVIEW (CR) - PADRÕES E CHECKLIST

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Vigente  
**Artefato:** CR - Code Review  
**Aplicável a:** Backend (Java/Spring) e Frontend (TypeScript/Next.js)  

---

## 1. OBJETIVO

Este documento estabelece os padrões e critérios para Code Review no projeto Regalaya, garantindo consistência de código, segurança e qualidade técnica.

---

## 2. REGRAS GERAIS

### 2.1 Processo de Code Review

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE CODE REVIEW                             │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Desenvol-│         │   Pull   │         │   Code   │         │   Merge  │
│ vedor    │────────▶│ Request  │────────▶│ Review   │────────▶│  (PR)    │
│          │         │  (PR)    │         │          │         │          │
└──────────┘         └──────────┘         └──────────┘         └──────────┘
                           │                    │
                           │                    ▼
                           │              ┌──────────────┐
                           │              │ Revisor      │
                           │              │ 1. Funcional │
                           │              │ 2. Estilo    │
                           │              │ 3. Segurança  │
                           │              │ 4. Tests     │
                           │              └──────────────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────────────────────┐
                    │         CI/CD Pipeline          │
                    │  • Lint                       │
                    │  • Tests                      │
                    │  • Build                     │
                    │  • Coverage                  │
                    └──────────────────────────────┘
```

### 2.2 Critérios para Merge

| Critério | Limite | Status |
|----------|--------|--------|
| Approvals | Mínimo 1 | Obrigatório |
| CI Status | Todos verdes | Obrigatório |
| Coverage | > 70% | Obrigatório |
| Lint Errors | 0 | Obrigatório |
| Security Scan | 0 Critical/High | Obrigatório |

---

## 3. BACKEND (JAVA/SPRING BOOT)

### 3.1 Padrões de Código

#### Nomenclatura

| Elemento | Padrão | Exemplo |
|----------|--------|---------|
| Classe | PascalCase | `ProductServiceImpl` |
| Interface | PascalCase + sufixo Service | `ProductService` |
| Método | camelCase | `findById()` |
| Variável | camelCase | `productRepository` |
| Constante | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Package | lowercase | `br.com.regalaya.product` |

#### Estrutura de Classe

```java
// ✅ CORRETO
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    // 1. Dependências (final)
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // 2. Construtor
    public ProductServiceImpl(ProductRepository productRepository,
                            ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    // 3. Métodos públicos (override primeiro)
    @Override
    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        // implementação
    }

    // 4. Métodos privados
    private void validateProduct(Product product) {
        // implementação
    }
}
```

#### Anotações Obrigatórias

| Anotação | Uso | Verificação |
|----------|-----|-------------|
| `@Service` | Classes de serviço | ✅ Obrigatório |
| `@Repository` | Classes de repositório | ✅ Obrigatório |
| `@Controller`/`@RestController` | Controllers | ✅ Obrigatório |
| `@Transactional` | Modificações de estado | ✅ Obrigatório |
| `@Transactional(readOnly = true)` | Leituras | ✅ Recomendado |
| `@Valid` | Validação de input | ✅ Obrigatório |
| `@NotNull`, `@NotBlank`, etc. | Validação de campos | ✅ Obrigatório |

### 3.2 Checklist de Code Review - Backend

#### Estrutura e Arquitetura
- [ ] Camada adequada (Controller → Service → Repository)
- [ ] Sem lógica de negócio em Controllers
- [ ] DTOs utilizados para entrada/saída
- [ ] Mappers para conversão de entidades
- [ ] Exceptions customizadas para erros de negócio

#### Segurança
- [ ] `@PreAuthorize` onde necessário
- [ ] Validação de input (`@Valid`, `@NotNull`)
- [ ] Sem SQL concatenado (usar JPQL/named queries)
- [ ] Sem dados sensíveis em logs
- [ ] Sem secrets hardcoded

#### Performance
- [ ] `@Transactional(readOnly = true)` em queries de leitura
- [ ] Paginação em listas (`Page<T>`)
- [ ] Uso de cache (`@Cacheable`) onde apropriado
- [ ] Índices de banco considerados

#### Testes
- [ ] Testes unitários para Services
- [ ] Testes de integração para Controllers
- [ ] Cobertura > 70%
- [ ] Nomes descritivos de testes (`should_return_product_when_exists`)

#### Documentação
- [ ] JavaDoc em classes e métodos públicos
- [ ] OpenAPI annotations em Controllers
- [ ] README atualizado se necessário

### 3.3 Anti-Patterns Proibidos

```java
// ❌ NÃO FAZER - SQL Injection
@Query("SELECT p FROM Product p WHERE p.name = '" + name + "'")

// ❌ NÃO FAZER - Lógica de negócio em Controller
@PostMapping
public ResponseEntity create(@RequestBody Product p) {
    if (p.getPrice() < 0) throw new Exception(); // Lógica em service!
}

// ❌ NÃO FAZER - Sem validação
public void save(Product product) {
    repository.save(product); // Falta @Valid
}

// ❌ NÃO FAZER - Campos nullable sem especificação
public ProductResponse findById(UUID id) {
    return repository.findById(id).orElse(null); // NullPointerException!
}

// ❌ NÃO FAZER - Logs com dados sensíveis
log.info("User {} logged in with password {}", username, password);
```

---

## 4. FRONTEND (TYPESCRIPT/NEXT.JS)

### 4.1 Padrões de Código

#### Nomenclatura

| Elemento | Padrão | Exemplo |
|----------|--------|---------|
| Componente | PascalCase | `ProductCard.tsx` |
| Hook | camelCase + prefixo use | `useAuth.ts` |
| Service | camelCase + sufixo Service | `products.service.ts` |
| Type/Interface | PascalCase | `ProductResponse` |
| Constante | UPPER_SNAKE_CASE | `API_ENDPOINTS` |
| Variável | camelCase | `isLoading` |
| CSS Classes | kebab-case | `product-card` |

#### Estrutura de Componente

```tsx
// ✅ CORRETO
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/products.service'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/types'

interface ProductListProps {
  categoryId?: string
}

export function ProductList({ categoryId }: ProductListProps) {
  const [page, setPage] = useState(1)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', categoryId, page],
    queryFn: () => productsService.getAll({ categoryId, page }),
  })

  if (isLoading) return <ProductListSkeleton />
  if (error) return <ErrorState message={(error as Error).message} />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data?.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 4.2 Checklist de Code Review - Frontend

#### Estrutura e Componentes
- [ ] Componentes funcionais (sem class components)
- [ ] Hooks para lógica reutilizável
- [ ] Tipos TypeScript definidos
- [ ] Sem `any` (usar `unknown` se necessário)
- [ ] Componentes atômicos reutilizáveis

#### Performance
- [ ] `useMemo` para cálculos pesados
- [ ] `useCallback` para callbacks em props
- [ ] `React.memo` para componentes puros
- [ ] Lazy loading com `next/dynamic`
- [ ] Images otimizadas com `next/image`

#### Estado e Data Fetching
- [ ] React Query/SWR para server state
- [ ] Zustand para client state
- [ ] Loading states implementados
- [ ] Error states implementados
- [ ] Empty states implementados

#### Segurança
- [ ] Sanitização de input
- [ ] Sem dados sensíveis no código
- [ ] Validação de formulários (React Hook Form + Zod)
- [ ] Autenticação em client (verificar tokens)

#### Testes
- [ ] Testes de componentes
- [ ] Testes de hooks
- [ ] Testes E2E com Playwright
- [ ] Cobertura > 70%

#### Acessibilidade
- [ ] Semantic HTML (`<button>`, `<nav>`, etc.)
- [ ] ARIA labels onde necessário
- [ ] Keyboard navigation
- [ ] Color contrast adequado

### 4.3 Anti-Patterns Proibidos

```tsx
// ❌ NÃO FAZER - useEffect com dependências erradas
useEffect(() => {
  fetchData()
}, []) // Faltam dependências!

// ❌ NÃO FAZER - Estados duplicados
const [loading, setLoading] = useState(true)
const [isLoading, setIsLoading] = useState(true) // Duplicado!

// ❌ NÃO FAZER - any
function handleData(data: any) { // Usar unknown

// ❌ NÃO FAZER - CSS inline em loops
items.map(item => <div style={{ color: 'red' }}>) // Usar classe

// ❌ NÃO FAZER - console.log em produção
console.log('Debug:', data) // Remover ou usar logger
```

---

## 5. CHECKLIST DE REVISÃO PARA PR

### 5.1 Antes de Criar PR

- [ ] Branch está atualizado com main/develop
- [ ] Testes estão passando localmente
- [ ] Lint está sem erros
- [ ] Build compila sem erros
- [ ] Commits estão limpos e descritivos
- [ ] PR description está preenchida

### 5.2 Como Revisor

#### Revisão Funcional
- [ ] A lógica implementa o que foi pedido?
- [ ] Os critérios de aceite estão satisfeitos?
- [ ] Casos de borda estão tratados?
- [ ] Edge cases estão considerados?
- [ ] A solução é a mais simples possível?

#### Revisão de Segurança
- [ ] Validação de input?
- [ ] Autorização adequada?
- [ ] Sem SQL/command injection?
- [ ] Sem secrets expostos?
- [ ] Logs seguros?

#### Revisão de Performance
- [ ] Queries otimizadas?
- [ ] Paginação onde necessário?
- [ ] Cache onde apropriado?
- [ ] Lazy loading onde apropriado?
- [ ] Sem N+1 queries?

#### Revisão de Manutenibilidade
- [ ] Código legível?
- [ ] Nomes descritivos?
- [ ] Sem duplicação?
- [ ] DRY (Don't Repeat Yourself)?
- [ ] Documentação atualizada?

### 5.3 Comentários de Code Review

#### Formato de Comentário

```
[TIPO] Descrição breve

Explicação mais detalhada do problema ou sugestão.

Sugestão de mudança (se aplicável):
```typescript
// Código sugerido
const example = 'suggested';
```
```

#### Tipos de Comentário

| Prefixo | Significado | Ação Necessária |
|---------|-------------|-----------------|
| `[BLOCKER]` | Impede merge | Obrigatório corrigir |
| `[REQUIRED]` | Problema real | Corrigir antes de merge |
| `[SUGGESTION]` | Melhoria opcional | Considere aplicar |
| `[QUESTION]` | Dúvida | Responda ou justifique |
| `[NIT]` | Detalhe mínimo | Opcional corrigir |

---

## 6. GATES DE QUALIDADE

### 6.1 CI/CD Pipeline

```yaml
# GitHub Actions - Quality Gates
name: Quality Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run ESLint
        run: npm run lint
      - name: Run Checkstyle
        run: mvn checkstyle:check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: npm run test:ci
      - name: Check Coverage
        run: npm run test:coverage

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Security Scan
        run: npm run security:scan
```

### 6.2 Métricas de Qualidade

| Métrica | Target | Blocker |
|---------|--------|---------|
| Coverage | > 70% | < 50% |
| Lint Errors | 0 | > 10 |
| Security Issues | 0 Critical | > 0 |
| Complexity | < 15 | > 30 |

---

## 7. AUTORIAIS

### 7.1 Regras de Commit

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas

**Exemplo:**
```
feat(products): add search by name filter

Implemented search functionality in product listing
with debounce to reduce API calls.

Closes #123
```

---

**Documento criado:** 07 de abril de 2026  
**Versão:** 1.0  
**Status:** Vigente
