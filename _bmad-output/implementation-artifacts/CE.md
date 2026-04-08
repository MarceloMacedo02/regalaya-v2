# REGALAYA - Épicos, Histórias e Tarefas

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Pronto para planejamento  
**Conformidade:** PRD.md v1.0  

---

## VISÃO GERAL

Este documento contém o planejamento completo de épicos, histórias de usuário e tarefas técnicas para o desenvolvimento da plataforma Regalaya. O planejamento está em conformidade direta com o PRD.md e garante no mínimo 25 épicos com histórias e tarefas bem definidas.

### Referências
- **PRD.md:** `C:\projetos\parnaiba\presentes\regalaya01\docs\PRD.md`
- **Frontend Web:** `regalaya-web/`
- **Backend API:** `regalaya-api/`
- **Frontend Admin:** `regalaya-admin/`

### Contagem Total
| Categoria | Quantidade |
|----------|------------|
| **Épicos** | 27 |
| **Histórias de Usuário** | 145+ |
| **Tarefas Técnicas** | 400+ |

---

## ÉPICO 01: Configuração de Infraestrutura e DevOps

**Descrição:** Setup inicial de infraestrutura, CI/CD, containers e ambientes.

### Histórias de Usuário

#### HU-01.1: Setup de Repositórios e Estrutura Base
**Como** desenvolvedor, **quero** repositórios Git organizados e estrutura base padronizada, **para** garantir consistência no desenvolvimento.

**Tarefas:**
- [ ] Configurar repositório Git principal (monorepo ou polyrepo)
- [ ] Criar estrutura de pastas conforme PRD (frontend/regalaya-web, backend/regalaya-api)
- [ ] Configurar .gitignore com padrões Java/Node
- [ ] Criar README.md com instruções de setup
- [ ] Configurar editorconfig para padronização de código

#### HU-01.2: Configuração de Docker e Docker Compose
**Como** DevOps, **quero** containers Docker para todos os serviços, **para** garantir ambiente consistente de desenvolvimento e produção.

**Tarefas:**
- [ ] Criar Dockerfile para Spring Boot (regalaya-api)
- [ ] Criar Dockerfile para Next.js (regalaya-web)
- [ ] Criar Dockerfile para Next.js Admin (regalaya-admin)
- [ ] Criar docker-compose.yml com todos os serviços
- [ ] Configurar volumes para persistência de dados
- [ ] Configurar redes Docker internas
- [ ] Criar scripts de build e start

#### HU-01.3: Setup de Ambiente de Desenvolvimento
**Como** desenvolvedor, **quero** ambiente de desenvolvimento configurado, **para** começar a implementar funcionalidades rapidamente.

**Tarefas:**
- [ ] Documentar requisitos (Java 21, Node 20+, PostgreSQL 15+)
- [ ] Criar script de setup automático (setup-dev.sh)
- [ ] Configurar variáveis de ambiente (.env.example)
- [ ] Criar esquema inicial do banco de dados
- [ ] Configurar migrations Flyway/Liquibase
- [ ] Seed de dados iniciais para desenvolvimento

#### HU-01.4: Configuração de CI/CD
**Como** DevOps, **quero** pipeline CI/CD automatizado, **para** garantir qualidade e velocidade no deploy.

**Tarefas:**
- [ ] Configurar GitHub Actions ou similar
- [ ] Criar workflow de build (compile, test, lint)
- [ ] Criar workflow de deploy (staging/production)
- [ ] Configurar quality gates (SonarQube)
- [ ] Configurar notificações de CI (Slack/Email)

---

## ÉPICO 02: Autenticação e Autorização

**Descrição:** Sistema completo de autenticação (JWT, OAuth, 2FA) e controle de acesso (RBAC).

### Histórias de Usuário

#### HU-02.1: Registro de Usuário com Validação
**Como** visitante, **quero** me registrar com telefone e email, **para** criar minha conta na plataforma.

**Tarefas:**
- [ ] **Backend:** Implementar endpoint POST /auth/register (regalaya-api)
- [ ] **Backend:** Validar telefone brasileiro (DDD + 9 dígitos)
- [ ] **Backend:** Validar formato de email
- [ ] **Backend:** Implementar geração de código OTP (6 dígitos)
- [ ] **Backend:** Enviar OTP via SMS/WhatsApp
- [ ] **Backend:** Criar tabela users com campos do PRD
- [ ] **Backend:** Implementar rate limiting (100 req/min)
- [ ] **Backend:** Hash de senha com BCrypt
- [ ] **Frontend:** Criar página de registro
- [ ] **Frontend:** Implementar validação de formulário (React Hook Form + Zod)
- [ ] **Frontend:** Implementar verificação de OTP
- [ ] **Frontend:** Tratar erros de validação
- [ ] **REMOVE-MOCK:** Substituir mock de usuários por chamadas reais à API
- [ ] **TESTES:** Unit tests para validação, Integration tests para endpoint

#### HU-02.2: Login com JWT
**Como** usuário, **quero** fazer login com credenciais, **para** acessar minha conta.

**Tarefas:**
- [ ] **Backend:** Implementar endpoint POST /auth/login
- [ ] **Backend:** Validar credenciais
- [ ] **Backend:** Gerar JWT (15min expiration)
- [ ] **Backend:** Gerar refresh token (rotativo)
- [ ] **Backend:** Armazenar tokens no Redis
- [ ] **Backend:** Registrar last_login_at
- [ ] **Frontend:** Criar página de login
- [ ] **Frontend:** Implementar storage seguro de tokens
- [ ] **Frontend:** Criar context de autenticação (React Context/Zustand)
- [ ] **Frontend:** Implementar redirect após login
- [ ] **Frontend:** Mostrar loading states
- [ ] **REMOVE-MOCK:** Substituir mock de login por autenticação real
- [ ] **TESTES:** Testar fluxo completo de autenticação

#### HU-02.3: Recuperação de Senha
**Como** usuário, **quero** recuperar minha senha, **para** acessar minha conta quando esquecer.

**Tarefas:**
- [ ] **Backend:** Implementar POST /auth/forgot-password
- [ ] **Backend:** Validar email/telefone existe
- [ ] **Backend:** Gerar token de reset (UUID)
- [ ] **Backend:** Enviar email/SMS com link
- [ ] **Backend:** Implementar POST /auth/reset-password
- [ ] **Backend:** Validar token (expiração 1h)
- [ ] **Backend:** Atualizar senha com hash
- [ ] **Frontend:** Criar página "Esqueci minha senha"
- [ ] **Frontend:** Criar página de reset com token
- [ ] **Frontend:** Implementar validação de nova senha
- [ ] **TESTES:** Testar fluxo completo de recuperação

#### HU-02.4: Sistema RBAC (Roles e Permissões)
**Como** admin, **quero** controlar permissões por usuário, **para** garantir segurança.

**Tarefas:**
- [ ] **Backend:** Criar tabela roles (USER, ADMIN, MANAGER, VIEWER)
- [ ] **Backend:** Criar tabela permissions
- [ ] **Backend:** Implementar ManyToMany User-Role
- [ ] **Backend:** Implementar @PreAuthorize em controllers
- [ ] **Backend:** Criar filtro de segurança (SecurityFilterChain)
- [ ] **Backend:** Implementar JWT decoder para extrair roles
- [ ] **Frontend:** Criar página de gestão de usuários admin
- [ ] **Frontend:** Implementar seletor de roles
- [ ] **Frontend:** Implementar proteção de rotas por role
- [ ] **Frontend:** Mostrar/esconder funcionalidades baseado em permissões
- [ ] **TESTES:** Testar acesso negado para roles insuficientes

#### HU-02.5: Refresh Token e Logout
**Como** usuário, **quero** que minha sessão persista, **para** não precisar fazer login constantemente.

**Tarefas:**
- [ ] **Backend:** Implementar endpoint POST /auth/refresh
- [ ] **Backend:** Validar refresh token não expirado
- [ ] **Backend:** Invalidar old refresh token (rotativo)
- [ ] **Backend:** Gerar novos access + refresh tokens
- [ ] **Backend:** Implementar POST /auth/logout
- [ ] **Backend:** Invalidar tokens no Redis
- [ ] **Frontend:** Interceptar 401 e tentar refresh
- [ ] **Frontend:** Implementar logout global
- [ ] **Frontend:** Limpar tokens do storage
- [ ] **REMOVE-MOCK:** Garantir que auth não usa dados mockados

---

## ÉPICO 03: Gestão de Pessoas Queridas (Contatos)

**Descrição:** CRUD completo de contatos/pessoas queridas para o monitoramento de datas especiais.

### Histórias de Usuário

#### HU-03.1: Cadastro de Contato
**Como** usuário, **quero** cadastrar uma pessoa querida, **para** nunca esquecer datas importantes.

**Tarefas:**
- [ ] **Backend:** Criar tabela contacts conforme PRD (id, user_id, name, phone, whatsapp_id, consent)
- [ ] **Backend:** Implementar endpoint POST /contacts
- [ ] **Backend:** Validar consentimento (LGPD)
- [ ] **Backend:** Criar endpoint GET /contacts (lista do usuário)
- [ ] **Backend:** Implementar soft delete
- [ ] **Backend:** Indexar phone para busca
- [ ] **Frontend:** Criar página "Minhas Pessoas"
- [ ] **Frontend:** Criar modal/formulário de cadastro
- [ ] **Frontend:** Implementar captura de contato WhatsApp
- [ ] **Frontend:** Exibir lista de contatos
- [ ] **Frontend:** Implementar busca/filtragem
- [ ] **REMOVE-MOCK:** Substituir mock-contacts por API real
- [ ] **TESTES:** CRUD completo de contacts

