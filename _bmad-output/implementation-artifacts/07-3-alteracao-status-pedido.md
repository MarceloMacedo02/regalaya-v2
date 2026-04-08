---
title: 'HU-07.3 - Alteração de Status de Pedido'
type: 'story'
epic: 'EPICO 07 - Gestão de Pedidos (Backend)'
status: 'backlog'
priority: 'P0'
points: 5
created: '2026-04-07'
---

## HU-07.3: Alteração de Status de Pedido

**Como** admin, **quero** alterar o status de um pedido, **para** atualizar o cliente.

---

## Acceptance Criteria

1. Admin pode alterar status através de dropdown na lista ou botão na página de detalhes
2. Fluxo de status permitido: PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
3. Transições também permitidas para: CANCELLED (de qualquer estado exceto DELIVERED), REFUNDED (de PAID ou DELIVERED)
4. Modal de alteração com seletor de novo status e campo de observação (opcional)
5. Confirmação antes de alterar (modal com botão "Confirmar")
6. Registrar histórico de alteração (quem, quando, motivo)
7. Enviar notificação ao cliente por email e WhatsApp quando status mudar
8. Atualização em tempo real na interface

---

## Tasks

### Backend (regalaya-api)

- [ ] Implementar `PATCH /api/v1/admin/orders/{id}/status`
- [ ] Validar transição de status (regras de negócio)
- [ ] Registrar em `order_status_history` (previousStatus, newStatus, changedBy, reason, changedAt)
- [ ] Enviar notificação por email (EmailService)
- [ ] Enviar notificação por WhatsApp (WhatsAppService) se cliente permitir
- [ ] Atualizar campos do pedido (status, updatedAt)
- [ ] Se status → SHIPPED, permitir informar trackingCode
- [ ] Se status → CANCELLED, reverter estoque (liberar reserved)
- [ ] Adicionar validação: não permitir DELIVERED sem shipping info

### Frontend Admin (regalaya-admin)

- [ ] Na lista: dropdown com statuses válidos por status atual
- [ ] Na detalhes: botão "Alterar Status" abre modal
- [ ] Modal: seletor de status, campo de observação, checkbox "Enviar notificação"
- [ ] Confirmar com modal de segurança
- [ ] Feedback visual: toast de sucesso/erro
- [ ] Atualizar lista/detalhes após alteração
- [ ] Se SHIPPED: abrir modal para informar código de rastreamento

---

## Technical Notes

### API Request/Response
```json
// Request PATCH /api/v1/admin/orders/{id}/status
{
  "newStatus": "PROCESSING",
  "reason": "Pagamento confirmado",
  "trackingCode": null
}

// Response
{
  "id": "uuid",
  "orderNumber": "REG-2026-000001",
  "status": "PROCESSING",
  "message": "Status atualizado com sucesso"
}
```

### Validações de Transição
| De | Para Permitidos |
|----|----------------|
| PENDING | PAID, CANCELLED |
| PAID | PROCESSING, CANCELLED, REFUNDED |
| PROCESSING | SHIPPED, CANCELLED |
| SHIPPED | DELIVERED, CANCELLED |
| DELIVERED | REFUNDED (apenas) |
| CANCELLED | (nenhum - terminal) |
| REFUNDED | (nenhum - terminal) |

### Notificações
- Email: template transacional "order_status_update"
- WhatsApp: template approved "order_status_update"

### Endpoints
- `PATCH /api/v1/admin/orders/{id}/status` - Altera status do pedido

### Roles e Permissões
- Requer role: ADMIN ou MANAGER
- Permissão: `orders:write`

---

## Dependencies

- **Épico 06**: Checkout e Pagamento (orders criadas)
- **HU-07.1**: Listagem de pedidos (ação na lista)
- **HU-07.2**: Detalhes do pedido (ação na página)

---

## Implementation Notes

### Backend - Validação de Transição
```java
private boolean isValidTransition(OrderStatus from, OrderStatus to) {
    Map<OrderStatus, Set<OrderStatus>> allowedTransitions = Map.of(
        PENDING, Set.of(PAID, CANCELLED),
        PAID, Set.of(PROCESSING, CANCELLED, REFUNDED),
        PROCESSING, Set.of(SHIPPED, CANCELLED),
        SHIPPED, Set.of(DELIVERED, CANCELLED),
        DELIVERED, Set.of(REFUNDED),
        CANCELLED, Set.of(),
        REFUNDED, Set.of()
    );
    return allowedTransitions.getOrDefault(from, Set.of()).contains(to);
}
```

### Frontend - Dropdown de Status
- Desabilitar opções inválidas (não clicáveis)
- Mostrar tooltip explicando por que opção está desabilitada

---

## Verification

```bash
# Backend
cd regalaya-api && mvn test -Dtest=AdminOrderControllerTest#updateStatus

# Frontend
cd regalaya-admin && npm run build

# E2E
cd regalaya-admin && npx playwright test --grep "update order status"
```

---

## Story Dependencies

- Depende de: **HU-07.1**, **HU-07.2**
- Não bloqueia outras stories (mas será usado por elas)