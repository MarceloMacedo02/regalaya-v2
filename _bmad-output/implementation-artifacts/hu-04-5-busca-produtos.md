---
title: 'HU-04.5 - Busca de Produtos'
type: 'story'
epic: 'EPICO 04 - Catálogo de Produtos'
status: 'backlog'
priority: 'P1'
points: 8
created: '2026-04-07'
---

## HU-04.5: Busca de Produtos

**Como** visitante, **quero** buscar produtos por nome/descrição, **para** encontrar rapidamente.

---

## Acceptance Criteria

1. Barra de busca no header funciona com debounce (300ms)
2. Autocomplete exibe sugestões em tempo real
3. Página de resultados exibe produtos encontrados
4. Termos buscados destacados nos resultados
5. Busca por nome E descrição (ILIKE ou full-text)
6. Performance aceitável (< 200ms para queries simples)

---

## Tasks

### Backend (regalaya-api)

- [ ] Implementar `GET /v1/products/search?q={query}` com ILIKE
- [ ] Implementar `GET /v1/products/suggestions?q={query}&limit=5` para autocomplete
- [ ] Usar PostgreSQL full-text search ou ILIKE para busca
- [ ] Indexar campos name e description para busca
- [ ] Limitar resultados de autocomplete a 5 sugestões

### Frontend (regalaya-web)

- [ ] Criar componente `SearchBar` no header
- [ ] Implementar debounce (300ms) na busca
- [ ] Exibir dropdown de sugestões em tempo real
- [ ] Criar página `/products/search?q=` com resultados
- [ ] Destacar termos buscados nos resultados
- [ ] Exibir "Nenhum resultado encontrado" quando aplicável

---

## Technical Notes

### Search API
```
GET /v1/products/search?q=termo&page=0&size=20
GET /v1/products/suggestions?q=termo&limit=5
```

### SuggestionResponse
```json
{
  "id": "uuid",
  "name": "Produto Exemplo",
  "slug": "produto-exemplo",
  "price": 99.90,
  "imageUrl": "string"
}
```

### PostgreSQL Full-Text Search
```sql
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('portuguese', name || ' ' || description));
```

---

## Implementation Status

### Backend
- [x] `GET /v1/products/search?q={query}` com ILIKE
- [x] `GET /v1/products/suggestions?q={query}` para autocomplete
- [x] Busca por nome e descrição (ILIKE)
- [x] Resultados de autocomplete limitados a 5

### Frontend
- [x] `useProductSearch` hook com debounce (300ms)
- [x] Dropdown de sugestões em tempo real
- [x] Página `/products/search?q=` com resultados
- [x] Termos buscados destacados nos resultados
- [x] "Nenhum resultado encontrado" quando aplicável

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=ProductSearchTest

# Frontend
cd regalaya-web && npm run build

# E2E
cd regalaya-web && npx playwright test --grep "product search"
```