#### HU-03.2: Edição e Exclusão de Contato
**Como** usuário, **quero** editar e excluir contatos, **para** manter meus dados atualizados.

**Tarefas:**
- [ ] **Backend:** Implementar PUT /contacts/{id}
- [ ] **Backend:** Implementar DELETE /contacts/{id} (soft delete)
- [ ] **Backend:** Validar ownership (contato pertence ao usuário)
- [ ] **Backend:** Tratar cascade em special_dates
- [ ] **Frontend:** Criar modal de edição
- [ ] **Frontend:** Implementar confirmação de exclusão
- [ ] **Frontend:** Atualizar lista após alteração
- [ ] **TESTES:** Testar validação de ownership

#### HU-03.3: Cadastro de Datas Especiais
**Como** usuário, **quero** cadastrar datas importantes de cada pessoa, **para** receber lembretes.

**Tarefas:**
- [ ] **Backend:** Criar tabela special_dates (id, contact_id, type, date, recurrence)
- [ ] **Backend:** Implementar tipos: BIRTHDAY, ANNIVERSARY, CHRISTMAS, WEDDING
- [ ] **Backend:** Implementar recorrência: YEARLY, MONTHLY, ONCE
- [ ] **Backend:** Endpoint POST /contacts/{contactId}/dates
- [ ] **Backend:** Endpoint GET /contacts/{contactId}/dates
- [ ] **Backend:** Endpoint PUT /dates/{id}
- [ ] **Backend:** Endpoint DELETE /dates/{id}
- [ ] **Frontend:** Criar seção de datas no perfil do contato
- [ ] **Frontend:** Criar seletor de tipo de data
- [ ] **Frontend:** Implementar seletor de recorrência
- [ ] **Frontend:** Exibir countdown para próximas datas
- [ ] **REMOVE-MOCK:** Substituir dados mock de special_dates
- [ ] **TESTES:** Testar recorrência automática

#### HU-03.4: Importação de Contatos
**Como** usuário, **quero** importar contatos da agenda, **para** cadastrar várias pessoas rapidamente.

**Tarefas:**
- [ ] **Backend:** Implementar endpoint POST /contacts/import (batch)
- [ ] **Backend:** Validar formato (vCard, JSON array)
- [ ] **Backend:** Limitar a 100 contatos por importação
- [ ] **Backend:** Retornar relatório de sucesso/erro
- [ ] **Frontend:** Implementar upload de arquivo
- [ ] **Frontend:** Parse de vCard/JONS
- [ ] **Frontend:** Preview antes de confirmar
- [ ] **Frontend:** Exibir progresso da importação
- [ ] **TESTES:** Testar vários formatos de importação

---

## ÉPICO 04: Catálogo de Produtos

**Descrição:** Gestão completa de produtos com catálogo, categorias, busca e filtros.

### Histórias de Usuário

#### HU-04.1: Listagem de Produtos
**Como** visitante, **quero** ver o catálogo de produtos, **para** descobrir presentes.

**Tarefas:**
- [ ] **Backend:** Implementar GET /products (paginação)
- [ ] **Backend:** Implementar filtros: categoria, preço, disponibilidade
- [ ] **Backend:** Implementar ordenação: preço, nome, popularidade
- [ ] **Backend:** Criar índices otimizados para busca
- [ ] **Backend:** Cachear resultados frequentes (Redis)
- [ ] **Frontend:** Criar página de catálogo
- [ ] **Frontend:** Implementar grid responsivo de produtos
- [ ] **Frontend:** Implementar paginação infinita ou por páginas
- [ ] **Frontend:** Exibir skeleton durante loading
- [ ] **Frontend:** Implementar filtros laterais (sidebar)
- [ ] **Frontend:** Exibir contador de resultados
- [ ] **REMOVE-MOCK:** Substituir mock-products por API real
- [ ] **TESTES:** Testar performance com 100+ produtos

#### HU-04.2: Detalhes do Produto
**Como** visitante, **quero** ver detalhes completos de um produto, **para** decidir se é um bom presente.

**Tarefas:**
- [ ] **Backend:** Implementar GET /products/{id}
- [ ] **Backend:** Implementar GET /products/slug/{slug}
- [ ] **Backend:** Retornar imagens múltiplas
- [ ] **Backend:** Verificar disponibilidade em tempo real
- [ ] **Backend:** Calcular preço com desconto
- [ ] **Frontend:** Criar página de detalhes do produto
- [ ] **Frontend:** Implementar galeria de imagens (carousel)
- [ ] **Frontend:** Exibir informações lengkapas (descrição, preço)
- [ ] **Frontend:** Implementar seletor de quantidade
- [ ] **Frontend:** Exibir produtos relacionados
- [ ] **Frontend:** Implementar breadcrumb de navegação
- [ ] **REMOVE-MOCK:** Garantir dados reais do produto

#### HU-04.3: Gestão de Categorias (Admin)
**Como** admin, **quero** gerenciar categorias de produtos, **para** organizar o catálogo.

**Tarefas:**
- [ ] **Backend:** Criar CRUD completo de categories
- [ ] **Backend:** Implementar hierarquia de categorias (parent_id)
- [ ] **Backend:** Endpoint GET /categories (árvore)
- [ ] **Backend:** Endpoint POST/PUT/DELETE /admin/categories
- [ ] **Frontend Admin:** Criar página de gestão de categorias
- [ ] **Frontend Admin:** Implementar tree view de categorias
- [ ] **Frontend Admin:** Criar modal de edição
- [ ] **Frontend Admin:** Implementar drag-and-drop para reordenar
- [ ] **TESTES:** Testar hierarquia de categorias

#### HU-04.4: Gestão de Produtos (Admin)
**Como** admin, **quero** gerenciar produtos (CRUD completo), **para** manter o catálogo atualizado.

**Tarefas:**
- [ ] **Backend:** CRUD completo de products
- [ ] **Backend:** Upload de imagens (S3/Cloudinary)
- [ ] **Backend:** Gerenciamento de estoque
- [ ] **Backend:** Campos: name, description, price, category_id, images, in_stock, metadata (JSONB)
- [ ] **Frontend Admin:** Dashboard de produtos
- [ ] **Frontend Admin:** Tabela com paginação e filtros
- [ ] **Frontend Admin:** Formulário de criação/edição
- [ ] **Frontend Admin:** Upload de múltiplas imagens
- [ ] **Frontend Admin:** Preview do produto
- [ ] **REMOVE-MOCK:** Substituir mock-inventory-data por API real

#### HU-04.5: Busca de Produtos
**Como** visitante, **quero** buscar produtos por nome/descrição, **para** encontrar rapidamente.

**Tarefas:**
- [ ] **Backend:** Implementar GET /products/search?q={query}
- [ ] **Backend:** Usar ILIKE ou full-text search (PostgreSQL)
- [ ] **Backend:** Implementar autocomplete (sugestões)
- [ ] **Backend:** Cachear queries frequentes
- [ ] **Frontend:** Criar barra de busca no header
- [ ] **Frontend:** Implementar debounce (300ms)
- [ ] **Frontend:** Exibir sugestões em tempo real (autocomplete)
- [ ] **Frontend:** Exibir página de resultados
- [ ] **Frontend:** Destacar termos encontrados
- [ ] **TESTES:** Testar performance de busca

---

## ÉPICO 05: Carrinho de Compras

**Descrição:** Sistema de carrinho persistente com gerenciamento de itens.

### Histórias de Usuário

#### HU-05.1: Adicionar ao Carrinho
**Como** usuário, **quero** adicionar produtos ao carrinho, **para** selecionar presentes.

**Tarefas:**
- [ ] **Backend:** Criar tabela cart_items (id, user_id, product_id, quantity)
- [ ] **Backend:** Endpoint POST /cart/items
- [ ] **Backend:** Validar estoque disponível
- [ ] **Backend:** Calcular totals (subtotal, frete, desconto)
- [ ] **Backend:** Merge de itens duplicados
- [ ] **Frontend:** Implementar botão "Adicionar ao carrinho"
- [ ] **Frontend:** Criar drawer/slide de carrinho
- [ ] **Frontend:** Exibir feedback visual (toast/success)
- [ ] **Frontend:** Atualizar contador no header
- [ ] **Frontend:** Persistir carrinho no localStorage (backup)
- [ ] **REMOVE-MOCK:** Substituir dados mock de carrinho
- [ ] **TESTES:** Testar merge de itens duplicados

#### HU-05.2: Gerenciar Itens do Carrinho
**Como** usuário, **quero** alterar quantidade e remover itens, **para** ajustar minha seleção.

**Tarefas:**
- [ ] **Backend:** Endpoint PUT /cart/items/{id} (atualizar quantidade)
- [ ] **Backend:** Endpoint DELETE /cart/items/{id}
- [ ] **Backend:** Endpoint DELETE /cart (esvaziar)
- [ ] **Backend:** Endpoint GET /cart (visualizar)
- [ ] **Backend:** Recalcular totals em cada alteração
- [ ] **Frontend:** Incrementar/decrementar quantidade
- [ ] **Frontend:** Botão de remover item
- [ ] **Frontend:** Botão "Limpar carrinho"
- [ ] **Frontend:** Exibir subtotal atualizado
- [ ] **TESTES:** Testar recalculo de totals

#### HU-05.3: Aplicar Cupons de Desconto
**Como** usuário, **quero** aplicar cupons de desconto, **para** economizar.

