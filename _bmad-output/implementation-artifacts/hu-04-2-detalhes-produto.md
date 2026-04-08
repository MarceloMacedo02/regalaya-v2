---
title: 'HU-04.2 - Detalhes do Produto'
type: 'story'
epic: 'EPICO 04 - Catálogo de Produtos'
status: 'backlog'
priority: 'P0'
points: 8
created: '2026-04-07'
---

## HU-04.2: Detalhes do Produto

**Como** visitante, **quero** ver detalhes completos de um produto, **para** decidir se é um bom presente.

---

## Acceptance Criteria

1. Usuário clica em produto e vê página de detalhes com todas as informações
2. Galeria de imagens com carousel funcional
3. Breadcrumb de navegação: Home > Categoria > Produto
4. Preço com desconto exibido (riscado se compareAtPrice existir)
5. Status de disponibilidade visível (em estoque / esgotado)
6. Produtos relacionados exibidos abaixo
7. URL amigável: `/products/{slug}`

---

## Tasks

### Backend (regalaya-api)

- [ ] Implementar `GET /v1/products/{id}` - retorna detalhes completos
- [ ] Implementar `GET /v1/products/slug/{slug}` - busca por slug
- [ ] Retornar imagens múltiplas do produto
- [ ] Calcular preço com desconto (compareAtPrice vs price)
- [ ] Verificar disponibilidade em tempo real (stock > 0)
- [ ] Retornar produtos relacionados (mesma categoria, limit 4)

### Frontend (regalaya-web)

- [ ] Criar página `/products/[slug]` com SSR/ISR
- [ ] Implementar galeria de imagens com carousel
- [ ] Exibir breadcrumb de navegação
- [ ] Exibir nome, descrição completa, preço, compareAtPrice
- [ ] Exibir badge de disponibilidade (em estoque / esgotado)
- [ ] Implementar seletor de quantidade
- [ ] Exibir seção de produtos relacionados
- [ ] Garantir dados reais da API (sem mock)

---

## Technical Notes

### ProductDetailResponse
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "description": "string",
  "shortDescription": "string",
  "price": 99.90,
  "compareAtPrice": 149.90,
  "sku": "PROD-001",
  "stock": 50,
  "inStock": true,
  "images": [
    { "url": "string", "alt": "string", "order": 1 }
  ],
  "category": { "id": "uuid", "name": "string", "slug": "string" },
  "relatedProducts": [ProductResponse],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

### API Endpoints
```
GET /v1/products/{id}          - Detalhe por ID
GET /v1/products/slug/{slug}   - Detalhe por slug (SEO-friendly)
```

---

## Implementation Status

### Backend
- [x] `GET /v1/products/{id}` - detalhes completos
- [x] `GET /v1/products/slug/{slug}` - busca por slug
- [x] Imagens múltiplas retornadas
- [x] Preço com desconto (compareAtPrice vs price)
- [x] Disponibilidade em tempo real (stock > 0)

### Frontend
- [x] Página `/products/[slug]` com SSR (fetch real)
- [x] Nome, descrição, preço, compareAtPrice exibidos
- [x] Badge de disponibilidade (em estoque / esgotado)
- [x] Dados reais da API (sem mock)

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=ProductDetailTest

# Frontend
cd regalaya-web && npm run build

# E2E
cd regalaya-web && npx playwright test --grep "product detail"
```
