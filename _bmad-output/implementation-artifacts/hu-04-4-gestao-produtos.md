---
title: 'HU-04.4 - Gestão de Produtos (Admin)'
type: 'story'
epic: 'EPICO 04 - Catálogo de Produtos'
status: 'backlog'
priority: 'P0'
points: 13
created: '2026-04-07'
---

## HU-04.4: Gestão de Produtos (Admin)

**Como** admin, **quero** gerenciar produtos (CRUD completo), **para** manter o catálogo atualizado.

---

## Acceptance Criteria

1. Admin acessa `/admin/products` e vê tabela com paginação e filtros
2. Pode criar, editar e excluir produtos
3. Upload de múltiplas imagens funciona
4. Validação: nome, preço, categoria obrigatórios
5. Gerenciamento de estoque (stock field)
6. Soft delete para produtos
7. Preview do produto antes de publicar

---

## Tasks

### Backend (regalaya-api)

- [ ] Implementar `GET /v1/admin/products` - lista admin com paginação
- [ ] Implementar `GET /v1/admin/products/{id}` - detalhe admin
- [ ] Implementar `POST /v1/admin/products` - criar (ADMIN role)
- [ ] Implementar `PUT /v1/admin/products/{id}` - atualizar (ADMIN role)
- [ ] Implementar `DELETE /v1/admin/products/{id}` - soft delete (ADMIN role)
- [ ] Implementar `POST /v1/admin/products/{id}/images` - upload de imagens
- [ ] Gerar slug automaticamente a partir do nome
- [ ] Validar: nome, price, category_id obrigatórios
- [ ] Gerenciar campo stock (estoque)

### Frontend Admin (regalaya-web)

- [ ] Criar página `/admin/products` com tabela paginada
- [ ] Implementar filtros na tabela (categoria, status, estoque)
- [ ] Criar página `/admin/products/new` com formulário
- [ ] Criar página `/admin/products/[id]/edit` com formulário
- [ ] Implementar upload de múltiplas imagens
- [ ] Implementar preview do produto
- [ ] Proteger rotas com role ADMIN

---

## Technical Notes

### Product Entity Fields
```
id, name, slug, description, shortDescription, price, compareAtPrice,
sku, stock, inStock, categoryId, isActive, images (JSONB), metadata (JSONB),
createdAt, updatedAt, deletedAt
```

### API Endpoints
```
GET    /v1/admin/products              - Listar (ADMIN)
GET    /v1/admin/products/{id}         - Detalhe (ADMIN)
POST   /v1/admin/products              - Criar (ADMIN)
PUT    /v1/admin/products/{id}         - Atualizar (ADMIN)
DELETE /v1/admin/products/{id}         - Soft delete (ADMIN)
POST   /v1/admin/products/{id}/images  - Upload imagens (ADMIN)
```

---

## Implementation Status

### Backend
- [x] `GET /v1/products` - lista pública com paginação
- [x] `GET /v1/admin/products` - lista admin com paginação
- [x] `POST /v1/admin/products` - criar (ADMIN)
- [x] `PUT /v1/admin/products/{id}` - atualizar (ADMIN)
- [x] `DELETE /v1/admin/products/{id}` - excluir (ADMIN)
- [x] Slug único gerado automaticamente
- [x] Validação: nome, price, category_id obrigatórios
- [x] Campo stock gerenciado

### Frontend
- [x] Página `/admin/products` com tabela paginada
- [x] Filtros na tabela (categoria, status)
- [x] Dados da API real (não mock)

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=ProductAdminControllerTest

# Frontend
cd regalaya-web && npm run build
```