**Tarefas:**
- [ ] **Backend:** Criar tabela coupons (code, discount_type, value, min_value, valid_until)
- [ ] **Backend:** Endpoint POST /cart/apply-coupon
- [ ] **Backend:** Validar cupom (existência, validade, valor mínimo)
- [ ] **Backend:** Calcular desconto (porcentagem ou valor fixo)
- [ ] **Backend:** Registrar uso do cupom
- [ ] **Frontend:** Campo de input para cupom
- [ ] **Frontend:** Botão "Aplicar"
- [ ] **Frontend:** Exibir desconto aplicado
- [ ] **Frontend:** Mensagem de erro para cupom inválido
- [ ] **TESTES:** Testar vários tipos de cupom

---

## ÉPICO 06: Checkout e Pagamento

**Descrição:** Processo completo de finalização de compra com múltiplas formas de pagamento.

### Histórias de Usuário

#### HU-06.1: Processo de Checkout
**Como** usuário, **quero** finalizar minha compra em até 3 passos, **para** comprar rapidamente.

**Tarefas:**
- [ ] **Backend:** Criar tabela orders (conforme PRD)
- [ ] **Backend:** Endpoint POST /orders (criar pedido)
- [ ] **Backend:** Validar carrinho e estoque
- [ ] **Backend:** Calcular frete baseado no endereço
- [ ] **Backend:** Aplicar descontos (cupons)
- [ ] **Backend:** Calcular total final
- [ ] **Frontend:** Criar página de checkout multi-step
- [ ] **Frontend:** Step 1: Revisão do carrinho
- [ ] **Frontend:** Step 2: Endereço de entrega
- [ ] **Frontend:** Step 3: Pagamento
- [ ] **Frontend:** Progress bar entre steps
- [ ] **Frontend:** Persistir dados entre steps
- [ ] **REMOVE-MOCK:** Substituir fluxo mock por API real
- [ ] **TESTES:** Testar fluxo completo de checkout

#### HU-06.2: Integração PIX
**Como** usuário, **quero** pagar com PIX, **para** ter agilidade e desconto.

**Tarefas:**
- [ ] **Backend:** Integrar API de pagamento (Mercado Pago/Stripe)
- [ ] **Backend:** Gerar QR Code PIX
- [ ] **Backend:** Endpoint para verificar status do pagamento
- [ ] **Backend:** Webhook para notificação de pagamento
- [ ] **Backend:** Atualizar status do pedido (PENDING → PAID)
- [ ] **Frontend:** Exibir QR Code
- [ ] **Frontend:** Countdown para expiração
- [ ] **Frontend:** Polling de status (a cada 5s)
- [ ] **Frontend:** Página de sucesso/falha
- [ ] **TESTES:** Testar fluxo PIX completo

#### HU-06.3: Integração Cartão de Crédito
**Como** usuário, **quero** pagar com cartão de crédito, **para** parcelar minhas compras.

**Tarefas:**
- [ ] **Backend:** Implementar tokenização de cartão (Stripe Elements/MercadoPago SDK)
- [ ] **Backend:** Processar pagamento com parcelamento
- [ ] **Backend:** Tratar aprovações e recusas
- [ ] **Backend:** Registrar transaction_id
- [ ] **Frontend:** Formulário de cartão (Número, CVV, validade, nome)
- [ ] **Frontend:** Seletor de parcelas
- [ ] **Frontend:** Validação em tempo real
- [ ] **Frontend:** Feedback de sucesso/erro
- [ ] **TESTES:** Testar pagamentos com diferentes cartões

#### HU-06.4: Cálculo de Frete
**Como** sistema, **quero** calcular o frete automaticamente, **para** mostrar opções ao usuário.

**Tarefas:**
- [ ] **Backend:** Integrar API Correios (calculaPrecoPrazo)
- [ ] **Backend:** Integrar API Loggi
- [ ] **Backend:** Endpoint POST /shipping/calculate
- [ ] **Backend:** Parâmetros: CEP, peso, dimensões
- [ ] **Backend:** Retornar opções com prazo e preço
- [ ] **Backend:** Implementar cálculo de frete grátis (mínimo R$ 299,90)
- [ ] **Frontend:** Exibir opções de frete
- [ ] **Frontend:** Seletor de método de entrega
- [ ] **Frontend:** Atualizar total com frete
- [ ] **Frontend:** Exibir prazo de entrega
- [ ] **TESTES:** Testar cálculo com diferentes CEPs

---

## ÉPICO 07: Gestão de Pedidos (Backend)

**Descrição:** Backoffice completo para gerenciamento de pedidos.

### Histórias de Usuário

#### HU-07.1: Listagem de Pedidos (Admin)
**Como** admin, **quero** visualizar todos os pedidos, **para** acompanhar as vendas.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/orders (com filtros)
- [ ] **Backend:** Filtros: status, data, cliente, valor
- [ ] **Backend:** Paginação
- [ ] **Backend:** Ordenação por data/valor
- [ ] **Backend:** Exportar para CSV/Excel
- [ ] **Frontend Admin:** Dashboard de pedidos
- [ ] **Frontend Admin:** Tabela com filtros
- [ ] **Frontend Admin:** Status badges coloridos
- [ ] **Frontend Admin:** Quick actions (visualizar, alterar status)
- [ ] **REMOVE-MOCK:** Substituir mock-orders por API real
- [ ] **TESTES:** Testar filtros e paginação

#### HU-07.2: Detalhes do Pedido (Admin)
**Como** admin, **quero** ver detalhes completos de um pedido, **para** investigar problemas.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/orders/{id}
- [ ] **Backend:** Retornar: cliente, itens, endereço, pagamento, histórico de status
- [ ] **Backend:** Traking code se houver
- [ ] **Frontend Admin:** Página de detalhes do pedido
- [ ] **Frontend Admin:** Timeline de status
- [ ] **Frontend Admin:** Dados do cliente
- [ ] **Frontend Admin:** Dados do pagamento
- [ ] **Frontend Admin:** Endereço de entrega
- [ ] **TESTES:** Testar visualização completa

#### HU-07.3: Alteração de Status de Pedido
**Como** admin, **quero** alterar o status de um pedido, **para** atualizar o cliente.

**Tarefas:**
- [ ] **Backend:** Endpoint PATCH /admin/orders/{id}/status
- [ ] **Backend:** Fluxo: PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
- [ ] **Backend:** Também: CANCELLED, REFUNDED
- [ ] **Backend:** Registrar histórico de alteração
- [ ] **Backend:** Enviar notificação ao cliente (email/WhatsApp)
- [ ] **Frontend Admin:** Botões de ação por status
- [ ] **Frontend Admin:** Modal de alteração com observação
- [ ] **Frontend Admin:** Confirmação antes de alterar
- [ ] **TESTES:** Testar transições de status

#### HU-07.4: Processamento de Reembolso
**Como** admin, **quero** processar reembolsos, **para** resolver problemas de pagamento.

**Tarefas:**
- [ ] **Backend:** Endpoint POST /admin/orders/{id}/refund
- [ ] **Backend:** Reembolso parcial ou total
- [ ] **Backend:** Integrar com API de pagamento (estorno)
- [ ] **Backend:** Registrar justificativa
- [ ] **Backend:** Atualizar status para REFUNDED
- [ ] **Backend:** Enviar confirmação ao cliente
- [ ] **Frontend Admin:** Formulário de reembolso
- [ ] **Frontend Admin:** Seletor de tipo (parcial/total)
- [ ] **Frontend Admin:** Campo de justificativa
- [ ] **Frontend Admin:** Confirmação com valor
- [ ] **TESTES:** Testar estorno PIX e cartão

---

## ÉPICO 08: Gestão de Clientes (Admin)

**Descrição:** Backoffice para gerenciamento de clientes e comunicação.

### Histórias de Usuário

#### HU-08.1: Listagem de Clientes (Admin)
**Como** admin, **quero** visualizar todos os clientes, **para** conhecer minha base.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/customers
- [ ] **Backend:** Filtros: status, data de cadastro, pedidos
- [ ] **Backend:** Campos: id, name, email, phone, total_orders, total_spent
- [ ] **Frontend Admin:** Tabela de clientes
- [ ] **Frontend Admin:** Filtros e busca
- [ ] **Frontend Admin:** Colunas customizáveis
- [ ] **REMOVE-MOCK:** Substituir mock-customers
- [ ] **TESTES:** Testar busca e filtros

#### HU-08.2: Histórico de Compras (Admin)
**Como** admin, **quero** ver o histórico de compras de cada cliente, **para** entender o comportamento.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/customers/{id}/orders
- [ ] **Backend:** Agregar métricas (LTV, frequência)
- [ ] **Backend:** Segmentação automática (VIP, novo, inativo)
- [ ] **Frontend Admin:** Página de perfil do cliente
- [ ] **Frontend Admin:** Lista de pedidos
- [ ] **Frontend Admin:** Gráficos de comportamento
- [ ] **Frontend Admin:** Tags de segmento

#### HU-08.3: Comunicação em Massa
**Como** admin, **quero** enviar comunicações para clientes, **para** engajar e informar.

**Tarefas:**
- [ ] **Backend:** Endpoint POST /admin/communications/send
- [ ] **Backend:** Tipos: email, WhatsApp
- [ ] **Backend:** Seletores: todos, segmento, filtros
- [ ] **Backend:** Templates de mensagem
- [ ] **Backend:** Agendamento de envio
- [ ] **Backend:** Rate limiting para WhatsApp
- [ ] **Frontend Admin:** Criador de campanhas
- [ ] **Frontend Admin:** Editor de templates
- [ ] **Frontend Admin:** Preview da mensagem
- [ ] **Frontend Admin:** Relatório de envio

---

## ÉPICO 09: Notificações e Lembretes

