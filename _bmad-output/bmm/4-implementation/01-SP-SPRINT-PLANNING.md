# SPRINT PLANNING (SP) - COMPLETO

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Aprovado  
**Artefato:** SP - Sprint Planning  
**Referência:** `../docs/EPICS.md`  

---

## 1. VISÃO GERAL DOS SPRINTS

### 1.1 Roadmap de 24 Semanas

| Sprint | Semanas | Tema | Épicos | Story Points |
|--------|---------|------|--------|--------------|
| **Sprint 1** | 1-2 | Foundation | ÉPICO 01, 02 | 34 |
| **Sprint 2** | 3-4 | Foundation + Core | ÉPICO 01, 02, 17, 18 | 42 |
| **Sprint 3** | 5-6 | Core Features | ÉPICO 03, 04, 16 | 48 |
| **Sprint 4** | 7-8 | Core Features | ÉPICO 04, 05 | 45 |
| **Sprint 5** | 9-10 | Commerce | ÉPICO 06, 14, 15 | 52 |
| **Sprint 6** | 11-12 | Commerce + WA | ÉPICO 06, 11 | 46 |
| **Sprint 7** | 13-14 | WhatsApp + IA | ÉPICO 09, 10, 11 | 50 |
| **Sprint 8** | 15-16 | WhatsApp + IA | ÉPICO 10, 11 | 44 |
| **Sprint 9** | 17-18 | Admin | ÉPICO 07, 08, 12 | 48 |
| **Sprint 10** | 19-20 | Polish | ÉPICO 12, 13, 19 | 42 |
| **Sprint 11** | 21-22 | Advanced | ÉPICO 20, 21, 22, 23 | 50 |
| **Sprint 12** | 23-24 | Production | ÉPICO 24, 25, 26, 27 | 48 |
| **TOTAL** | 24 | | **27 épicos** | **549 pts** |

### 1.2 Capacidades por Sprint

| Semana | Capacidade (pts) | Reserva (%) | Líquido |
|--------|------------------|-------------|---------|
| 1 | 20 | 15% | 17 |
| 2 | 20 | 15% | 17 |
| 3 | 20 | 15% | 17 |
| 4 | 20 | 15% | 17 |
| **Média Sprint** | **20** | **15%** | **17** |

---

## 2. DETALHAMENTO POR SPRINT

### SPRINT 1: Foundation (Semanas 1-2)

**Objetivo:** Setup inicial de infraestrutura, autenticação e DevOps

#### Tecnologias
- Backend: Spring Boot 3.2, Java 21, PostgreSQL, Redis
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- DevOps: Docker, GitHub Actions

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-01.1 | Setup de Repositórios e Estrutura | ÉPICO 01 | 5 | P0 |
| HU-01.2 | Configuração de Docker | ÉPICO 01 | 8 | P0 |
| HU-01.3 | Setup de Ambiente de Desenvolvimento | ÉPICO 01 | 5 | P0 |
| HU-02.1 | Registro de Usuário com Validação | ÉPICO 02 | 8 | P0 |
| HU-02.2 | Login com JWT | ÉPICO 02 | 8 | P0 |

**Total Sprint 1:** 34 pontos

#### Critérios de Aceite

- [ ] Repositórios configurados com CI/CD
- [ ] Docker containers executando localmente
- [ ] Usuário consegue criar conta e fazer login
- [ ] JWT funcionando com refresh token
- [ ] Testes unitários passando (>70% coverage)

#### Tarefas Técnicas Detalhadas

```
HU-01.1: Setup de Repositórios
├── Configurar monorepo ou polyrepo
├── Estruturar pastas (frontend/regalaya-web, backend/regalaya-api)
├── Configurar .gitignore
├── Criar README.md
└── Configurar editorconfig

HU-01.2: Docker
├── Criar Dockerfile api (Spring Boot)
├── Criar Dockerfile web (Next.js)
├── Criar docker-compose.yml
├── Configurar networks e volumes
└── Testar containers localmente

HU-02.1: Registro
├── Backend: POST /auth/register
├── Validação telefone/email
├── Geração OTP
├── Criar tabela users
├── Hash de senha BCrypt
├── Frontend: Página de registro
├── React Hook Form + Zod
└── Verificação OTP

HU-02.2: Login
├── Backend: POST /auth/login
├── JWT generation (15min)
├── Refresh token (7 dias)
├── Redis session store
├── Frontend: Página de login
├── Zustand auth context
└── Redirect after login
```

---

### SPRINT 2: Foundation + Autenticação (Semanas 3-4)

