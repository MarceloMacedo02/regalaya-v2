---
title: 'HU-07.2 - Detalhes do Pedido (Admin)'
type: 'story'
epic: 'EPICO 07 - Gestão de Pedidos (Backend)'
status: 'backlog'
priority: 'P0'
points: 5
created: '2026-04-07'
---

## HU-07.2: Detalhes do Pedido (Admin)

**Como** admin, **quero** ver detalhes completos de um pedido, **para** investigar problemas.

---

## Acceptance Criteria

1. Admin acessa `/admin/orders/{id}` e vê página completa de detalhes
2. Seção Cliente: nome, email, telefone, histórico de pedidos anteriores
3. Seção Itens: lista de produtos com imagem, nome, sku, quantidade, preço unitário, total
4. Seção Endereço: endereço de entrega completo formatado
5. Seção Pagamento: método, status, ID da transação, data do pagamento
6. Timeline de Status: visualize histórico de alterações de status com data/hora
7. Tracking: código de rastreamento (se houver) com link para rastreamento oficial
8. Notas: campo de notas internas visíveis apenas para admin

---

## Tasks

### Backend (regalaya-api)

- [x] Implementar `GET /api/v1/admin/orders/{id}` retornando detalhes completos
- [x] Retornar: dados do cliente, lista de itens, endereços, informações de pagamento
- [x] Incluir histórico de status (OrderStatusHistory)
- [x] Incluir dados de rastreamento (trackingCode, trackingUrl)
- [x] Adicionar campo de notas internas na resposta
- [x] Criar `OrderDetailResponse` com todos os campos necessários
- [x] Implementar auditoria completa de acesso à página de detalhes

### Frontend Admin (regalaya-admin)

- [ ] Criar página `/admin/orders/[id]` com layout de detalhes
- [ ] Criar seção de dados do cliente com link para perfil
- [ ] Criar seção de itens do pedido em cards ou tabela
- [ ] Criar seção de endereço de entrega
- [ ] Criar seção de pagamento com status badge
- [ ] Implementar timeline de status com ícones e datas
- [ ] Exibir código de rastreamento com link externo
- [ ] Exibir notas internas (se houver)
- [ ] Botão para alterar status (acessa fluxo da HU-07.3)
- [ ] Botão para processar reembolso (acessa fluxo da HU-07.4)

---

## Technical Notes

### API Response Format
```json
{
  "id": "uuid",
  "orderNumber": "REG-2026-000001",
  "status": "PROCESSING",
  "customer": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+5511999999999",
    "totalOrders": 5,
    "totalSpent": 1499.50
  },
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Presente Elegante",
      "productSku": "PRES-001",
      "quantity": 2,
      "unitPrice": 99.90,
      "totalPrice": 199.80,
      "imageUrl": "https://..."
    }
  ],
  "shippingAddress": {
    "street": "Rua Example",
    "number": "123",
    "complement": "Apto 1",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01000-000"
  },
  "billingAddress": { ... },
  "payment": {
    "method": "CREDIT_CARD",
    "status": "PAID",
    "transactionId": "tx_123456",
    "paidAt": "2026-04-07T10:35:00Z"
  },
  "subtotal": 199.80,
  "shippingCost": 15.90,
  "discountAmount": 0,
  "total": 215.70,
  "trackingCode": "AB123456789BR",
  "trackingUrl": "https://rastreamento.correios.com.br/...",
  "notes": "Presente para aniversário",
  "statusHistory": [
    {
      "status": "PENDING",
      "changedAt": "2026-04-07T10:30:00Z",
      "changedBy": "Sistema"
    },
    {
      "status": "PAID",
      "changedAt": "2026-04-07T10:35:00Z",
      "changedBy": "Webhook"
    }
  ],
  "createdAt": "2026-04-07T10:30:00Z",
  "updatedAt": "2026-04-07T10:35:00Z",
  "completedAt": null
}
```

### Endpoints
- `GET /api/v1/admin/orders/{id}` - Detalhes do pedido

### Roles e Permissões
- Requer role: ADMIN ou MANAGER
- Permissão: `orders:read`

---

## Dependencies

- **Épico 06**: Checkout e Pagamento (orders criadas)
- **HU-07.1**: Listagem de pedidos (pré-requisito para acessar detalhes)

---

## Implementation Notes

### Backend - Histórico de Status
```java
// Table order_status_history
@Entity
public class OrderStatusHistory {
    @Id
    private UUID id;
    @ManyToOne
    private Order order;
    private OrderStatus previousStatus;
    private OrderStatus newStatus;
    private String changedBy; // user_id or "System" or "Webhook"
    private String reason;
    private Instant changedAt;
}
```

### Frontend - Timeline
- Usar timeline vertical com ícones para cada status
- Cores por status (same as table badges)

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=AdminOrderControllerTest#getOrderDetails

# Frontend
cd regalaya-admin && npm run build

# E2E
cd regalaya-admin && npx playwright test --grep "order details"
```

---

## Story Dependencies

- Depende de: **HU-07.1** (listagem de pedidos)
- Bloqueia: **HU-07.3** (alteração de status), **HU-07.4** (reembolso)