**Descrição:** Sistema de notificações push, email e WhatsApp para datas especiais.

### Histórias de Usuário

#### HU-09.1: Agendamento de Notificações
**Como** sistema, **quero** enviar notificações 7 dias e 1 dia antes das datas especiais, **para** lembrar o usuário.

**Tarefas:**
- [ ] **Backend:** Implementar Spring Scheduler (@Scheduled)
- [ ] **Backend:** Query: buscar special_dates próximas (7 e 1 dia)
- [ ] **Backend:** Verificar last_notified para evitar duplicatas
- [ ] **Backend:** Gerar notificação (título, mensagem, link)
- [ ] **Backend:** Registrar em tabela notifications
- [ ] **Backend:** Marcar last_notified após envio
- [ ] **Backend:** Suportar timezone do usuário
- [ ] **Backend:** Implementar retry em caso de falha
- [ ] **Frontend:** Criar página de notificações
- [ ] **Frontend:** Exibir lista de notificações
- [ ] **Frontend:** Marcar como lida
- [ ] **Frontend:** Push notifications web (opcional)
- [ ] **TESTES:** Testar scheduler com diferentes timezones

#### HU-09.2: Envio via WhatsApp
**Como** sistema, **quero** enviar lembretes via WhatsApp, **para** alcançar o usuário onde ele está.

**Tarefas:**
- [ ] **Backend:** Integrar WhatsApp Cloud API
- [ ] **Backend:** Endpoint para envio de mensagens
- [ ] **Backend:** Rate limiting (100 msg/24h por número)
- [ ] **Backend:** Templates approved by Meta
- [ ] **Backend:** Tracking de delivery
- [ ] **Backend:** Retry com backoff exponencial
- [ ] **Backend:** Webhook para status de entrega
- [ ] **Frontend:** Perfil do usuário com consentimento WhatsApp
- [ ] **Frontend:** Toggle de notificações WhatsApp
- [ ] **TESTES:** Testar integração com WhatsApp API

#### HU-09.3: Envio de Email Transacional
**Como** sistema, **quero** enviar emails transacionais, **para** comunicar eventos importantes.

**Tarefas:**
- [ ] **Backend:** Integrar serviço de email (SendGrid/AWS SES)
- [ ] **Backend:** Templates de email (confirmação, lembrete, status)
- [ ] **Backend:** Fila de envio (async)
- [ ] **Backend:** Tracking de abertura/clique
- [ ] **Backend:** Unsubscribe link em todos os emails
- [ ] **Frontend:** Configurar preferências de email no perfil
- [ ] **TESTES:** Testar templates de email

---

## ÉPICO 10: Curadoria de Presentes com IA

**Descrição:** Sistema de recomendação de presentes usando IA (GPT-4, RAG).

### Histórias de Usuário

#### HU-10.1: Recomendação por Perfil
**Como** sistema, **quero** recomendar presentes baseado no perfil da pessoa, **para** ajudar na escolha.

**Tarefas:**
- [ ] **Backend:** Criar tabela recommendations
- [ ] **Backend:** Implementar RecommendationService
- [ ] **Backend:** Usar OpenAI API (GPT-4) para gerar recomendações
- [ ] **Backend:** Input: idade, gênero, interesses, ocasião
- [ ] **Backend:** Output: 3-5 sugestões com justificativa
- [ ] **Backend:** Cachear respostas (Redis, TTL 24h)
- [ ] **Backend:** Implementar fallback se API falhar
- [ ] **Frontend:** Página de recomendações
- [ ] **Frontend:** Formulário de perfil (idade, interesses)
- [ ] **Frontend:** Exibir cards de sugestões
- [ ] **Frontend:** Exibir justificativa da IA
- [ ] **Frontend:** Feedback (gostei/não gostei)
- [ ] **TESTES:** Testar qualidade das recomendações

#### HU-10.2: Geração de Mensagem Personalizada
**Como** sistema, **quero** gerar mensagens personalizadas para presente, **para** tornar o presente mais especial.

**Tarefas:**
- [ ] **Backend:** Endpoint POST /ai/generate-message
- [ ] **Backend:** Input: tipo de ocasião, relacionamento, produto
- [ ] **Backend:** Prompt engineered para GPT-4
- [ ] **Backend:** Output: texto emocional e contextual
- [ ] **Backend:** Comprimento configurável (curto/médio/longo)
- [ ] **Backend:** Cachear mensagem gerada
- [ ] **Frontend:** Preview da mensagem
- [ ] **Frontend:** Botão "Gerar nova"
- [ ] **Frontend:** Editor para ajustar mensagem
- [ ] **Frontend:** Copiar para WhatsApp
- [ ] **TESTES:** Testar qualidade das mensagens

#### HU-10.3: RAG (Retrieval-Augmented Generation)
**Como** sistema, **quero** usar histórico do usuário para melhorar recomendações, **para** ser mais relevante.

**Tarefas:**
- [ ] **Backend:** Configurar PostgreSQL pgvector
- [ ] **Backend:** Gerar embeddings dos produtos (OpenAI Ada-002)
- [ ] **Backend:** Armazenar embeddings no pgvector
- [ ] **Backend:** Query de similaridade para recomendações
- [ ] **Backend:** Combinar com preferences do usuário
- [ ] **Backend:** Implementar HNSW index para performance
- [ ] **Frontend:** Indicar "Baseado no seu histórico"
- [ ] **Frontend:** Exibir produtos similares aos comprados
- [ ] **TESTES:** Testar qualidade de similaridade

#### HU-10.4: Limite de Uso de IA
**Como** sistema, **quero** implementar rate limiting para API de IA, **para** controlar custos.

**Tarefas:**
- [ ] **Backend:** Implementar contador de uso por usuário
- [ ] **Backend:** Limite diário/mensal configurável
- [ ] **Backend:** Feedback quando limite atingido
- [ ] **Backend:** Dashboard de uso (admin)
- [ ] **Frontend:** Indicador de uso restante
- [ ] **Frontend:** Mensagem de limite atingido

---

## ÉPICO 11: Integração WhatsApp Bot

**Descrição:** Bot WhatsApp para interação completa via WhatsApp.

### Histórias de Usuário

#### HU-11.1: Menu Inicial do Bot
**Como** usuário WhatsApp, **quero** receber menu interativo, **para** saber o que posso fazer.

**Tarefas:**
- [ ] **Backend:** Webhook WhatsApp Cloud API
- [ ] **Backend:** Endpoint POST /webhooks/whatsapp
- [ ] **Backend:** Verificar assinatura HMAC
- [ ] **Backend:** Interpretar mensagens (/start, menu)
- [ ] **Backend:** Responder com Interactive buttons
- [ ] **Backend:** Opções: Cadastrar pessoa, Ver datas, Presentes, Ajuda
- [ ] **Frontend:** (N/A - Backend only)

#### HU-11.2: Cadastro de Pessoa via WhatsApp
**Como** usuário WhatsApp, **quero** cadastrar pessoa pelo WhatsApp, **para** adicionar contatos facilmente.

**Tarefas:**
- [ ] **Backend:** Fluxo conversacional: nome → telefone → tipo data → data
- [ ] **Backend:** Encaminhamento de contato (extração automática)
- [ ] **Backend:** Validação de cada passo
- [ ] **Backend:** Confirmação final
- [ ] **Backend:** Salvar no banco (contacts + special_dates)

#### HU-11.3: Sugestões via WhatsApp
**Como** usuário WhatsApp, **quero** receber sugestões de presentes, **para** descobrir opções.

**Tarefas:**
- [ ] **Backend:** Comando "/presentes" ou clique no menu
- [ ] **Backend:** ListProducts com IA (3-5 opções)
- [ ] **Backend:** Enviar com imagem + preço
- [ ] **Backend:** Botões numerados para selecionar
- [ ] **Backend:** Processar seleção e prosseguir

#### HU-11.4: Agendamento de Mensagem
**Como** usuário WhatsApp, **quero** agendar o envio da mensagem de presente, **para** surpreender na data certa.

**Tarefas:**
- [ ] **Backend:** Fluxo: selecionar data → selecionar hora
- [ ] **Backend:** Validar data (futura)
- [ ] **Backend:** Criar scheduled_message
- [ ] **Backend:** Fila para envio futuro (Spring Scheduler)
- [ ] **Backend:** Enviar na data/hora marcada

---

## ÉPICO 12: Dashboard e Analytics (Admin)

**Descrição:** Dashboard administrativo com métricas e relatórios.

### Histórias de Usuário

#### HU-12.1: Dashboard Principal (Admin)
**Como** admin, **quero** ver métricas principais, **para** acompanhar o negócio.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/dashboard/stats
- [ ] **Backend:** Métricas: revenue, orders, customers, avg_ticket
- [ ] **Backend:** Comparativo com período anterior
- [ ] **Backend:** Cachear métricas (5 min)
- [ ] **Frontend Admin:** Cards de métricas (KPIs)
- [ ] **Frontend Admin:** Gráficos de tendência (Recharts)
- [ ] **Frontend Admin:** Período selecionável
- [ ] **REMOVE-MOCK:** Substituir mock-dashboard-stats
- [ ] **TESTES:** Testar cálculos de métricas

#### HU-12.2: Gráfico de Vendas
**Como** admin, **quero** ver gráfico de vendas, **para** visualizar tendências.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/dashboard/sales-chart
- [ ] **Backend:** Agregação por dia/semana/mês
- [ ] **Backend:** Dados: revenue, orders
- [ ] **Frontend Admin:** Gráfico de linha/área
- [ ] **Frontend Admin:** Tooltip com detalhes
- [ ] **Frontend Admin:** Zoom em período