**Objetivo:** Completar autenticação, RBAC e setup de testes

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-01.4 | Configuração de CI/CD | ÉPICO 01 | 8 | P0 |
| HU-02.3 | Recuperação de Senha | ÉPICO 02 | 5 | P1 |
| HU-02.4 | Sistema RBAC | ÉPICO 02 | 10 | P0 |
| HU-02.5 | Refresh Token e Logout | ÉPICO 02 | 5 | P1 |
| HU-17.1 | Caching com Redis | ÉPICO 17 | 5 | P1 |
| HU-18.1 | Testes Unitários Backend | ÉPICO 18 | 5 | P1 |
| HU-18.2 | Testes de Integração | ÉPICO 18 | 4 | P2 |

**Total Sprint 2:** 42 pontos

---

### SPRINT 3: Core - Contatos e Produtos (Semanas 5-6)

**Objetivo:** Cadastro de contatos, catálogo de produtos

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-03.1 | Cadastro de Contato | ÉPICO 03 | 8 | P0 |
| HU-03.2 | Edição e Exclusão de Contato | ÉPICO 03 | 5 | P1 |
| HU-03.3 | Cadastro de Datas Especiais | ÉPICO 03 | 8 | P0 |
| HU-04.1 | Listagem de Produtos | ÉPICO 04 | 8 | P0 |
| HU-04.2 | Detalhes do Produto | ÉPICO 04 | 5 | P1 |
| HU-04.3 | Gestão de Categorias (Admin) | ÉPICO 04 | 6 | P1 |
| HU-16.1 | Criptografia de Dados | ÉPICO 16 | 5 | P1 |
| HU-16.3 | Gestão de Consentimento | ÉPICO 16 | 3 | P2 |

**Total Sprint 3:** 48 pontos

---

### SPRINT 4: Core - Catálogo e Carrinho (Semanas 7-8)

**Objetivo:** Catálogo completo, carrinho e filtros

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-04.4 | Gestão de Produtos (Admin) | ÉPICO 04 | 10 | P0 |
| HU-04.5 | Busca de Produtos | ÉPICO 04 | 6 | P1 |
| HU-05.1 | Adicionar ao Carrinho | ÉPICO 05 | 8 | P0 |
| HU-05.2 | Gerenciar Itens do Carrinho | ÉPICO 05 | 5 | P1 |
| HU-05.3 | Aplicar Cupons | ÉPICO 05 | 6 | P1 |
| HU-17.2 | Índices de Banco | ÉPICO 17 | 5 | P1 |
| HU-17.3 | CDN e Assets | ÉPICO 17 | 5 | P2 |

**Total Sprint 4:** 45 pontos

---

### SPRINT 5: Commerce - Checkout (Semanas 9-10)

**Objetivo:** Checkout completo, pagamento e frete

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-06.1 | Processo de Checkout | ÉPICO 06 | 10 | P0 |
| HU-06.2 | Integração PIX | ÉPICO 06 | 10 | P0 |
| HU-06.3 | Integração Cartão de Crédito | ÉPICO 06 | 8 | P0 |
| HU-06.4 | Cálculo de Frete | ÉPICO 06 | 6 | P1 |
| HU-14.1 | Controle de Estoque | ÉPICO 14 | 8 | P0 |
| HU-14.2 | Movimentações de Estoque | ÉPICO 14 | 5 | P1 |
| HU-15.1 | Cadastro de Endereços | ÉPICO 15 | 5 | P1 |

**Total Sprint 5:** 52 pontos

---

### SPRINT 6: Commerce - Pagamentos (Semanas 11-12)

**Objetivo:** Webhooks, confirmação e início WhatsApp

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-07.1 | Listagem de Pedidos (Admin) | ÉPICO 07 | 6 | P0 |
| HU-07.2 | Detalhes do Pedido (Admin) | ÉPICO 07 | 5 | P1 |
| HU-07.3 | Alteração de Status | ÉPICO 07 | 6 | P0 |
| HU-07.4 | Processamento de Reembolso | ÉPICO 07 | 5 | P1 |
| HU-11.1 | Menu Inicial do Bot | ÉPICO 11 | 8 | P0 |
| HU-14.3 | Alertas de Estoque | ÉPICO 14 | 5 | P1 |
| HU-15.3 | Validação de CEP | ÉPICO 15 | 3 | P2 |
| HU-23.1 | Webhook de Pagamento | ÉPICO 23 | 8 | P0 |

**Total Sprint 6:** 46 pontos

---

### SPRINT 7: WhatsApp + IA (Semanas 13-14)

**Objetivo:** Bot WhatsApp completo e recomendações de IA

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-09.1 | Agendamento de Notificações | ÉPICO 09 | 8 | P0 |
| HU-09.2 | Envio via WhatsApp | ÉPICO 09 | 8 | P0 |
| HU-10.1 | Recomendação por Perfil | ÉPICO 10 | 10 | P0 |
| HU-10.2 | Geração de Mensagem | ÉPICO 10 | 8 | P0 |
| HU-11.2 | Cadastro via WhatsApp | ÉPICO 11 | 6 | P1 |
| HU-11.3 | Sugestões via WhatsApp | ÉPICO 11 | 5 | P1 |

