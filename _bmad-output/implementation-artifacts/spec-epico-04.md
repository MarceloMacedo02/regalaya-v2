---
title: 'EPICO 04 - Catálogo de Produtos'
type: 'feature'
created: '2026-04-07'
status: 'done'
context:
  - docs/PRD.md
  - docs/EPICS.md
  - _bmad-output/bmm/3-solutioning/01-CA-ARQUITETURA-TECNICA.md
baseline_commit: HEAD
---

## Intent

**Problem:** Usuários precisam navegar, buscar e descobrir produtos no catálogo. Admins precisam gerenciar produtos e categorias.

**Approach:** Catálogo público com filtros, paginação e busca + painel admin para CRUD de produtos e categorias.

## Boundaries & Constraints

**Always:**
- Seguir padrões existentes do projeto
- Frontend reutilizar componentes UI existentes
- Backend usar JPA Specification para queries dinâmicas
- SSR para página de detalhes do produto (SEO)

**Never:**
- Não usar mock data - sempre usar API real
- Não expor dados sensíveis nos logs

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| LIST_PRODUCTS | page, size, filters, sort | Page<ProductResponse> | Empty page se nenhum match |
| PRODUCT_DETAIL | slug | ProductDetailResponse | 404 se não existe |
| SEARCH_PRODUCTS | query | List<ProductResponse> | Empty list se nenhum match |
| SUGGESTIONS | query (min 2 chars) | List<ProductResponse> (max 5) | Empty list se nenhum match |
| CREATE_PRODUCT | valid data | ProductResponse, 201 | 400 se dados inválidos |
| UPDATE_PRODUCT | id, valid data | ProductResponse, 200 | 404 se não existe |
| DELETE_PRODUCT | id | 204 | 404 se não existe |
| CREATE_CATEGORY | valid data | CategoryResponse, 201 | 400 se slug duplicado |
| UPDATE_CATEGORY | id, valid data | CategoryResponse, 200 | 404 se não existe |
| DELETE_CATEGORY | id | 204 | 400 se tem produtos vinculados |

## Code Map

### Backend (já existente + adicionado)
- `product/` - CRUD completo + endpoint de sugestões ✅
- `category/` - CRUD completo ✅
- `ProductRepository.java` - Adicionado `findSuggestions()` ✅
- `ProductService.java` - Adicionado `getSuggestions()` ✅
- `ProductServiceImpl.java` - Implementado `getSuggestions()` ✅
- `ProductController.java` - Adicionado `GET /suggestions` ✅

### Frontend (conectado à API real)
- `src/app/(web)/products/page.tsx` - Conectado à API real ✅
- `src/app/(web)/products/[slug]/page.tsx` - SSR com fetch real ✅
- `src/app/admin/products/page.tsx` - Conectado à API real ✅
- `src/app/admin/categories/page.tsx` - Conectado à API real ✅
- `src/services/products.service.ts` - Adicionados métodos de categoria e sugestões ✅

## Tasks & Acceptance

### HU-04.1: Listagem de Produtos ✅
- [x] GET /products com paginação -- Backend ✅
- [x] Filtros: categoria, preço, disponibilidade -- Backend ✅
- [x] Ordenação: preço, nome -- Backend ✅
- [x] Página de catálogo com grid responsivo -- Frontend ✅
- [x] Skeleton loading -- Frontend ✅
- [x] Contador de resultados -- Frontend ✅
- [x] REMOVE-MOCK: Substituir mock-products por API real -- Frontend ✅

### HU-04.2: Detalhes do Produto ✅
- [x] GET /products/{id} -- Backend ✅
- [x] GET /products/slug/{slug} -- Backend ✅
- [x] Imagens múltiplas -- Backend ✅
- [x] Página de detalhes com SSR -- Frontend ✅
- [x] Galeria de imagens (carousel) -- Frontend ✅
- [x] Produtos relacionados -- Frontend ✅
- [x] REMOVE-MOCK: Dados reais da API -- Frontend ✅

### HU-04.3: Gestão de Categorias (Admin) ✅
- [x] CRUD completo de categories -- Backend ✅
- [x] Hierarquia de categorias (parent_id) -- Backend ✅
- [x] GET /categories (lista) -- Backend ✅
- [x] POST/PUT/DELETE /categories -- Backend ✅
- [x] Página de gestão de categorias -- Frontend ✅
- [x] Modal de criação/edição -- Frontend ✅
- [x] Confirmação de exclusão -- Frontend ✅

### HU-04.4: Gestão de Produtos (Admin) ✅
- [x] CRUD completo de products -- Backend ✅
- [x] Campos: name, description, price, category_id, images, stock -- Backend ✅
- [x] Dashboard de produtos com stats -- Frontend ✅
- [x] Tabela com paginação e filtros -- Frontend ✅
- [x] Formulário de criação/edição -- Frontend ✅
- [x] Upload de múltiplas imagens -- Frontend ✅
- [x] Preview do produto -- Frontend ✅

### HU-04.5: Busca de Produtos ✅
- [x] GET /products/search?q= -- Backend ✅
- [x] GET /products/suggestions?q= (autocomplete) -- Backend ✅
- [x] ILIKE para busca por nome -- Backend ✅
- [x] Barra de busca com debounce -- Frontend (via FilterSidebar) ✅
- [x] Página de resultados -- Frontend ✅

## Verification

```bash
# Backend
cd regalaya-api && mvn clean compile

# Frontend
cd regalaya-web && npx tsc --noEmit
```

## Design Notes

### Gap Analysis

O Épico 04 já tinha ~90% do backend implementado. O principal gap era o frontend usando mock-data.

**O que foi feito:**
1. Adicionado endpoint de sugestões (autocomplete) no backend
2. Conectado `/products` à API real (substituiu mock)
3. Conectado `/products/[slug]` à API real com SSR
4. Conectado `/admin/products` à API real
5. Conectado `/admin/categories` à API real
6. Adicionados métodos de categoria ao products.service.ts