#### HU-12.3: Produtos Mais Vendidos
**Como** admin, **quero** ver ranking de produtos, **para** entender o que vende.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/dashboard/top-products
- [ ] **Backend:** Aggregação: units_sold, revenue
- [ ] **Backend:** Limite configurável (default 10)
- [ ] **Frontend Admin:** Gráfico de barras horizontal
- [ ] **Frontend Admin:** Tabela complementar

#### HU-12.4: Funil de Vendas
**Como** admin, **quero** ver funil de conversão, **para** identificar gargalos.

**Tarefas:**
- [ ] **Backend:** Calcular: visits → add_to_cart → checkout → purchase
- [ ] **Backend:** Taxas de conversão em cada etapa
- [ ] **Frontend Admin:** Visualização de funil
- [ ] **Frontend Admin:** Comparativo entre períodos

#### HU-12.5: Cohort Analysis
**Como** admin, **quero** ver análise de coorte, **para** medir retenção.

**Tarefas:**
- [ ] **Backend:** Calcular coortes por semana/mês de cadastro
- [ ] **Backend:** Retenção em períodos subsequentes
- [ ] **Frontend Admin:** Heatmap de retenção
- [ ] **Frontend Admin:** Seletor de granularidade

---

## ÉPICO 13: Conteúdo e Configurações (Admin)

**Descrição:** Gestão de banners, páginas e configurações do sistema.

### Histórias de Usuário

#### HU-13.1: Gestão de Banners
**Como** admin, **quero** gerenciar banners da homepage, **para** destacar promoções.

**Tarefas:**
- [ ] **Backend:** CRUD de banners (title, subtitle, image, link, is_active)
- [ ] **Backend:** Endpoint GET /banners (apenas ativos)
- [ ] **Backend:** Agendamento de exibição
- [ ] **Backend:** Ordenação por posição
- [ ] **Frontend Admin:** CRUD de banners
- [ ] **Frontend Admin:** Upload de imagem
- [ ] **Frontend Admin:** Preview do banner
- [ ] **Frontend:** Exibir banners no carrossel
- [ ] **REMOVE-MOCK:** Substituir mock-banners
- [ ] **TESTES:** Testar ordenação de banners

#### HU-13.2: Páginas Institucionais
**Como** admin, **quero** criar páginas institucionais, **para** comunicar políticas.

**Tarefas:**
- [ ] **Backend:** CRUD de páginas (slug, title, content, seo)
- [ ] **Backend:** Editor de conteúdo (markdown ou WYSIWYG)
- [ ] **Backend:** SEO: meta_title, meta_description
- [ ] **Backend:** Preview antes de publicar
- [ ] **Frontend Admin:** Editor de páginas
- [ ] **Frontend Admin:** Listagem de páginas
- [ ] **Frontend:** Renderizar páginas (/page/{slug})
- [ ] **Frontend:** Renderizar SEO tags

#### HU-13.3: Configurações da Loja
**Como** admin, **quero** configurar parâmetros da loja, **para** personalizar o negócio.

**Tarefas:**
- [ ] **Backend:** CRUD de store_settings (general, email, payment, shipping)
- [ ] **Backend:** Campos: store_name, email, phone, shipping_methods, etc.
- [ ] **Backend:** Validação de configurações
- [ ] **Frontend Admin:** Formulário de configurações
- [ ] **Frontend Admin:** Seções organizadas por categoria
- [ ] **Frontend Admin:** Preview de alterações

---

## ÉPICO 14: Sistema de Estoque

**Descrição:** Gestão completa de estoque com alertas e movimentações.

### Histórias de Usuário

#### HU-14.1: Controle de Estoque
**Como** sistema, **quero** controlar estoque em tempo real, **para** evitar vendas de produtos esgotados.

**Tarefas:**
- [ ] **Backend:** Criar tabela inventory (product_id, quantity, min_stock, max_stock)
- [ ] **Backend:** Integration com ProductService
- [ ] **Backend:** Bloquear venda se quantity = 0
- [ ] **Backend:** Reservar ao criar pedido (PENDING)
- [ ] **Backend:** Confirmar ao pagar (PAID)
- [ ] **Backend:** Liberar ao cancelar (CANCELLED)
- [ ] **Frontend Admin:** Dashboard de estoque
- [ ] **Frontend Admin:** Alertas visuais de estoque baixo
- [ ] **REMOVE-MOCK:** Substituir mock-inventory-data
- [ ] **TESTES:** Testar race conditions de estoque

#### HU-14.2: Movimentações de Estoque
**Como** admin, **quero** registrar movimentações, **para** rastrear alterações.

**Tarefas:**
- [ ] **Backend:** Criar tabela stock_movements (type, quantity, reason, reference)
- [ ] **Backend:** Tipos: IN (compra), OUT (venda), ADJUSTMENT, RETURN
- [ ] **Backend:** Histórico completo por produto
- [ ] **Backend:** Cálculo de valor em estoque
- [ ] **Frontend Admin:** Listagem de movimentações
- [ ] **Frontend Admin:** Filtros: produto, tipo, período
- [ ] **Frontend Admin:** Relatório de valor em estoque

#### HU-14.3: Alertas de Estoque
**Como** sistema, **quero** gerar alertas automáticos, **para** avisar sobre problemas.

**Tarefas:**
- [ ] **Backend:** Verificar estoque diariamente
- [ ] **Backend:** Gerar alerta se quantity <= min_stock
- [ ] **Backend:** Tipos: LOW_STOCK, OUT_OF_STOCK, EXPIRY_SOON
- [ ] **Backend:** Criar tabela alerts
- [ ] **Backend:** Notificar admin por email/Slack
- [ ] **Frontend Admin:** Página de alertas
- [ ] **Frontend Admin:** Badge no menu
- [ ] **Frontend Admin:** Ações: ignorar, reabastecer

#### HU-14.4: Gestão de Fornecedores
**Como** admin, **quero** gerenciar fornecedores, **para** controlar compras.

**Tarefas:**
- [ ] **Backend:** CRUD de suppliers (name, cnpj, contact, address, payment_terms)
- [ ] **Backend:** Associar produtos a fornecedores
- [ ] **Backend:** Avaliação de fornecedores
- [ ] **Frontend Admin:** Listagem de fornecedores
- [ ] **Frontend Admin:** Formulário de cadastro
- [ ] **Frontend Admin:** Associação com produtos

---

## ÉPICO 15: Localização e Endereços

**Descrição:** Gestão de endereços e cálculo de frete por localização.

### Histórias de Usuário

#### HU-15.1: Cadastro de Endereços
**Como** usuário, **quero** cadastrar meus endereços, **para** não informar a cada compra.

**Tarefas:**
- [ ] **Backend:** CRUD de addresses (user_id, street, number, complement, neighborhood, city, state, zip_code)
- [ ] **Backend:** Endpoint GET /addresses
- [ ] **Backend:** Endpoint POST /addresses (criar)
- [ ] **Backend:** Endpoint PUT /addresses/{id}
- [ ] **Backend:** Endpoint DELETE /addresses/{id}
- [ ] **Backend:** Endpoint PUT /addresses/{id}/default (marcar padrão)
- [ ] **Frontend:** Página "Meus Endereços"
- [ ] **Frontend:** Formulário com validação de CEP
- [ ] **Frontend:** Auto-complete de endereço por CEP
- [ ] **Frontend:** Selecionar endereço padrão
- [ ] **REMOVE-MOCK:** Substituir mock-addresses
- [ ] **TESTES:** Testar validação de CEP

#### HU-15.2: Coleta de Endereço via WhatsApp
**Como** sistema, **quero** coletar endereço via conversa, **para** facilitar no WhatsApp.

**Tarefas:**
- [ ] **Backend:** Fluxo: CEP → número → complemento → bairro → confirmar
- [ ] **Backend:** Validação de CEP (via API)
- [ ] **Backend:** Auto-complete de rua/bairro
- [ ] **Backend:** Salvar como padrão se solicitado

#### HU-15.3: Validação de CEP
**Como** sistema, **quero** validar CEPs brasileiros, **para** garantir endereço correto.

**Tarefas:**
- [ ] **Backend:** Integrar API ViaCEP ou similar
- [ ] **Backend:** Endpoint POST /address/validate-cep
- [ ] **Backend:** Retornar endereço completo
- [ ] **Backend:** Cachear resultados (Redis)
- [ ] **Frontend:** Validar CEP em tempo real
- [ ] **Frontend:** Auto-preencher campos

---

## ÉPICO 16: Segurança e Compliance (LGPD)

**Descrição:** Implementação de requisitos de segurança e proteção de dados.

### Histórias de Usuário

#### HU-16.1: Criptografia de Dados
**Como** sistema, **quero** criptografar dados sensíveis, **para** proteger informações.

**Tarefas:**
- [ ] **Backend:** Configurar criptografia em repouso (AES-256)
- [ ] **Backend:** Criptografar: telefones, emails em logs
- [ ] **Backend:** TLS 1.3 em todas as comunicações
- [ ] **Backend:** Configurar SSL/TLS no servidor
- [ ] **TESTES:** Auditar dados criptografados

#### HU-16.2: Proteção contra Ataques
**Como** sistema, **quero** proteger contra SQL injection e XSS, **para** garantir segurança.

**Tarefas:**
- [ ] **Backend:** Usar JPA/Hibernate (prepared statements)
- [ ] **Backend:** Configurar CSP headers
- [ ] **Backend:** Implementar CSRF tokens
- [ ] **Backend:** Rate limiting por IP/telefone
- [ ] **Frontend:** Auto-escape de inputs (React)
- [ ] **Frontend:** Sanitizar entrada do usuário
- [ ] **TESTES:** Testes de segurança (OWASP ZAP)

