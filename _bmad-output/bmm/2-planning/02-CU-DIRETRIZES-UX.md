# UX - DIRETRIZES DE EXPERIÊNCIA DO USUÁRIO

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Validado  
**Artefato:** CU - Customer Experience  
**Referência:** `../docs/PRD.md`  

---

## 1. PERSONAS E JORNADAS

### 1.1 Persona Primária: Carlos (Executivo Ocupado)

| Atributo | Valor |
|----------|-------|
| **Idade** | 32 anos |
| **Ocupação** | Gerente de Vendas |
| **Renda** | R$ 15.000/mês |
| **Dor Principal** | Trabalha 60h/semana, esquece datas importantes |
| **Objetivo** | Manter relacionamentos sem gastar tempo |
| **Comportamento** | Usa WhatsApp intensivamente, compra online |
| **Frustração** | Já esqueceu aniversário da namorada 2x |

**Jornada Chave:**
```
Pesquisa → Escolhe presente → Checkout rápido → Presta atenção
     ↑                                                    ↓
     └──────── Notificação no WhatsApp ←──────────────────┘
```

**Requisito UX:** Interface mobile-first, checkout em 3 cliques, integração WhatsApp nativa.

### 1.2 Persona Secundária: Juliana (Organizada)

| Atributo | Valor |
|----------|-------|
| **Idade** | 28 anos |
| **Ocupação** | Designer Freelancer |
| **Renda** | R$ 8.000/mês |
| **Dor Principal** | Quer presentear bem mas não tem tempo |
| **Objetivo** | Presentes criativos e significativos |
| **Comportamento** | Early adopter, valoriza curadoria |
| **Frustração** | Perde horas em e-commerces |

**Jornada Chave:**
```
Explora → Descobre curadoria → Confia na IA → Personaliza mensagem → Compra
```

**Requisito UX:** Catálogo visual rico, recomendações transparentes, editor de mensagens.

### 1.3 Persona Admin: Roberto (Gestor)

| Atributo | Valor |
|----------|-------|
| **Idade** | 35 anos |
| **Ocupação** | Admin de plataforma |
| **Renda** | R$ 12.000/mês |
| **Dor Principal** | Precisa gerenciar manualmente |
| **Objetivo** | Dashboard unificado e relatórios automáticos |
| **Comportamento** | Usa múltiplas ferramentas |
| **Frustração** | Perde tempo consolidando dados |

**Requisito UX:** Dashboard com KPIs claros, exportação fácil, automações.

---

## 2. PRINCÍPIOS DE DESIGN

### 2.1 Princípios WDSD (We Design Something Different)

| Princípio | Descrição | Aplicação |
|-----------|-----------|-----------|
| **Simplicidade** | Menos é mais | Checkout em 3 passos, UI limpa |
| **Velocidade** | Cada segundo conta | < 2s homepage, < 300ms API |
| **Confiança** | Transações seguras | SSL, badges, reviews |
| **Entrega** | Promise é promise | Tracking em tempo real |
| **Curadoria** | IA que entende | Recomendações personalizadas |
| **Omnicanal** | Onde o usuário estiver | WhatsApp + Web |

### 2.2 Atomic Design - Componentes

#### Átomos (Branding + UI Kit)

| Componente | Estado | Descrição |
|------------|--------|-----------|
| Logo | default, hover | Brand mark |
| Button | default, hover, active, disabled, loading | CTA principal |
| Input | default, focus, error, disabled | Campos de formulário |
| Badge | success, warning, error, info | Status indicators |
| Avatar | default, loading, error | Imagens de perfil |
| Icon | 24px, 20px, 16px | Sistema de ícones |

#### Moléculas (Composição)

| Componente | Estados | Descrição |
|------------|---------|-----------|
| ProductCard | default, hover, out-of-stock, sale | Card de produto |
| CartItem | default, updating, removing | Item do carrinho |
| ContactCard | default, editing, deleting | Card de contato |
| DateCountdown | default, urgent, passed | Countdown de data |
| NotificationItem | unread, read, urgent | Item de notificação |

