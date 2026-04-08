---
title: 'EPICO 01 - Configuração de Infraestrutura e DevOps'
type: 'feature'
created: '2026-04-07'
status: 'done'
context: []
baseline_commit: HEAD
---

## Intent

**Problem:** O projeto Regalaya possui Dockerfiles e docker-compose básicos, mas falta uma estrutura completa de CI/CD, scripts de setup, e orquestração unificada de todos os serviços.

**Approach:** Implementar a infraestrutura completa de DevOps conforme o PRD:
- Scripts de setup automatizado para desenvolvimento
- Docker Compose unificado para API + Web
- Pipelines CI/CD completos com quality gates
- Configuração de monitoramento e notificações

## Boundaries & Constraints

**Always:**
- Java 21 + Spring Boot 3.4+ para API
- Node.js 20+ LTS + Next.js 14+ para Web
- PostgreSQL 15+ como banco principal
- Redis 7+ para cache
- Conventional Commits para versionamento

**Ask First:**
- Estratégia de deploy em produção (Vercel vs ECS Fargate)
- Configurações de secrets para produção
- Domínio e SSL certificates

**Never:**
- Não incluir credenciais reais nos arquivos
- Não fazer deploy automático para produção sem aprovação
- Não usar versões deprecated de tecnologias

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| DEV_SETUP | Executa setup-dev.sh | Cria .env, baixa dependências, prepara banco | Mostra instruções manuais se script falhar |
| DOCKER_UP | docker-compose up -d | Todos os serviços healthy em 120s | Mostra logs do serviço que falhou |
| CI_PIPELINE | Push para develop | Build → Test → Lint → SonarQube → Deploy staging | Fail em qualquer gate |
| PR_CREATED | Pull request aberto | SonarQube analysis + Coverage report | Comentário automático no PR |

</frozen-after-approval>

## Code Map

- `regalaya-api/Dockerfile` -- Docker multi-stage para API Spring Boot
- `regalaya-web/Dockerfile` -- Docker multi-stage para Next.js
- `regalaya-api/docker-compose.yml` -- Compose atual (manter e melhorar)
- `scripts/setup-dev.sh` -- Script de setup para novos desenvolvedores
- `docker-compose.yml` -- Compose raiz unificado (NOVO)
- `.github/workflows/api-ci.yml` -- Pipeline CI/CD para API (NOVO)
- `.github/workflows/web-ci.yml` -- Pipeline CI/CD para Web (NOVO)
- `.github/workflows/deploy.yml` -- Pipeline de deploy (NOVO)
- `regalaya-api/.env.example` -- Vars de ambiente exemplo API (NO VO)
- `regalaya-web/.env.example` -- Ja existente

## Tasks & Acceptance

**Execution:**

- [x] `scripts/setup-dev.sh` -- Criar script bash de setup -- Para novos devs executarem setup completo ✅
- [x] `docker-compose.yml` -- Criar compose raiz unificado -- Orquestrar API + Web + DB + Redis ✅
- [x] `.github/workflows/api-ci.yml` -- Criar pipeline Maven -- Build, test, lint, SonarQube ✅
- [x] `.github/workflows/web-ci.yml` -- Migrar/criar pipeline Next.js -- Build, test, lint, Lighthouse ✅
- [x] `.github/workflows/deploy.yml` -- Criar pipeline deploy -- Staging auto, Production manual approval ✅
- [x] `regalaya-api/.env.example` -- Criar arquivo de exemplo -- Documentar todas as vars ✅
- [x] `README.md` (raiz) -- Atualizar README principal -- Links para setup, arquitetura, comandos ✅
- [x] `.editorconfig` -- Criar arquivo EditorConfig -- Padronizar código entre editores ✅

**Acceptance Criteria:**

- Given novo desenvolvedor, when executa `setup-dev.sh`, then ambiente configurado em < 5 min
- Given Docker instalado, when executa `docker-compose up -d`, then todos serviços healthy
- Given push para develop, when pipeline executa, then deploy em staging automático
- Given pull request, when aberto, then SonarQube analysis executa em < 5 min
- Given Secret configurado, when approve manual, then deploy para produção executa

## Spec Change Log

-

## Design Notes

### Docker Multi-Stage Strategy

```dockerfile
# API - Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder
RUN mvn dependency:go-offline -B
COPY src && RUN mvn package -DskipTests

# API - Stage 2: Runtime
FROM eclipse-temurin:21-jre
COPY --from=builder app.jar
HEALTHCHECK CMD wget --spider http://localhost:8080/actuator/health
```

### CI/CD Pipeline Stages

```
Build → Test → Lint → Security Scan → SonarQube → Build Image → Push → Deploy Staging
                                                                              ↓
                                                                         [Approval]
                                                                              ↓
                                                                        Deploy Production
```

## Verification

**Commands:**
- `bash scripts/setup-dev.sh` -- expected: "Setup completed successfully"
- `docker-compose config` -- expected: Validação sem erros
- `docker-compose up -d && docker-compose ps` -- expected: Todos serviços healthy
- `docker-compose down -v` -- expected: Limpeza completa

**Manual checks (if no CLI):**
- Swagger UI acessível: http://localhost:8080/api/swagger-ui.html
- Next.js acessível: http://localhost:3000
- pgAdmin acessível: http://localhost:5050
- Mailpit UI acessível: http://localhost:8025