#### HU-16.3: Gestão de Consentimento (LGPD)
**Como** sistema, **quero** gerenciar consentimentos, **para** estar em conformidade.

**Tarefas:**
- [ ] **Backend:** Criar tabela consents (user_id, type, granted, timestamp)
- [ ] **Backend:** Consentimento para: marketing, WhatsApp, dados
- [ ] **Backend:** Endpoint PUT /users/me/consents
- [ ] **Backend:** Link de descadastro em emails
- [ ] **Backend:** Endpoint DELETE /users/me (delete completo)
- [ ] **Backend:** Exportar dados (GDPR/LGPD)
- [ ] **Frontend:** Modal de consentimento inicial
- [ ] **Frontend:** Página de preferências
- [ ] **Frontend:** Link de unsubscribe

#### HU-16.4: Mascaramento de Dados em Logs
**Como** sistema, **quero** mascarar dados sensíveis em logs, **para** não expor informações.

**Tarefas:**
- [ ] **Backend:** Configurar Logback/Log4j
- [ ] **Backend:** Implementar masking de phone, email, CPF
- [ ] **Backend:** NÃO logar senhas ou tokens
- [ ] **Backend:** Logs estruturados (JSON)

---

## ÉPICO 17: Performance e Otimização

**Descrição:** Otimização de performance e caching.

### Histórias de Usuário

#### HU-17.1: Caching com Redis
**Como** sistema, **quero** usar Redis para cache, **para** melhorar performance.

**Tarefas:**
- [ ] **Backend:** Configurar Redis (ElastiCache ou local)
- [ ] **Backend:** Cachear: produtos, categorias, carrinho
- [ ] **Backend:** TTL configurável por tipo
- [ ] **Backend:** Invalidar cache em updates
- [ ] **Backend:** Cache de respostas de IA
- [ ] **TESTES:** Testar命中率 de cache

#### HU-17.2: Índices de Banco de Dados
**Como** sistema, **quero** ter índices otimizados, **para** queries rápidas.

**Tarefas:**
- [ ] **Backend:** Criar índices: products(search), orders(user_id, status), contacts(phone)
- [ ] **Backend:** Índices parciais para consultas frequentes
- [ ] **Backend:** Analisar query plans (EXPLAIN)
- [ ] **TESTES:** Benchmark de queries

#### HU-17.3: CDN e Assets
**Como** sistema, **quero** usar CDN para assets, **para** carregamento rápido.

**Tarefas:**
- [ ] **Backend:** Upload para S3/CloudFront
- [ ] **Backend:** Configurar CDN para imagens de produto
- [ ] **Frontend:** Lazy loading de imagens
- [ ] **Frontend:** Next.js Image optimization
- [ ] **Frontend:** Font subsetting

#### HU-17.4: Lazy Loading e Code Splitting
**Como** usuário, **quero** que páginas carreguem rápido, **para** não esperar.

**Tarefas:**
- [ ] **Frontend:** Implementar dynamic imports
- [ ] **Frontend:** Separar vendor bundles
- [ ] **Frontend:** Route-based code splitting
- [ ] **Frontend:** Skeleton loading states
- [ ] **TESTES:** Lighthouse score > 90

---

## ÉPICO 18: Testes e Qualidade

**Descrição:** Suite completa de testes unitários, integração e E2E.

### Histórias de Usuário

#### HU-18.1: Testes Unitários Backend
**Como** desenvolvedor, **quero** testes unitários, **para** garantir que o código funciona.

**Tarefas:**
- [ ] **Backend:** Configurar JUnit 5 + Mockito
- [ ] **Backend:** Coverage mínimo: 70%
- [ ] **Backend:** Testar Services
- [ ] **Backend:** Testar validações
- [ ] **Backend:** Testar exceções
- [ ] **TESTES:** CI run tests em cada PR

#### HU-18.2: Testes de Integração Backend
**Como** desenvolvedor, **quero** testes de integração, **para** garantir que módulos funcionam juntos.

**Tarefas:**
- [ ] **Backend:** Configurar TestContainers (PostgreSQL)
- [ ] **Backend:** Testar Controllers
- [ ] **Backend:** Testar Repository queries
- [ ] **Backend:** Testar integrações externas (mock)

#### HU-18.3: Testes E2E Frontend
**Como** desenvolvedor, **quero** testes E2E, **para** garantir fluxo completo.

**Tarefas:**
- [ ] **Frontend:** Configurar Playwright
- [ ] **Frontend:** Testar fluxo: registro → login → compra
- [ ] **Frontend:** Testar checkout completo
- [ ] **Frontend:** Testar admin: CRUD produtos
- [ ] **TESTES:** Run E2E em staging

#### HU-18.4: Testes de API (Contract Testing)
**Como** desenvolvedor, **quero** testes de contrato, **para** garantir API consistente.

**Tarefas:**
- [ ] **Backend:** Definir OpenAPI spec (Springdoc)
- [ ] **Frontend:** Gerar client types do spec
- [ ] **Backend:** Validação de responses contra spec
- [ ] **TESTES:** CI valida spec

---

## ÉPICO 19: SEO e Descoberta

**Descrição:** Otimização para mecanismos de busca.

### Histórias de Usuário

#### HU-19.1: SEO On-Page
**Como** sistema, **quero** tags SEO dinâmicas, **para** aparecer nas buscas.

**Tarefas:**
- [ ] **Frontend:** Meta tags dinâmicas (Next.js Metadata API)
- [ ] **Frontend:** Open Graph tags
- [ ] **Frontend:** Structured data (JSON-LD) para produtos
- [ ] **Frontend:** Sitemap dinâmico
- [ ] **Frontend:** Robots.txt
- [ ] **Frontend:** Canonical URLs
- [ ] **TESTES:** Validar com Google Rich Results Test

#### HU-19.2: URLs Amigáveis
**Como** usuário, **quero** URLs limpas, **para** compartilhar facilmente.

**Tarefas:**
- [ ] **Backend:** Slugs para produtos (/produto/{slug})
- [ ] **Backend:** Slugs para páginas (/page/{slug})
- [ ] **Frontend:** Implementar Next.js dynamic routes
- [ ] **Frontend:** Redirecionar URLs antigas

#### HU-19.3: Performance SEO (Core Web Vitals)
**Como** sistema, **quero** Core Web Vitals bons, **para** rankear bem.

**Tarefas:**
- [ ] **Frontend:** LCP < 2.5s
- [ ] **Frontend:** FID < 100ms
- [ ] **Frontend:** CLS < 0.1
- [ ] **TESTES:** Lighthouse CI em cada deploy

---

## ÉPICO 20: Sistema de Wishlist

**Descrição:** Lista de desejos para clientes marcarem produtos.

### Histórias de Usuário

#### HU-20.1: Criar Wishlist
**Como** usuário, **quero** criar wishlists, **para** salvar produtos para depois.

**Tarefas:**
- [ ] **Backend:** Criar tabela wishlists (user_id, name, is_public)
- [ ] **Backend:** Endpoint POST /wishlists
- [ ] **Backend:** Endpoint GET /wishlists
- [ ] **Backend:** Endpoint POST /wishlists/{id}/items
- [ ] **Backend:** Endpoint DELETE /wishlists/{id}/items/{itemId}
- [ ] **Frontend:** Botão "Salvar na Wishlist"
- [ ] **Frontend:** Modal de criar/selecionar wishlist
- [ ] **Frontend:** Página "Minhas Wishlists"
- [ ] **TESTES:** Testar CRUD de wishlist

#### HU-20.2: Compartilhar Wishlist
**Como** usuário, **quero** compartilhar minha wishlist, **para** indicar presentes para outros.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /wishlists/{id}/share
- [ ] **Backend:** Gerar link público único
- [ ] **Backend:** Configurar visibilidade (public/private)
- [ ] **Frontend:** Exibir link de compartilhamento
- [ ] **Frontend:** Página pública de wishlist
- [ ] **Frontend:** Botão "Presentear" direto

---

## ÉPICO 21: Programa de Fidelidade

**Descrição:** Sistema de pontos e recompensas para clientes.

### Histórias de Usuário

#### HU-21.1: Acumular Pontos
**Como** usuário, **quero** acumular pontos em compras, **para** trocar por recompensas.

**Tarefas:**
- [ ] **Backend:** Criar tabela loyalty_points (user_id, points, transaction_type)
- [ ] **Backend:** Calcular pontos por compra (ex: 1 ponto por R$1)
- [ ] **Backend:** Registrar transação (EARN, REDEEM, EXPIRE)
- [ ] **Backend:** Não permitir pontos negativos
- [ ] **Frontend:** Exibir saldo de pontos no perfil
- [ ] **Frontend:** Exibir histórico de pontos
- [ ] **Frontend:** Notificar pontos ganhos

#### HU-21.2: Resgatar Pontos
**Como** usuário, **quero** resgatar meus pontos, **para** obter descontos.

**Tarefas:**
- [ ] **Backend:** Endpoint POST /loyalty/redeem
- [ ] **Backend:** Converter pontos em desconto (ex: 100 pts = R$1)
- [ ] **Backend:** Aplicar desconto no checkout
- [ ] **Backend:** Registrar resgate
- [ ] **Frontend:** Página de recompensas
- [ ] **Frontend:** Seletor de resgate
- [ ] **Frontend:** Preview do desconto

---

## ÉPICO 22: Rastreamento de Entrega

**Descrição:** Acompanhamento de pedidos em tempo real.