#### Organismos (Seções)

| Componente | Estados | Descrição |
|------------|---------|-----------|
| ProductGrid | loading, empty, populated, filtered | Grid de produtos |
| CartDrawer | empty, populated, updating | Drawer do carrinho |
| CheckoutSteps | step-1, step-2, step-3, complete | Steps de checkout |
| ContactList | empty, loading, populated | Lista de contatos |
| DashboardKPIs | loading, populated | Cards de métricas |

#### Templates (Layouts)

| Template | Descrição |
|----------|-----------|
| HomeTemplate | Hero + Categorias + Destaques |
| ProductTemplate | Gallery + Info + Related |
| CheckoutTemplate | Steps + Cart Summary |
| AdminTemplate | Sidebar + Content + Header |
| DashboardTemplate | KPIs + Charts + Tables |

---

## 3. USER FLOWS

### 3.1 Flow: Cadastro de Pessoa Querida

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CADASTRO DE PESSOA                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────┐ │
│  │  Início │───▶│ Nome?       │───▶│ Telefone?    │───▶│  Tipo?  │ │
│  └─────────┘    └─────────────┘    └──────────────┘    └─────────┘ │
│                                                          │          │
│                    ┌──────────────┐    ┌──────────────┐ │          │
│                    │ ✅ Sucesso!   │◀───│ Data?        │◀─┘          │
│                    └──────────────┘    └──────────────┘              │
│                                                                     │
│  Duração estimada: 45 segundos                                     │
│  Gesto principal: Tapping + Teclado                                │
│  Fallback: Encaminhar contato WhatsApp                              │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Flow: Compra de Presente

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLOW DE COMPRA                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Notificação]          [Catálogo]         [Detalhes]               │
│  ┌─────────────┐        ┌───────────┐      ┌─────────────┐         │
│  │ 7 dias     │───────▶│ Filtrar   │─────▶│ Ver produto │         │
│  │ antes      │        │ Buscar    │      │ Preço      │         │
│  │ da data    │        │ Categorias│      │ Descrição  │         │
│  └─────────────┘        └───────────┘      └─────────────┘         │
│                                                 │                   │
│                                                 ▼                   │
│  [Checkout]              [Pagamento]          [Confirmação]         │
│  ┌───────────┐          ┌────────────┐       ┌─────────────┐       │
│  │ Endereço  │─────────▶│ PIX/Cartão│──────▶│ Pedido #X  │       │
│  │ Frete     │          │ Aguardar   │       │ Sucesso!    │       │
│  │ Resumo    │          └────────────┘       └─────────────┘       │
│  └───────────┘                                                        │
│                                                                     │
│  Tempo total: < 3 minutos                                           │
│  Pontos de fricção: Endereço (mitigar com auto-complete)            │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Flow: WhatsApp Bot

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WHATSAPP BOT                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Olá! 👋 Bem-vindo ao Regalaya!                              │    │
│  │                                                              │    │
│  │ O que você quer fazer?                                       │    │
│  │                                                              │    │
│  │ [1] 📋 Cadastrar pessoa                                     │    │
│  │ [2] 📅 Ver datas próximas                                    │    │
│  │ [3] 🎁 Ver presentes                                         │    │
│  │ [4] ❓ Ajuda                                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Resposta esperada: 1, 2, 3 ou 4                                   │
│  Timeout: 5 minutos (volta ao início)                              │
│  Fallback: Menu de ajuda                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. WIREFRAMES (Estrutura)

