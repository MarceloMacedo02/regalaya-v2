# Story 10.4: Limite de Uso de IA

Status: ready-for-dev

> **Tech Stack**: Spring Boot RateLimiter | PostgreSQL | Next.js

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como sistema,
Eu quero implementar rate limiting para API de IA,
para que os custos sejam controlados e o serviço permaneça disponível para todos os usuários.

## Acceptance Criteria

1. [AC1] Implementar contador de uso por usuário no banco
2. [AC2] Limite diário/mensal configurável via application.yml
3. [AC3] Retornar erro 429 com headers quando limite atingido
4. [AC4] Dashboard de uso para admin com gráficos
5. [AC5] Frontend deve indicar uso restante no header
6. [AC6] Frontend deve exibir mensagem de limite atingido com modal

## Tasks / Subtasks

### Task 1: Backend - Migration e Entidade (AC: #1)
- [ ] Criar migration para tabela ai_usage
- [ ] Criar entidade AiUsage com: user_id, usage_date, request_count, tokens_used, cost_estimate
- [ ] Criar índice composto (user_id, usage_date)
- [ ] Implementar AiUsageRepository

### Task 2: Backend - RateLimitConfig (AC: #2)
- [ ] Criar RateLimitConfigProperties com @ConfigurationProperties
- [ ] Configurar: daily-limit (50), monthly-limit (500), reset-hour (0)
- [ ] Configurar: enable-cost-tracking, alert-threshold-percent (80)

### Task 3: Backend - RateLimitService (AC: #1, #2, AC3)
- [ ] Implementar RateLimitService
- [ ] Implementar método checkAndIncrement(userId): boolean
- [ ] Implementar getRemainingRequests(userId): long
- [ ] Implementar getUsageStats(userId): UsageStats
- [ ] Implementar resetDailyUsage() via scheduled job

### Task 4: Backend - Interceptador LangChain4j (AC: #1)
- [ ] Criar RateLimitAiService wrapper em torno de RecommendationService
- [ ] Interceptar chamadas antes de invocar ChatLanguageModel
- [ ] Se limite atingido, lançar UsageLimitExceededException
- [ ] Após sucesso, incrementCounter(userId, tokens)

### Task 5: Backend - Exception Handler (AC: #3)
- [ ] Criar UsageLimitExceededException
- [ ] Criar GlobalExceptionHandler para a exceção
- [ ] Retornar 429 com headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- [ ] Retornar corpo com mensagem amigável e link para upgrade

### Task 6: Backend - Métricas e Logs (AC: #1)
- [ ] Criar métricas Micrometer para: ai_requests_total, ai_tokens_used, ai_cost_estimate
- [ ] Log de cada requisição: userId, operation, tokens, cost
- [ ] Dashboard Prometheus/Grafana ready

### Task 7: Backend - Admin Dashboard API (AC: #4)
- [ ] Criar endpoint GET /admin/ai-usage
- [ ] Implementar agregação: total_requests, total_tokens, total_cost, unique_users
- [ ] Criar endpoint GET /admin/ai-usage/top-users?limit=10
- [ ] Criar endpoint GET /admin/ai-usage/by-date?from=&to=
- [ ] Implementar filtros por período

### Task 8: Backend - Scheduled Jobs
- [ ] Criar job de reset diário (executar às 00:00 Brasil)
- [ ] Criar job de cleanup (manter dados por 90 dias)
- [ ] Criar job de envio de alerta (80% do limite)

### Task 9: Frontend - UsageIndicator (AC: #5)
- [ ] Criar componente UsageIndicator.tsx
- [ ] Exibir "X/Y requests usados" no header
- [ ] Implementar progress bar (verde < 60%, amarelo 60-80%, vermelho > 80%)
- [ ] Fetch uso atual via hook useAiUsage

### Task 10: Frontend - Limit Modal (AC: #6)
- [ ] Criar componente LimitExceededModal.tsx
- [ ] Exibir quando 429 retornado da API
- [ ] Mostrar opções:升级 Plano, Ver Planos, Contato
- [ ] Implementar botão "Entendi" para fechar

### Task 11: Frontend - Admin Dashboard (AC: #4)
- [ ] Criar página /admin/ai-usage
- [ ] Implementar gráficos com Recharts
- [ ] Exibir top usuários por uso
- [ ] Filtros por período

### Task 12: Configuração application.yml
```yaml
ai:
  rate-limit:
    daily: 50
    monthly: 500
    reset-hour: 0
    alert-threshold-percent: 80
    cost-per-token: 0.0001
```

### Task 13: Testes
- [ ] Testar rate limiting após limite atingido (mock LangChain4j)
- [ ] Testar reset diário
- [ ] Testar contador preciso
- [ ] Testar headers 429
- [ ] Testar dashboard admin

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **Rate Limiting**: AOP + Filter interceptor
- **Database**: PostgreSQL para storing de uso
- **Frontend**: Next.js 14+ com React, TypeScript, Tailwind CSS

### Fluxo de Rate Limiting
```
1. Frontend chama POST /ai/recommendations
2. RateLimitFilter intercepta requisição
3. RateLimitService.checkAndIncrement(userId)
   - Se limite atingido → 429 + UsageLimitExceededException
   - Se ok → proceed
4. RecommendationService executa (LangChain4j)
5. Após sucesso → incrementCounter(userId, tokens)
6. Retorna resposta ao frontend
```

### Estrutura de Tabela
```sql
CREATE TABLE ai_usage (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    usage_date DATE NOT NULL,
    request_count INT DEFAULT 0,
    tokens_used BIGINT DEFAULT 0,
    cost_estimate DECIMAL(10, 6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, usage_date)
);

CREATE INDEX idx_ai_usage_user_date ON ai_usage(user_id, usage_date);
```

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── config/
│   └── RateLimitConfigProperties.java
├── filter/
│   └── RateLimitFilter.java
├── interceptor/
│   └── AiRateLimitInterceptor.java
├── service/
│   ├── RateLimitService.java
│   ├── AiUsageService.java
│   └── RecommendationService.java  # 10-1 (wrapped)
├── repository/
│   └── AiUsageRepository.java
├── entity/
│   └── AiUsage.java
├── exception/
│   ├── UsageLimitExceededException.java
│   └── GlobalExceptionHandler.java
├── controller/
│   ├── AIController.java           # 10-1, 10-2, 10-3
│   └── AdminAIController.java
└── dto/
    └── UsageStats.java
```

#### Frontend (regalaya-web)
```
src/
├── components/
│   ├── UsageIndicator.tsx
│   └── LimitExceededModal.tsx
├── hooks/
│   └── useAiUsage.ts
├── app/
│   ├── layout.tsx                  # Integrar no header
│   ├── admin/
│   │   └── ai-usage/
│   │       └── page.tsx
│   └── api/
│       └── ai/
│           └── recommendations/
│               └── route.ts        # Interceptor para 429
```

### Limites Recomendados (application.yml)
```yaml
ai:
  rate-limit:
    daily: 50
    monthly: 500
    reset-hour: 0  # Meia-noite Brasil
    alert-threshold-percent: 80
    cost-per-token: 0.0001  # USD
```

### Headers de Rate Limit
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 1712530800  # Unix timestamp
```

### Reutilização
- **RecommendationService** (10-1): Wrapped pelo RateLimitService
- **AIController**: Adicionar verificação antes de cada endpoint IA

### Referências

- [Source: CE.md#HU-10.4]
- [Source: 10-1-recomendacao-perfil.md]
- [Spring Rate Limiting](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.metric利率 limiting)