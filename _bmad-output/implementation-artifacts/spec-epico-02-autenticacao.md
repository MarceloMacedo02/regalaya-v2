---
title: 'EPICO 02 - Autenticação e Autorização'
type: 'feature'
created: '2026-04-07'
status: 'done'
context: []
baseline_commit: HEAD
---

## Intent

**Problem:** Sistema de autenticação e autorização completo com JWT, RBAC, rate limiting e recuperação de senha.

**Approach:** Implementar autenticação stateless com JWT, sistema de roles/permissions, refresh tokens rotativos, rate limiting e testes completos.

## Status: ✅ COMPLETO

### Backend (regalaya-api)

| Componente | Status | Observação |
|-----------|--------|------------|
| AuthController | ✅ | Todos endpoints implementados |
| AuthService | ✅ | Lógica completa de auth |
| JWT Filter | ✅ | Spring Security integration |
| User Entity | ✅ | Roles, permissions |
| Rate Limiting | ✅ | Bucket4j implementation |
| Refresh Tokens | ✅ | Rotativos com revocação |
| Audit Logs | ✅ | Eventos de segurança |
| Tests | ✅ | 11 testes unitários |

### Frontend (regalaya-web)

| Componente | Status | Observação |
|-----------|--------|------------|
| auth.service.ts | ✅ | API client completo |
| auth.context.tsx | ✅ | React Context + hooks |
| middleware.ts | ✅ | Proteção de rotas |
| /login | ✅ | Página de login |
| /register | ✅ | Página de registro |
| /forgot-password | ✅ | Recuperação de senha |

## Implementado

### HU-02.1: Registro de Usuário ✅
- [x] POST /auth/register
- [x] Validação de email/telefone
- [x] Geração de código de verificação
- [x] Envio de email de boas-vindas
- [x] Rate limiting (100 req/min)
- [x] Frontend: Página + validação

### HU-02.2: Login com JWT ✅
- [x] POST /auth/login
- [x] Validação de credenciais
- [x] Geração de access token (15min)
- [x] Geração de refresh token (7 dias)
- [x] Registro de last_login
- [x] Frontend: Context + hooks

### HU-02.3: Recuperação de Senha ✅
- [x] POST /auth/forgot-password
- [x] POST /auth/reset-password
- [x] Token de reset (UUID)
- [x] Expiração de 1 hora
- [x] Frontend: Formulários

### HU-02.4: Sistema RBAC ✅
- [x] Roles: ADMIN, USER, MANAGER, CLIENT
- [x] Permissions granulares
- [x] @PreAuthorize em controllers
- [x] Middleware de proteção
- [x] Redirecionamento por role

### HU-02.5: Refresh Token e Logout ✅
- [x] POST /auth/refresh
- [x] Rotação de tokens
- [x] Revogação de tokens
- [x] Tabela de tokens revogados
- [x] Frontend: Auto-refresh

## Arquivos Implementados

### Backend
```
regalaya-api/src/main/java/br/com/regalaya/auth/
├── controller/AuthController.java
├── services/AuthService.java
├── services/impl/AuthServiceImpl.java
├── domain/model/
│   ├── User.java
│   ├── Role.java
│   ├── UserPlan.java
│   └── AuditLog.java
├── dto/requests/
├── dto/responses/
├── infrastructure/
│   ├── jwt/JwtUtil.java
│   ├── jwt/JwtAuthenticationFilter.java
│   ├── security/UserDetailsImpl.java
│   ├── ratelimit/RateLimitService.java
│   ├── audit/AuditService.java
│   └── email/EmailService.java
├── mapper/UserMapper.java
└── repository/
```

### Frontend
```
regalaya-web/src/
├── services/auth.service.ts
├── contexts/auth.context.tsx
├── hooks/useAuth.ts
├── middleware.ts
├── app/login/page.tsx
├── app/register/page.tsx
└── components/auth/
```

## Testes

### Unitários (Backend)
- ✅ Registro com email único
- ✅ Registro com email duplicado
- ✅ Login com credenciais válidas
- ✅ Login com senha inválida
- ✅ Forgot password
- ✅ Reset password
- ✅ Validação de email
- ✅ Refresh token válido
- ✅ Refresh token inválido
- ✅ Get current user

### E2E (Frontend)
- Fluxo: registro → login → logout
- Testes de proteção de rotas

## Verificação

```bash
# Backend tests
cd regalaya-api && mvn test

# Frontend tests
cd regalaya-web && npm test

# E2E tests
cd regalaya-web && npx playwright test
```

## Notas

1. **Lombok**: Erros LSP no IDE são normais - o build Maven funciona corretamente
2. **JWT**: Access token expira em 15min, refresh em 7 dias
3. **Rate Limit**: 100 req/min para login, 30/min para registro
4. **Segurança**: Tokens revogados são armazenados para controle
