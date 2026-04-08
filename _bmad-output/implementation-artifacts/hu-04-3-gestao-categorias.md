---
title: 'HU-04.3 - Gestão de Categorias (Admin)'
type: 'story'
epic: 'EPICO 04 - Catálogo de Produtos'
status: 'backlog'
priority: 'P1'
points: 8
created: '2026-04-07'
---

## HU-04.3: Gestão de Categorias (Admin)

**Como** admin, **quero** gerenciar categorias de produtos, **para** organizar o catálogo.

---

## Acceptance Criteria

1. Admin acessa `/admin/categories` e vê lista de categorias
2. Pode criar, editar e excluir categorias
3. Hierarquia de categorias funciona (parent/child)
4. Tree view exibe categorias aninhadas corretamente
5. Validação: nome obrigatório, slug único
6. Soft delete para categorias (não excluir se tiver produtos)

---

## Tasks

### Backend (regalaya-api)

- [ ] Criar entidade `Category` com hierarquia (parent_id)
- [ ] Criar `CategoryRepository` com busca por parent
- [ ] Implementar `GET /v1/admin/categories` - lista com hierarquia
- [ ] Implementar `GET /v1/admin/categories/tree` - árvore de categorias
- [ ] Implementar `POST /v1/admin/categories` - criar (ADMIN role)
- [ ] Implementar `PUT /v1/admin/categories/{id}` - atualizar (ADMIN role)
- [ ] Implementar `DELETE /v1/admin/categories/{id}` - soft delete (ADMIN role)
- [ ] Validar: não excluir categoria com produtos vinculados
- [ ] Gerar slug automaticamente a partir do nome

### Frontend Admin (regalaya-web)

- [ ] Criar página `/admin/categories` com lista de categorias
- [ ] Implementar tree view de categorias (nested)
- [ ] Criar modal de criação/edição de categoria
- [ ] Implementar confirmação de exclusão com validação
- [ ] Exibir mensagem de erro se categoria tem produtos vinculados
- [ ] Implementar drag-and-drop para reordenar (opcional)
- [ ] Proteger rota com role ADMIN

---

## Technical Notes

### Category Entity
```java
@Entity
@Table(name = "categories")
public class Category extends BaseEntity {
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;
    
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Category> children;
    
    private Integer sortOrder;
    private Boolean isActive;
}
```

### CategoryResponse
```json
{
  "id": "uuid",
  "name": "Tecnologia",
  "slug": "tecnologia",
  "description": "Produtos tecnológicos",
  "imageUrl": "string",
  "parentId": "uuid",
  "children": [CategoryResponse],
  "sortOrder": 1,
  "isActive": true,
  "productCount": 25
}
```

### API Endpoints
```
GET    /v1/admin/categories           - Listar categorias
GET    /v1/admin/categories/tree      - Árvore de categorias
POST   /v1/admin/categories           - Criar (ADMIN)
PUT    /v1/admin/categories/{id}      - Atualizar (ADMIN)
DELETE /v1/admin/categories/{id}      - Soft delete (ADMIN)
```

---

## Implementation Status

### Backend
- [x] `GET /v1/categories` - lista pública
- [x] `GET /v1/admin/categories` - lista admin
- [x] `POST /v1/admin/categories` - criar (ADMIN)
- [x] `PUT /v1/admin/categories/{id}` - atualizar (ADMIN)
- [x] `DELETE /v1/admin/categories/{id}` - excluir (ADMIN)
- [x] Slug único gerado automaticamente

### Frontend
- [x] Página `/admin/categories` com lista de categorias
- [x] Dados da API real (não mock)

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=CategoryControllerTest

# Frontend
cd regalaya-web && npm run build

# E2E
cd regalaya-web && npx playwright test --grep "category management"
```