**Total Sprint 7:** 50 pontos

---

### SPRINT 8: WhatsApp + IA Avançado (Semanas 15-16)

**Objetivo:** RAG, lim

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-10.3 | RAG (Recuperação) | ÉPICO 10 | 10 | P0 |
| HU-10.4 | Limite de Uso de IA | ÉPICO 10 | 5 | P1 |
| HU-11.4 | Agendamento de Mensagem | ÉPICO 11 | 6 | P1 |
| HU-09.3 | Envio de Email Transacional | ÉPICO 09 | 5 | P1 |
| HU-15.2 | Coleta Endereço WhatsApp | ÉPICO 15 | 5 | P1 |
| HU-16.2 | Proteção contra Ataques | ÉPICO 16 | 5 | P1 |
| HU-16.4 | Mascaramento de Logs | ÉPICO 16 | 3 | P2 |
| HU-17.4 | Lazy Loading | ÉPICO 17 | 5 | P2 |

**Total Sprint 8:** 44 pontos

---

### SPRINT 9: Admin - Dashboard (Semanas 17-18)

**Objetivo:** Dashboard completo e gestão de clientes

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-12.1 | Dashboard Principal | ÉPICO 12 | 8 | P0 |
| HU-12.2 | Gráfico de Vendas | ÉPICO 12 | 5 | P1 |
| HU-12.3 | Produtos Mais Vendidos | ÉPICO 12 | 5 | P1 |
| HU-08.1 | Listagem de Clientes | ÉPICO 08 | 6 | P0 |
| HU-08.2 | Histórico de Compras | ÉPICO 08 | 6 | P1 |
| HU-08.3 | Comunicação em Massa | ÉPICO 08 | 8 | P1 |
| HU-14.4 | Gestão de Fornecedores | ÉPICO 14 | 5 | P2 |
| HU-18.3 | Testes E2E | ÉPICO 18 | 5 | P2 |

**Total Sprint 9:** 48 pontos

---

### SPRINT 10: Polish (Semanas 19-20)

**Objetivo:** Conteúdo, SEO e refinamentos

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-12.4 | Funil de Vendas | ÉPICO 12 | 5 | P1 |
| HU-12.5 | Cohort Analysis | ÉPICO 12 | 5 | P2 |
| HU-13.1 | Gestão de Banners | ÉPICO 13 | 6 | P1 |
| HU-13.2 | Páginas Institucionais | ÉPICO 13 | 5 | P2 |
| HU-13.3 | Configurações da Loja | ÉPICO 13 | 5 | P1 |
| HU-19.1 | SEO On-Page | ÉPICO 19 | 8 | P0 |
| HU-19.2 | URLs Amigáveis | ÉPICO 19 | 3 | P1 |
| HU-19.3 | Core Web Vitals | ÉPICO 19 | 5 | P1 |

**Total Sprint 10:** 42 pontos

---

### SPRINT 11: Advanced (Semanas 21-22)

**Objetivo:** Wishlist, Fidelidade, Rastreamento

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-20.1 | Criar Wishlist | ÉPICO 20 | 6 | P1 |
| HU-20.2 | Compartilhar Wishlist | ÉPICO 20 | 5 | P2 |
| HU-21.1 | Acumular Pontos | ÉPICO 21 | 6 | P1 |
| HU-21.2 | Resgatar Pontos | ÉPICO 21 | 5 | P1 |
| HU-22.1 | Rastreamento via API | ÉPICO 22 | 6 | P0 |
| HU-22.2 | Notificação de Entrega | ÉPICO 22 | 5 | P1 |
| HU-23.2 | Webhook de Entrega | ÉPICO 23 | 5 | P1 |
| HU-23.3 | Gerenciamento Webhooks | ÉPICO 23 | 6 | P2 |
| HU-24.1 | i18n Backend | ÉPICO 24 | 3 | P2 |
| HU-24.2 | i18n Frontend | ÉPICO 24 | 3 | P2 |

**Total Sprint 11:** 50 pontos

---

### SPRINT 12: Production (Semanas 23-24)

**Objetivo:** Deploy AWS, Chat, Relatórios, Beta

#### Histórias Priorizadas