### Histórias de Usuário

#### HU-22.1: Rastreamento via API
**Como** sistema, **quero** rastrear entregas via API, **para** informar o cliente.

**Tarefas:**
- [ ] **Backend:** Integrar API de rastreamento (Correios, Loggi)
- [ ] **Backend:** Endpoint GET /orders/{id}/tracking
- [ ] **Backend:** Polling de status (a cada 6h)
- [ ] **Backend:** Webhook para atualizações
- [ ] **Backend:** Cache de resultados
- [ ] **Frontend:** Exibir status de rastreamento
- [ ] **Frontend:** Timeline de eventos
- [ ] **Frontend:** Link para rastreamento oficial

#### HU-22.2: Notificação de Entrega
**Como** sistema, **quero** notificar quando entregue, **para** confirmar ao cliente.

**Tarefas:**
- [ ] **Backend:** Detectar status DELIVERED
- [ ] **Backend:** Enviar email/WhatsApp de confirmação
- [ ] **Backend:** coletar feedback (rating 1-5)
- [ ] **Frontend:** Mensagem de confirmação
- [ ] **Frontend:** Formulário de avaliação

---

## ÉPICO 23: Webhooks e Integrações Externas

**Descrição:** Sistema de webhooks para integrações e automações.

### Histórias de Usuário

#### HU-23.1: Webhook de Pagamento
**Como** sistema, **quero** receber webhooks de pagamento, **para** atualizar pedidos automaticamente.

**Tarefas:**
- [ ] **Backend:** Endpoint POST /webhooks/payment
- [ ] **Backend:** Validar assinatura do provedor
- [ ] **Backend:** Processar: payment.success, payment.failed
- [ ] **Backend:** Atualizar status do pedido
- [ ] **Backend:** Retry em caso de falha
- [ ] **Backend:** Log de webhooks

#### HU-23.2: Webhook de Entrega
**Como** sistema, **quero** receber webhooks de entrega, **para** atualizar rastreamento.

**Tarefas:**
- [ ] **Backend:** Endpoint POST /webhooks/shipping
- [ ] **Backend:** Atualizar tracking status
- [ ] **Backend:** Notificar cliente

#### HU-23.3: Gerenciamento de Webhooks (Admin)
**Como** admin, **quero** configurar webhooks externos, **para** integrar com outros sistemas.

**Tarefas:**
- [ ] **Backend:** CRUD de webhooks (url, events, secret)
- [ ] **Backend:** Retry automático com backoff
- [ ] **Backend:** Log de deliveries
- [ ] **Backend:** Endpoint manual retry
- [ ] **Frontend Admin:** Página de gestão de webhooks
- [ ] **Frontend Admin:** Ver logs de delivery

---

## ÉPICO 24: Internacionalização (i18n)

**Descrição:** Suporte a múltiplos idiomas.

### Histórias de Usuário

#### HU-24.1: i18n Backend
**Como** sistema, **quero** mensagens internacionalizadas, **para** suportar múltiplos idiomas.

**Tarefas:**
- [ ] **Backend:** Configurar Spring i18n
- [ ] **Backend:** Arquivos de properties: messages_pt.properties, messages_en.properties
- [ ] **Backend:** Error messages internacionalizadas
- [ ] **Backend:** Locale detection (header Accept-Language)

#### HU-24.2: i18n Frontend
**Como** usuário, **quero** ver a interface no meu idioma, **para** entender melhor.

**Tarefas:**
- [ ] **Frontend:** Configurar next-intl ou react-i18next
- [ ] **Frontend:** Arquivos de tradução
- [ ] **Frontend:** Language switcher
- [ ] **Frontend:** Persistir preferência

---

## ÉPICO 25: Chat de Suporte

**Descrição:** Sistema de chat para suporte ao cliente.

### Histórias de Usuário

#### HU-25.1: Chat ao Vivo
**Como** usuário, **quero** conversar com suporte, **para** resolver dúvidas rapidamente.

**Tarefas:**
- [ ] **Backend:** WebSocket para chat (STOMP)
- [ ] **Backend:** Salvar histórico de mensagens
- [ ] **Backend:** Notificar agente de novo chat
- [ ] **Backend:** Chatbot básico com respostas frequentes
- [ ] **Frontend:** Widget de chat no canto
- [ ] **Frontend:** Área de mensagens
- [ ] **Frontend:** Input de texto
- [ ] **Frontend:** Notificações de novas mensagens

#### HU-25.2: Painel do Agente (Admin)
**Como** agente, **quero** atender chats, **para** ajudar clientes.

**Tarefas:**
- [ ] **Backend:** CRUD de agentes
- [ ] **Backend:** Fila de atendimentos
- [ ] **Backend:** Transferência entre agentes
- [ ] **Frontend Admin:** Dashboard de chats
- [ ] **Frontend Admin:** Interface de atendimento
- [ ] **Frontend Admin:** Status online/offline

---

## ÉPICO 26: Relatórios e Exportação

**Descrição:** Relatórios avançados e exportação de dados.

### Histórias de Usuário

#### HU-26.1: Relatórios Customizados (Admin)
**Como** admin, **quero** criar relatórios customizados, **para** analisar o negócio.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/reports/{type}
- [ ] **Backend:** Tipos: sales, customers, products, inventory
- [ ] **Backend:** Filtros: período, segmento
- [ ] **Backend:** Agrupamentos customizados
- [ ] **Frontend Admin:** Seletor de tipo de relatório
- [ ] **Frontend Admin:** Filtros
- [ ] **Frontend Admin:** Visualização (tabela, gráfico)
- [ ] **REMOVE-MOCK:** Garantir dados reais nos relatórios

#### HU-26.2: Exportação de Dados (Admin)
**Como** admin, **quero** exportar dados para CSV/Excel, **para** analisar offline.

**Tarefas:**
- [ ] **Backend:** Endpoint GET /admin/export/{entity}
- [ ] **Backend:** Formatos: CSV, XLSX
- [ ] **Backend:** Aplicar filtros atuais
- [ ] **Backend:** Async export para arquivos grandes
- [ ] **Backend:** Notificar quando pronto
- [ ] **Frontend Admin:** Botão de exportar
- [ ] **Frontend Admin:** Seletor de formato
- [ ] **Frontend Admin:** Progresso de exportação

---

## ÉPICO 27: Deployment e Infraestrutura AWS

**Descrição:** Deploy em produção na AWS.

### Histórias de Usuário

#### HU-27.1: Infraestrutura como Código
**Como** DevOps, **quero** IaC (Terraform/CDK), **para** replicar ambientes facilmente.

**Tarefas:**
- [ ] Definir ECS Fargate (regalaya-api)
- [ ] Definir S3 buckets (assets, uploads)
- [ ] Definir RDS PostgreSQL
- [ ] Definir ElastiCache Redis
- [ ] Definir CloudFront distribution
- [ ] Definir ALB (Load Balancer)
- [ ] Definir Security Groups
- [ ] Definir IAM roles

#### HU-27.2: Deploy Contínuo
**Como** DevOps, **quero** CD automatizado, **para** fazer deploys frequentes.

**Tarefas:**
- [ ] Pipeline: build → test → deploy-staging → approve → deploy-production
- [ ] ECS task definitions atualizadas
- [ ] Health checks configurados
- [ ] Rollback automático em falha
- [ ] Deploy blue-green

#### HU-27.3: Monitoramento e Logs
**Como** DevOps, **quero** monitoramento completo, **para** detectar problemas rápido.

**Tarefas:**
- [ ] Configurar CloudWatch Logs
- [ ] Configurar CloudWatch Metrics (CPU, Memory, RequestCount)
- [ ] Configurar alarms (SNS notification)
- [ ] Integrar Sentry para error tracking
- [ ] Dashboard de monitoramento

#### HU-27.4: Backup e Disaster Recovery
**Como** DevOps, **quero** backups automáticos, **para** recuperar de desastres.

**Tarefas:**
- [ ] RDS automated backups (diário, retenção 30 dias)
- [ ] Backup cross-region (opcional)
- [ ] Teste de restore periódico
- [ ] Runbook de disaster recovery
- [ ] RTO < 1h, RPO < 15min

---

## MATRIZ DE RASTREABILIDADE: PRD vs ÉPICOS