### 4.1 Homepage (Web)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]          🔍 Buscar...        🛒 Carrinho (3)    👤 Login │ ← Header
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │     "A única plataforma que resolve o ciclo             │   │ ← Hero
│  │      completo de presentear: lembra, escolhe            │   │
│  │      e entrega — tudo pelo WhatsApp."                   │   │
│  │                                                          │   │
│  │     [ Ver Presentes ]                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📅 Suas datas próximas:                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │ ← Countdown
│  │ Anivers. │  │ Dia dos  │  │ Natal    │                    │
│  │ Maria    │  │ Namorados│  │ Familia  │                    │
│  │ 5 dias   │  │ 12 dias  │  │ 45 dias  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  🎁 Presentes Sugeridos (IA):                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │ ← Grid
│  │  img    │  │  img    │  │  img    │  │  img    │           │
│  │ Nome    │  │ Nome    │  │ Nome    │  │ Nome    │           │
│  │ R$ 99   │  │ R$ 149  │  │ R$ 199  │  │ R$ 299  │           │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Footer: Links, Redes Sociais, CNPJ]                            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  ☰ Menu   Dashboard   [Logo Admin]              👤 Admin ▼     │ ← Header
├────────────┬────────────────────────────────────────────────────┤
│            │                                                     │
│ 📊 Dashboard│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────┐│
│            │  │ R$ 156k  │ │ 234      │ │ 189      │ │ 670 ││ ← KPIs
│ 📦 Produtos│  │ Receita   │ │ Pedidos  │ │ Clientes │ │Tkt Md││
│            │  │ +12.5%   │ │ +8.3%    │ │ +15.2%   │ │     ││
│ 📋 Pedidos│  └──────────┘ └──────────┘ └──────────┘ └─────┘│
│            │                                                     │
│ 👥 Clientes│  ┌───────────────────────────────────────────┐   │
│            │  │                                                   │ ← Chart
│ 📈 Analytics│ │  Gráfico de Vendas (Últimos 7 dias)          │   │
│            │  │                                                   │   │
│ 🖥️ Conteúdo │  └───────────────────────────────────────────┘   │
│            │                                                     │
│ ⚙️ Config  │  ┌───────────────────────────────────────────┐   │
│            │  │ Pedidos Recentes                             │   │ ← Table
│            │  │ #1234 | João | R$ 299 | Entregue | 10:30   │   │
│            │  │ #1235 | Maria | R$ 159 | Enviado | 11:45   │   │
│            │  └───────────────────────────────────────────┘   │
└────────────┴────────────────────────────────────────────────────┘
                    ↑ Sidebar                                      ↑ Content
```

---

## 5. SISTEMA DE DESIGN

### 5.1 Tokens de Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `primary-500` | `#8B5CF6` | Botões primários, links |
| `primary-600` | `#7C3AED` | Hover primário |
| `primary-100` | `#EDE9FE` | Backgrounds primários |
| `secondary-500` | `#EC4899` | Acentos, destaques |
| `success-500` | `#10B981` | Sucesso, verde |
| `warning-500` | `#F59E0B` | Avisos, amarelo |
| `error-500` | `#EF4444` | Erros, vermelho |
| `neutral-900` | `#111827` | Texto primário |
| `neutral-500` | `#6B7280` | Texto secundário |
| `neutral-100` | `#F3F4F6` | Backgrounds |

### 5.2 Tokens de Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Micro-gap |
| `space-2` | 8px | Tight-gap |
| `space-3` | 12px | Default-gap |
| `space-4` | 16px | Section-gap |
| `space-6` | 24px | Component-gap |
| `space-8` | 32px | Section-gap |
| `space-12` | 48px | Page-gap |

### 5.3 Tokens Tipográficos

| Token | Tamanho | Line-height | Uso |
|-------|---------|-------------|-----|
| `text-xs` | 12px | 16px | Labels, captions |
| `text-sm` | 14px | 20px | Body small |
| `text-base` | 16px | 24px | Body default |
| `text-lg` | 18px | 28px | Body large |
| `text-xl` | 20px | 28px | H4 |
| `text-2xl` | 24px | 32px | H3 |
| `text-3xl` | 30px | 36px | H2 |
| `text-4xl` | 36px | 40px | H1 |

