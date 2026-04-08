---
title: 'HU-04.1 - Listagem de Produtos'
type: 'story'
epic: 'EPICO 04 - Catálogo de Produtos'
status: 'backlog'
priority: 'P0'
points: 13
created: '2026-04-07'
---

## HU-04.1: Listagem de Produtos

**Como** visitante, **quero** ver o catálogo de produtos, **para** descobrir presentes.

---

## Acceptance Criteria

1. Usuário acessa `/products` e vê grid de produtos com paginação
2. Filtros laterais funcionam: categoria, faixa de preço, disponibilidade
3. Ordenação funciona: preço (asc/desc), nome (A-Z, Z-A), popularidade
4. Skeleton loading exibido durante carregamento
5. Contador de resultados visível
6. Grid responsivo: 1 col (mobile), 2 col (tablet), 3-4 col (desktop)
7. Dados vêm da API real, não mock

---

## Tasks

### Backend (regalaya-api)

- [ ] Implementar `GET /v1/products` com paginação (Spring Data Pageable)
- [ ] Implementar filtros: `?category=`, `?minPrice=`, `?maxPrice=`, `?inStock=`
- [ ] Implementar ordenação: `?sort=price,asc|desc`, `?sort=name`, `?sort=popularity`
- [ ] Criar índices otimizados no PostgreSQL para busca por categoria e preço
- [ ] Retornar `Page<ProductResponse>` com metadata (totalPages, totalElements, currentPage)
- [ ] Criar `ProductController` com endpoint público (sem auth)
- [ ] Criar `ProductService` com lógica de filtros combinados
- [ ] Criar `ProductRepository` com `JpaSpecificationExecutor` para queries dinâmicas

### Frontend (regalaya-web)

- [ ] Criar página `/products` com grid responsivo
- [ ] Implementar sidebar de filtros (categoria, preço, disponibilidade)
- [ ] Implementar paginação com componente `Pagination`
- [ ] Exibir skeleton loading durante fetch
- [ ] Exibir contador "X produtos encontrados"
- [ ] Implementar seletor de ordenação (dropdown)
- [ ] Criar componente `ProductCard` reutilizável
- [ ] Substituir mock-products por chamada à API real

---

## Technical Notes

### API Response Format
```json
{
  "content": [ProductResponse],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8
}
```

### ProductResponse
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "shortDescription": "string",
  "price": 99.90,
  "compareAtPrice": 149.90,
  "imageUrl": "string",
  "inStock": true,
  "category": { "id": "uuid", "name": "string", "slug": "string" }
}
```

### Query Parameters
```
GET /v1/products?page=0&size=20&sort=price,asc&category=tech&minPrice=50&maxPrice=500&inStock=true
```

---

## Implementation Status

### Backend
- [x] `GET /v1/products` com paginação (Spring Data Pageable)
- [x] Filtros: `?categoryId=`, `?minPrice=`, `?maxPrice=`, `?inStock=`
- [x] Ordenação: `?sort=price,name,createdAt,asc|desc`
- [x] `PageResponse<Product>` com metadata (totalPages, totalElements)
- [x] `ProductController` com endpoint público (sem auth)
- [x] `ProductService` com lógica de filtros combinados
- [x] `ProductRepository` com queries dinâmicas

### Frontend
- [x] Página `/products` com grid responsivo
- [x] Sidebar de filtros (categoria, preço, disponibilidade)
- [x] Paginação com componente `Pagination`
- [x] Skeleton loading durante fetch
- [x] Contador "X produtos encontrados"
- [x] Seletor de ordenação
- [x] Componente `ProductCard` reutilizável
- [x] Dados da API real (não mock)

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=ProductControllerTest

# Frontend
cd regalaya-web && npm run build

# E2E
cd regalaya-web && npx playwright test --grep "product listing"
```