| Requisito PRD | Épico Correspondente | HU(s) |
|---------------|---------------------|-------|
| MH-01: Cadastro de contato | ÉPICO 03 | HU-03.1, HU-03.2 |
| MH-02: Tipos de data | ÉPICO 03 | HU-03.3 |
| MH-03: Recorrência automática | ÉPICO 03 | HU-03.3 |
| MH-04: Notificação push/WhatsApp | ÉPICO 09 | HU-09.1, HU-09.2 |
| MH-05: Catálogo básico | ÉPICO 04 | HU-04.1, HU-04.2 |
| MH-06: Recomendação por perfil | ÉPICO 10 | HU-10.1 |
| MH-07: Mensagem personalizada | ÉPICO 10 | HU-10.2 |
| MH-08: Filtros básicos | ÉPICO 04 | HU-04.1 |
| MH-09: Agendamento de envio | ÉPICO 11 | HU-11.4 |
| MH-10: Coleta de endereço | ÉPICO 15 | HU-15.2, HU-15.3 |
| MH-11: Integração entrega | ÉPICO 06 | HU-06.4, ÉPICO 22 |
| MH-12: Confirmação de entrega | ÉPICO 22 | HU-22.2 |
| MH-13: Bot WhatsApp | ÉPICO 11 | HU-11.1, HU-11.2, HU-11.3 |
| MH-14: Envio de contato | ÉPICO 11 | HU-11.2 |
| MH-15: Fluxo conversacional | ÉPICO 11 | HU-11.1, HU-11.2, HU-11.3 |
| MH-16: Autenticação | ÉPICO 02 | HU-02.1, HU-02.2 |
| MH-17: Pagamento | ÉPICO 06 | HU-06.1, HU-06.2, HU-06.3 |
| MH-18: Dashboard web | ÉPICO 12 | HU-12.1, HU-12.2 |
| MH-19: Gestão de Produtos | ÉPICO 04 | HU-04.3, HU-04.4 |
| MH-20: Gestão de Pedidos | ÉPICO 07 | HU-07.1, HU-07.2, HU-07.3, HU-07.4 |
| MH-21: Gestão de Clientes | ÉPICO 08 | HU-08.1, HU-08.2, HU-08.3 |
| MH-22: Gestão de Conteúdo | ÉPICO 13 | HU-13.1, HU-13.2 |
| MH-23: Analytics Dashboard | ÉPICO 12 | HU-12.1 a HU-12.5 |
| MH-24: Configurações Admin | ÉPICO 13 | HU-13.3 |
| RF-001 a RF-008: E-commerce | ÉPICO 04, 05, 06 | HU-04.x, HU-05.x, HU-06.x |
| RF-101 a RF-120: Backoffice | ÉPICO 07, 08, 12, 13 | HU-07.x, HU-08.x, HU-12.x, HU-13.x |
| RF-201 a RF-210: WhatsApp Bot | ÉPICO 11 | HU-11.x |
| RF-301 a RF-307: Agendamento e IA | ÉPICO 09, 10 | HU-09.x, HU-10.x |
| RNF-001 a RNF-022: NFRs | ÉPICO 17, 18, 26 | HU-17.x, HU-18.x, HU-26.x |

---

## CRONOGRAMA SUGERIDO

### Sprint 1-2 (Semanas 1-4): Foundation
- ÉPICO 01: Infraestrutura e DevOps
- ÉPICO 02: Autenticação e Autorização
- ÉPICO 17: Performance e Otimização (setup inicial)
- ÉPICO 18: Testes e Qualidade (setup inicial)

### Sprint 3-4 (Semanas 5-8): Core Features
- ÉPICO 03: Gestão de Pessoas Queridas
- ÉPICO 04: Catálogo de Produtos
- ÉPICO 16: Segurança e Compliance

### Sprint 5-6 (Semanas 9-12): Commerce
- ÉPICO 05: Carrinho de Compras
- ÉPICO 06: Checkout e Pagamento
- ÉPICO 14: Sistema de Estoque
- ÉPICO 15: Localização e Endereços

### Sprint 7-8 (Semanas 13-16): WhatsApp e IA
- ÉPICO 09: Notificações e Lembretes
- ÉPICO 10: Curadoria de Presentes com IA
- ÉPICO 11: Integração WhatsApp Bot

### Sprint 9 (Semanas 17-18): Admin
- ÉPICO 07: Gestão de Pedidos
- ÉPICO 08: Gestão de Clientes
- ÉPICO 12: Dashboard e Analytics

### Sprint 10 (Semanas 19-20): Polish
- ÉPICO 13: Conteúdo e Configurações
- ÉPICO 19: SEO e Descoberta
- ÉPICO 20: Sistema de Wishlist
- ÉPICO 21: Programa de Fidelidade

### Sprint 11 (Semanas 21-22): Advanced
- ÉPICO 22: Rastreamento de Entrega
- ÉPICO 23: Webhooks e Integrações
- ÉPICO 24: Internacionalização
- ÉPICO 25: Chat de Suporte
- ÉPICO 26: Relatórios e Exportação

### Sprint 12 (Semanas 23-24): Production Ready
- ÉPICO 27: Deployment e Infraestrutura AWS
- QA Final e Bug Fixes
- Beta Testing (50 usuários)

---

## ARQUIVOS A MODIFICAR/REMOVER

### Frontend (regalaya-web)
| Arquivo Atual | Status | Ação |
|---------------|--------|------|
| `src/lib/mock-data.ts` | ⚠️ MOCK | Substituir por API calls (HU-02.5, HU-03.1, HU-04.1, HU-07.1, etc.) |
| `src/lib/mock-inventory-data.ts` | ⚠️ MOCK | Substituir por API calls (HU-14.1) |
| `src/services/*.service.ts` | ⚠️ PARCIAL | Verificar cada serviço e conectar à API real |

### Backend (regalaya-api)
| Componente | Status | Ação |
|------------|--------|------|
| ProductService | ✅ Implementado | Verificar cobertura completa |
| CategoryService | ✅ Implementado | Verificar CRUD completo |
| AuthService | ✅ Implementado | Verificar 2FA, refresh token |
| ContactService | ✅ Implementado | Verificar special_dates |
| OrderService | ✅ Implementado | Verificar webhook handling |
| DashboardService | ✅ Implementado | Verificar métricas |
| UserService | ✅ Implementado | Verificar RBAC |

---

## CHECKLIST DE REMOÇÃO DE MOCKS

### Frontend (regalaya-web)

#### Autenticação
- [ ] `src/lib/mock-data.ts` → Usuários mockados
  - Substituir por `useAuth()` hook com API real
  - Implementar `AuthService.login()`, `AuthService.register()`
- [ ] `src/services/auth.service.ts`
  - Verificar se conecta à API real
  - Implementar refresh token se não existir

#### Produtos
- [ ] `src/lib/mock-data.ts` → `products` array
  - Substituir por `products.service.ts` com `GET /products`
  - Implementar paginação, filtros
- [ ] `src/services/products.service.ts`
  - Verificar se usa API real
  - Implementar busca com debounce

#### Categorias
- [ ] `src/lib/mock-data.ts` → `categories` array
  - Substituir por `GET /categories`
- [ ] `src/services/` → Category service
  - Implementar CRUD se não existir

#### Pedidos
- [ ] `src/lib/mock-data.ts` → `orders`, `orderDetails` arrays
  - Substituir por `orders.service.ts` com API real
- [ ] `src/services/orders.service.ts`
  - Implementar criação, listagem, detalhes

#### Carrinho
- [ ] Verificar se `cart.service.ts` usa API real
  - Implementar endpoints se não existirem
  - Implementar merge com localStorage

#### Checkout
- [ ] Substituir fluxo mock por chamadas reais
  - Validação de endereço via API
  - Cálculo de frete via API
  - Pagamento via Stripe/Mercado Pago

#### Dashboard Admin
- [ ] `src/lib/mock-data.ts` → `dashboardStats`, `salesData`, `topProducts`
  - Substituir por `dashboard.service.ts` com API real
- [ ] `src/services/dashboard.service.ts`
  - Implementar métricas com agregação real

#### Clientes
- [ ] `src/lib/mock-data.ts` → `customers` array
  - Substituir por `GET /admin/customers`

#### Wishlist
- [ ] Implementar se não existir
  - CRUD de wishlists
  - Compartilhamento

### Backend (regalaya-api)

#### Autenticação
- [ ] Verificar JWT expiration (15min)
- [ ] Verificar refresh token rotation
- [ ] Implementar logout que invalida tokens no Redis
- [ ] Implementar rate limiting (100 req/min)

#### Produtos
- [ ] Verificar busca full-text
- [ ] Implementar autocomplete
- [ ] Implementar cache Redis

#### Carrinho
- [ ] Verificar se existe endpoint de carrinho
- [ ] Implementar se não existir
- [ ] Validar estoque ao adicionar

#### Checkout
- [ ] Verificar criação de pedido atômico
- [ ] Implementar reserva de estoque
- [ ] Implementar cupons
- [ ] Implementar cálculo de frete

#### Pagamentos
- [ ] Verificar integração Stripe/Mercado Pago
- [ ] Implementar webhook handlers
- [ ] Implementar retry de pagamento

#### Notificações
- [ ] Implementar scheduler para lembretes
- [ ] Implementar fila de emails
- [ ] Implementar integração WhatsApp

#### IA
- [ ] Implementar RecommendationService
- [ ] Implementar MessageGenerationService
- [ ] Configurar pgvector para RAG
- [ ] Implementar cache Redis para IA

#### WhatsApp Bot
- [ ] Implementar webhook handler
- [ ] Implementar fluxo conversacional
- [ ] Implementar rate limiting

#### Admin
- [ ] Verificar endpoints de gestão
- [ ] Implementar relatórios avançados
- [ ] Implementar exportação CSV/Excel

---

## CRITÉRIOS DE ACEITE PARA REMOÇÃO DE MOCKS

1. **Zero dados hardcoded** - Todos os dados devem vir da API
2. **Loading states** - Skeletons/loaders para todas as requisições
3. **Error handling** - Tratamento de erros de API com UI amigável
4. **Offline handling** -graceful degradation se API indisponível
5. **Performance** - Resposta < 300ms para queries simples
6. **Testes** - Testes E2E cobrindo fluxos completos

---

## CONCLUSÃO

Este documento estabelece o planejamento completo com **27 épicos**, **145+ histórias de usuário** e **400+ tarefas técnicas**, cobrindo todas as funcionalidades do PRD.md. 

A remoção de mocks é tratada como parte integrada do planejamento, com checklist específico para frontend e backend.

**Próximos passos:**
1. Revisar e validar este documento com stakeholders
2. Priorizar épicos baseado em dependências e MVP
3. Atribuir épicos a sprints
4. Começar implementação pelo ÉPICO 01 (Infraestrutura)

---

**Documento criado:** 07 de abril de 2026  
**Versão:** 1.0  
**Status:** Pronto para revisão