### 5.4 Tokens de Breakpoints

| Token | Largura | Dispositivo |
|-------|---------|-------------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |
| `2xl` | 1536px | TV/Monitor |

---

## 6. ESTADOS DE COMPONENTES

### 6.1 Estados de Loading

| Tipo | Implementação | Quando usar |
|------|---------------|-------------|
| Skeleton | Placeholder animado | Grid de produtos, listas |
| Spinner | Ícone girando | Botões, ações |
| Progress | Barra de progresso | Upload, importação |
| Pulse | Opacidade variante | Elementos pequenos |

### 6.2 Estados de Erro

| Erro | UI | Mensagem |
|------|----|----------|
| Network | Toast + Retry | "Ops! Problema de conexão. Tentar novamente?" |
| Validation | Inline error | "Campo obrigatório" |
| Server | Full page | "Algo deu errado. Tentar novamente." |
| Empty | Ilustração + CTA | "Nenhum produto encontrado. Explore!" |

### 6.3 Estados de Empty

| Empty | Ilustração | CTA |
|-------|------------|-----|
| Carrinho | 🛒 | "Comece a explorar presentes" |
| Busca | 🔍 | "Tente outros termos" |
| Pedidos | 📦 | "Você ainda não fez pedidos" |
| Wishlist | ❤️ | "Salve produtos para depois" |

---

## 7. ACESSIBILIDADE (WCAG 2.1 AA)

### 7.1 Requisitos

| Critério | Nível | Implementação |
|----------|-------|---------------|
| Contraste | 4.5:1 | Cores do design system |
| Keyboard | 100% | Tab navigation, focus states |
| ARIA | A-Z | Labels, roles, live regions |
| Alt text | 100% | Imagens descritivas |
| Touch target | 44x44px | Botões, inputs |

### 7.2 Focus States

```css
/* Não fazer isso ❌ */
*:focus { outline: none; }

/* Fazer isso ✅ */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

---

## 8. PERFORMANCE UX

### 8.1 Métricas Core Web Vitals

| Métrica | Boa | Needs Work | Target |
|---------|-----|------------|--------|
| LCP | < 2.5s | > 4.0s | < 2.0s |
| FID | < 100ms | > 300ms | < 50ms |
| CLS | < 0.1 | > 0.25 | < 0.05 |

### 8.2 Estratégias

| Técnica | Impacto | Implementação |
|---------|---------|---------------|
| Code splitting | Alta | Next.js dynamic imports |
| Image optimization | Alta | Next/Image, CDN |
| Font subsetting | Média | Google Fonts subset |
| Lazy loading | Alta | Intersection Observer |
| Prefetch | Média | Next.js Link prefetch |

---

## 9. CHECKLIST UX

### 9.1 Pré-Implementação

- [ ] Design tokens exportados
- [ ] Componentes atômicos criados
- [ ] Wireframes validados
- [ ] Personas revisadas
- [ ] Flows assinados pelo PO

### 9.2 Durante Implementação

- [ ] Responsividade testada (mobile-first)
- [ ] Acessibilidade verificada (axe-core)
- [ ] Performance monitorada (Lighthouse)
- [ ] Estados handled (loading, error, empty)
- [ ] Consistência com design system

### 9.3 Pós-Implementação

- [ ] UX Review concluído
- [ ] Teste com usuários reais
- [ ] Ajustes de based em feedback
- [ ] Documentação atualizada

---

## 10. CONCLUSÃO

Este documento estabelece as diretrizes UX para o projeto Regalaya, garantindo:

- ✅ Alinhamento com personas e jornadas
- ✅ Consistência com design system
- ✅ Acessibilidade WCAG 2.1 AA
- ✅ Performance otimizada
- ✅ Estados completos de componentes

**Próximo passo:** Integrar com Arquitetura Técnica (CA)

---

**Documento criado:** 07 de abril de 2026  
**Versão:** 1.0  
**Status:** Pronto para Implementação
