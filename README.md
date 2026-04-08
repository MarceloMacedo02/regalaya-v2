# Regalaya 🎁

> Plataforma Omnichannel de Presentes com IA e Integração WhatsApp

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![Java](https://img.shields.io/badge/Java-21-blue)
![Node](https://img.shields.io/badge/Node-20-blue)
![License](https://img.shields.io/badge/license-proprietary-red)

## 📋 Visão Geral

Regalaya é uma plataforma completa para gestão de presentes com:
- 🤖 **Recomendações por IA** - GPT-4 para sugestões personalizadas
- 💬 **Integração WhatsApp** - Bot conversacional e notificações
- 📦 **E-commerce Completo** - Catálogo, carrinho, checkout, pagamentos
- 📊 **Dashboard Admin** - Analytics, gestão de pedidos e clientes
- 🔔 **Lembretes Automáticos** - Datas especiais sempre lembradas

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        REGALAYA                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│   │ regalaya-web│    │ regalaya-api │    │  WhatsApp   │  │
│   │  (Next.js)  │◄──►│(Spring Boot) │◄──►│   Bot API   │  │
│   │   :3000     │    │    :8080    │    │             │  │
│   └─────────────┘    └──────┬──────┘    └─────────────┘  │
│                             │                               │
│         ┌───────────────────┼───────────────────┐          │
│         │                   │                   │          │
│   ┌─────┴─────┐      ┌─────┴─────┐      ┌─────┴─────┐   │
│   │ PostgreSQL │      │   Redis   │      │  Local    │   │
│   │   :5432   │      │   :6379   │      │  Stack    │   │
│   └───────────┘      └───────────┘      └───────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Pré-requisitos

- Docker e Docker Compose
- curl (para verificar serviços)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/regalaya.git
cd regalaya
```

### 2. Setup do ambiente

```bash
# Torne o script executável
chmod +x scripts/setup-dev.sh

# Execute o setup
./scripts/setup-dev.sh
```

### 3. Inicie os serviços

```bash
# Todos os serviços (infraestrutura + apps)
docker compose up -d

# Apenas infraestrutura (para desenvolvimento local)
docker compose up -d postgres redis mailpit
```

### 4. Acesse os serviços

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Web App | http://localhost:3000 | Aplicação Next.js |
| API | http://localhost:8080 | Backend Spring Boot |
| Swagger UI | http://localhost:8080/api/swagger-ui.html | Documentação da API |
| Mailpit | http://localhost:8025 | Servidor SMTP (dev) |
| pgAdmin | http://localhost:5050 | Admin do PostgreSQL |

## 📁 Estrutura do Projeto

```
regalaya/
├── regalaya-api/          # Backend Spring Boot (Java 21)
│   ├── src/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pom.xml
├── regalaya-web/          # Frontend Next.js 14
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── scripts/               # Scripts de automação
│   └── setup-dev.sh
├── docs/                  # Documentação (PRD, EPICS)
├── docker-compose.yml     # Compose unificado (raiz)
├── .github/
│   └── workflows/         # Pipelines CI/CD
└── .editorconfig          # Padrões de código
```

## 🔧 Desenvolvimento

### Backend (regalaya-api)

```bash
cd regalaya-api

# Compilar
mvn clean compile

# Executar testes
mvn test

# Executar aplicação
mvn spring-boot:run

# Build Docker
docker build -t regalaya-api .
```

### Frontend (regalaya-web)

```bash
cd regalaya-web

# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build

# Testes
npm test

# E2E
npx playwright test
```

## 🔄 CI/CD

| Pipeline | Trigger | Stages |
|----------|---------|--------|
| `api-ci.yml` | Push em `regalaya-api/` | Build → Test → SonarQube → Docker |
| `web-ci.yml` | Push em `regalaya-web/` | Build → Test → Lighthouse → Docker |
| `deploy.yml` | Manual/Dispatch | Pre-check → Deploy API → Deploy Web → Health Check |

### Secrets Necessários (GitHub Actions)

- `SONAR_HOST_URL` - URL do SonarQube
- `SONAR_TOKEN` - Token de autenticação SonarQube
- `AWS_ACCESS_KEY_ID` - Credenciais AWS
- `AWS_SECRET_ACCESS_KEY` - Credenciais AWS
- `AWS_REGION` - Região AWS
- `VERCEL_TOKEN` - Token Vercel
- `VERCEL_ORG_ID` - Organização Vercel
- `VERCEL_PROJECT_ID` - Projeto Vercel

## 📚 Documentação

- [PRD.md](docs/PRD.md) - Product Requirements Document
- [EPICS.md](docs/EPICS.md) - Épicos e Histórias de Usuário
- [CA.md](_bmad-output/planning-artifacts/CA.md) - Arquitetura Técnica
- [CE.md](_bmad-output/implementation-artifacts/CE.md) - Épicos Implementação

## 🛠️ Tecnologias

### Backend
- Java 21 + Spring Boot 3.4
- Spring Security + JWT
- Spring Data JPA + PostgreSQL
- Redis (cache/session)
- SpringDoc OpenAPI

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state)
- React Query (server state)

### Infraestrutura
- Docker + Docker Compose
- GitHub Actions
- SonarQube
- OWASP Dependency Check
- Lighthouse CI

## 📝 Convenções

### Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas gerais
```

### Branches

```
main          → Produção
develop       → Desenvolvimento
feature/*     → Novas funcionalidades
fix/*         → Correções
hotfix/*      → Correções urgentes
```

## ⚠️ Notas Importantes

1. **Credenciais**: Nunca commite arquivos `.env` ou credenciais reais
2. **Lombok**: O backend usa Lombok - configure seu IDE para processar anotações
3. **Erros LSP**: Alguns erros no backend são do Lombok não processado - não afetam o build

## 📞 Suporte

- Email: suporte@regalaya.com.br
- Issues: GitHub Issues

---

**Desenvolvido com ❤️ para transformar presentear em algo especial**