| ID | História | Épico | Pontos | Priority |
|----|----------|-------|--------|----------|
| HU-25.1 | Chat ao Vivo | ÉPICO 25 | 8 | P2 |
| HU-25.2 | Painel do Agente | ÉPICO 25 | 6 | P2 |
| HU-26.1 | Relatórios Customizados | ÉPICO 26 | 6 | P1 |
| HU-26.2 | Exportação de Dados | ÉPICO 26 | 5 | P1 |
| HU-27.1 | Infraestrutura como Código | ÉPICO 27 | 8 | P0 |
| HU-27.2 | Deploy Contínuo | ÉPICO 27 | 8 | P0 |
| HU-27.3 | Monitoramento e Logs | ÉPICO 27 | 4 | P1 |
| HU-27.4 | Backup e DR | ÉPICO 27 | 3 | P1 |

**Total Sprint 12:** 48 pontos

---

## 3. CRONOGRAMA VISUAL

```
2026 ──────────────────────────────────────────────────────────────────────
      Abr                            Mai                            Jun
      07  14  21  28   05  12  19  26   02  09  16  23  30   06  13  20  27
      ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤
S1   │Sprint 1 │ │Sprint 2 │ │Sprint 3 │ │Sprint 4 │ │Sprint 5 │ │Sprint 6 │
      │Foundation│ │Foundation│ │ Core    │ │ Core    │ │ Commerce│ │ Commerce│
      └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘

2026 ──────────────────────────────────────────────────────────────────────
      Jun                            Jul                            Ago
      04  11  18  25   02  09  16  23  30   06  13  20  27   03  10  17  24
      ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤
S2   │Sprint 7 │ │Sprint 8 │ │Sprint 9 │ │Sprint 10│ │Sprint 11│ │Sprint 12│
      │WhatsApp │ │WhatsApp │ │ Admin   │ │ Polish  │ │Advanced │ │Production│
      │   +IA   │ │   +IA   │ │         │ │         │ │         │ │         │
      └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
                                                                              │
                                                                              ▼
                                                                         BETA
                                                                         50 users
```

---

## 4. DEFINIÇÃO DE PRONTO (Definition of Done)

### 4.1 Critérios Técnicos

| Critério | Descrição | Ferramenta |
|----------|-----------|-------------|
| Código | Implementação completa | Git |
| Testes | Unitários >70%, Integração >50% | JUnit, Mockito |
| Lint | Sem errors, warnings < 10 | ESLint, Checkstyle |
| Build | Compila sem erros | Maven/Gradle, npm |
| Deploy | Deploy em staging automático | GitHub Actions |

### 4.2 Critérios Funcionais

| Critério | Descrição |
|----------|-----------|
| Acceptance Criteria | 100% dos critérios de aceite satisfeitos |
| Revisão | Code review por pelo menos 1 desenvolvedor |
| Testes E2E | Cenários críticos automatizados |
| Acessibilidade | WCAG 2.1 AA compliance |
| Performance | Lighthouse > 90 |

### 4.3 Critérios de Documentação

| Critério | Descrição |
|----------|-----------|
| API Docs | OpenAPI/Swagger atualizado |
| README | Instruções de setup atualizadas |
| CHANGELOG | Entrada de changelog adicionada |

---

## 5. RISK MANAGEMENT

### 5.1 Riscos Identificados

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|---------------|---------|-----------|
| R01 | Integração WhatsApp API | Alta | Alto | Templates pré-aprovados |
| R02 | Custo OpenAI elevado | Média | Médio | Cache agressivo, rate limits |
| R03 | Dívida técnica acumulada | Média | Médio | Sprint de refatoração |
| R04 | Turnover de equipe | Baixa | Alto | Documentação extensiva |
| R05 | Performance pgvector | Baixa | Médio | Índices otimizados |

### 5.2 Buffer de Contingência

| Sprint | Story Points Planejados | Buffer (15%) | Total |
|--------|-------------------------|--------------|-------|
| Cada Sprint | 34-52 | 5-8 | ~45-60 |

---

## 6. EQUIPE E PAPÉIS

| Papel | Responsável | Disponibilidade |
|-------|------------|-----------------|
| Tech Lead | ________________ | 100% |
| Backend Developer | ________________ | 100% |
| Frontend Developer | ________________ | 100% |
| Designer UX | ________________ | 50% |
| QA | ________________ | 50% |
| DevOps | ________________ | 25% |

---

## 7. CERIMÔNIAS

| Cerimônia | Frequência | Duração | Participantes |
|-----------|-------------|---------|---------------|
| Sprint Planning | A cada 2 semanas | 4h | Time completo |
| Daily Standup | Diário | 15min | Time completo |
| Sprint Review | A cada 2 semanas | 1h | Time + Stakeholders |
| Sprint Retrospective | A cada 2 semanas | 1h | Time completo |
| Backlog Refinement | Semanal | 1h | Dev + PO |

---

**Documento criado:** 07 de abril de 2026  
**Versão:** 1.0  
**Status:** Aprovado
