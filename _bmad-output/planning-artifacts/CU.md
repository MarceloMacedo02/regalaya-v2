# Regalaya - CU (UX Guidelines)

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Validado  
**Baseado em:** `docs/PRD.md`, `_bmad-output/planning-artifacts/CP-VP.md`

---

## 1. Princípios de Design

### 1.1 Princípios Fundamentais

| Princípio | Descrição | Aplicação |
|-----------|-----------|-----------|
| **WhatsApp-First** | Interface primária é conversacional | Fluxos otimizados para bot, não para web |
| **Proatividade** | Sistema antecipa necessidades | Notificações antes do usuário lembrar |
| **Simplicidade** | Máximo 3 passos para qualquer ação | Checkout em 3 passos, cadastro simplificado |
| **Personalização** | Cada interação é única | IA gera mensagens emocionais e contextuais |
| **Confiança** | Transparência em cada etapa | Confirmações visuais e por mensagem |

### 1.2 Hierarquia de Interfaces

```
1. WhatsApp Bot (Primária) - 80% das interações
2. Web App - Loja Virtual (Secundária) - 15% das interações  
3. Admin Dashboard (Backoffice) - 5% das interações
```

---

## 2. Diretrizes de UX por Canal

### 2.1 WhatsApp Bot UX

#### 2.1.1 Estrutura de Mensagens

```
📦 REGALAYA
━━━━━━━━━━━━━━━━━
Olá, Carlos! 👋

Lembrete: Aniversário da Ana em 7 dias!

🎁 Veja sugestões personalizadas:
[1] 💐 Buquê Premium - R$ 189
[2] 📚 Kit Leitura - R$ 145  
[3] 🕯️ Aromaterapia - R$ 120

Responda com o número ou "VER MAIS"
━━━━━━━━━━━━━━━━━
```

#### 2.1.2 Padrões de Interação

| Padrão | Descrição | Exemplo |
|--------|-----------|---------|
| **Menu Numérico** | Opções numeradas para seleção | "Responda 1, 2 ou 3" |
| **Botões Interativos** | Quick replies para ações comuns | [SIM] [NÃO] [VER MAIS] |
| **Fluxo Conversacional** | Passo a passo guiado | "Qual o nome da pessoa?" → "Qual o WhatsApp?" |
| **Confirmação Visual** | Emoji + resumo antes de ação | "🎁 Presente: Buquê Premium - R$ 189. Confirmar?" |

#### 2.1.3 Estados de Feedback

| Estado | Mensagem | Emoji |
|--------|----------|-------|
| **Processando** | "Estamos preparando suas sugestões..." | ⏳ |
| **Sucesso** | "Presente agendado com sucesso! 🎉" | ✅ |
| **Erro** | "Ops! Algo deu errado. Tente novamente." | ❌ |
| **Aguardando** | "Aguardando confirmação do endereço..." | 📍 |

### 2.2 Web App UX (Loja Virtual)

#### 2.2.1 Arquitetura de Informação

```
Homepage
├── Header
│   ├── Logo
│   ├── Busca (com autocomplete)
│   ├── Carrinho (badge com contador)
│   └── Login/Perfil
├── Hero Section
│   └── Banner promocional rotativo
├── Categorias
│   └── Grid responsivo (4 colunas desktop, 2 mobile)
├── Destaques IA
│   └── "Recomendados para você" (carousel)
├── Ocasiões
│   └── "Presentes para..." (cards temáticos)
└── Footer
    ├── Links institucionais
    ├── Redes sociais
    └── Newsletter signup
```

#### 2.2.2 Padrões de Componentes

| Componente | Comportamento | Responsividade |
|------------|---------------|----------------|
| **Product Card** | Hover: zoom + quick view | 4 cols → 2 cols → 1 col |
| **Filtros** | Sidebar desktop, drawer mobile | Collapsible em mobile |
| **Busca** | Autocomplete com imagens | Full-width em mobile |
| **Carrinho** | Slide-in drawer | Full-screen em mobile |
| **Checkout** | Stepper visual (3 passos) | Vertical em mobile |

#### 2.2.3 Estados de Página

| Estado | Design | Copy |
|--------|--------|------|
| **Loading** | Skeleton screens | "Carregando presentes especiais..." |
| **Empty** | Ilustração + CTA | "Nenhum presente encontrado. Que tal explorar categorias?" |
| **Error** | Ilustração + retry | "Ops! Não conseguimos carregar. Tente novamente." |
| **Success** | Confirmação visual + próximo passo | "Presente comprado! 🎉 Acompanhe a entrega aqui." |

### 2.3 Admin Dashboard UX

#### 2.3.1 Layout Principal

```
┌─────────────────────────────────────────┐
│ [Logo]  [Busca]           [🔔] [👤 Admin] │
├──────────┬──────────────────────────────┤
│          │                              │
│ 📊 Dashboard │  KPIs + Gráficos         │
│ 📦 Produtos  │  Tabela com ações        │
│ 🛒 Pedidos   │  Status tracking         │
│ 👥 Clientes  │  Lista + segmentação     │
│ 📝 Conteúdo  │  Editor WYSIWYG          │
│ ⚙️ Config    │  Formulários             │
│          │                              │
└──────────┴──────────────────────────────┘
```

#### 2.3.2 Padrões de Tabela

| Elemento | Comportamento |
|----------|---------------|
| **Ordenação** | Click no header, indicador visual |
| **Filtros** | Multi-select, date range, search |
| **Ações em Massa** | Checkbox + toolbar contextual |
| **Paginação** | 25/50/100 por página |
| **Exportação** | CSV/Excel com filtros aplicados |

---

## 3. Design System

### 3.1 Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `--primary` | `#8B5CF6` | Botões primários, links, destaques |
| `--primary-hover` | `#7C3AED` | Hover states |
| `--secondary` | `#EC4899` | Ações secundárias, badges |
| `--success` | `#10B981` | Confirmações, status positivo |
| `--warning` | `#F59E0B` | Alertas, atenção |
| `--error` | `#EF4444` | Erros, status negativo |
| `--neutral-900` | `#111827` | Texto primário |
| `--neutral-600` | `#4B5563` | Texto secundário |
| `--neutral-100` | `#F3F4F6` | Backgrounds |

### 3.2 Tipografia

| Token | Size | Weight | Line Height | Uso |
|-------|------|--------|-------------|-----|
| `--text-xs` | 12px | 400 | 16px | Labels, captions |
| `--text-sm` | 14px | 400 | 20px | Body text, forms |
| `--text-base` | 16px | 400 | 24px | Conteúdo principal |
| `--text-lg` | 18px | 500 | 28px | Subtítulos |
| `--text-xl` | 20px | 600 | 28px | Títulos de seção |
| `--text-2xl` | 24px | 700 | 32px | Títulos de página |
| `--text-3xl` | 30px | 700 | 36px | Hero text |

### 3.3 Espaçamento

| Token | Value | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Gap mínimo |
| `--space-2` | 8px | Padding interno |
| `--space-3` | 12px | Gap entre elementos |
| `--space-4` | 16px | Padding padrão |
| `--space-6` | 24px | Seções |
| `--space-8` | 32px | Layout gaps |
| `--space-12` | 48px | Seções grandes |
| `--space-16` | 64px | Hero spacing |

### 3.4 Componentes Base

#### Botões

```css
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}
```

#### Cards

```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 24px;
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}
```

---

## 4. Fluxos de Usuário Detalhados

### 4.1 Jornada: Primeiro Acesso → Cadastro (WhatsApp)

```
1. Usuário envia /start
   → Bot: "Olá! 👋 Sou o assistente Regalaya..."
   → Botões: [Cadastrar Pessoa] [Ver Datas] [Presentes] [Ajuda]

2. Usuário clica [Cadastrar Pessoa]
   → Bot: "Qual o nome da pessoa?"
   → Usuário digita nome

3. Bot: "Agora, encaminhe o contato do WhatsApp dela 👇"
   → Usuário faz forward do contato

4. Bot: "Qual o tipo de data?"
   → Botões: [🎂 Aniversário] [💕 Dia dos Namorados] [🎄 Natal] [💒 Casamento]

5. Usuário seleciona tipo
   → Bot: "Qual a data? (DD/MM/AAAA)"
   → Usuário digita data

6. Bot: "✅ Pronto! Ana está cadastrada. Te aviso 7 dias antes! 🎉"
```

### 4.2 Jornada: Notificação → Compra (WhatsApp → Web)

```
1. Sistema envia notificação (7 dias antes)
   → "🎁 Aniversário da Ana em 7 dias! Veja sugestões:"
   → Botões: [VER SUGESTÕES] [AGENDAR LEMBRETE] [IGNORAR]

2. Usuário clica [VER SUGESTÕES]
   → Bot: "Baseado no perfil da Ana:"
   → Lista: 3-5 produtos com foto + preço
   → Botões numerados: [1] [2] [3] [VER MAIS]

3. Usuário seleciona produto
   → Bot: "📦 Buquê Premium - R$ 189"
   → Botões: [COMPRAR] [VER OUTROS] [VOLTAR]

4. Usuário clica [COMPRAR]
   → Bot: "🔗 Finalize pelo app: [link]"
   → Redireciona para web app

5. Web App: Checkout em 3 passos
   → Passo 1: Endereço (preenchido se existente)
   → Passo 2: Pagamento (PIX/Cartão)
   → Passo 3: Confirmação

6. Confirmação
   → Web: "✅ Compra realizada!"
   → WhatsApp: "🎉 Presente comprado! Entrega prevista: 15/04"
```

### 4.3 Jornada: Admin → Gestão de Produtos

```
1. Admin acessa /admin
   → Login com credenciais
   → Dashboard com KPIs

2. Navega para "Produtos"
   → Tabela com lista de produtos
   → Filtros: Categoria, Status, Preço
   → Botão: [NOVO PRODUTO]

3. Clica [NOVO PRODUTO]
   → Formulário:
     - Nome (text)
     - Descrição (textarea)
     - Preço (currency)
     - Categoria (select)
     - Imagens (upload múltiplo)
     - Estoque (number)
   → Botões: [SALVAR] [CANCELAR]

4. Salva produto
   → Toast: "✅ Produto criado com sucesso!"
   → Redireciona para lista
```

---

## 5. Acessibilidade

### 5.1 Diretrizes WCAG 2.1 AA

| Critério | Implementação |
|----------|---------------|
| **Contraste** | Mínimo 4.5:1 para texto normal |
| **Navegação por teclado** | Tab order lógico, focus visible |
| **Alt text** | Todas as imagens descritivas |
| **ARIA labels** | Componentes interacionais etiquetados |
| **Redução de movimento** | `prefers-reduced-motion` respeitado |

### 5.2 Testes de Acessibilidade

- Lighthouse Accessibility Score > 90
- axe-core automated tests
- Manual keyboard navigation testing
- Screen reader testing (NVDA/VoiceOver)

---

## 6. Performance UX

### 6.1 Métricas de Performance

| Métrica | Meta | Estratégia |
|---------|------|------------|
| **LCP** | < 2.5s | SSR/SSG, image optimization |
| **FID** | < 100ms | Code splitting, lazy loading |
| **CLS** | < 0.1 | Dimensionamento explícito de imagens |
| **TTI** | < 3.5s | Critical CSS, deferred JS |

### 6.2 Estados de Loading

| Contexto | Pattern | Copy |
|----------|---------|------|
| **Página inicial** | Skeleton screens | "Carregando..." |
| **Busca** | Inline spinner | "Buscando presentes..." |
| **Checkout** | Progress bar | "Processando pagamento..." |
| **Upload** | Progress % | "Enviando imagem 2/5..." |

---

## 7. Microcopy

### 7.1 Mensagens de Erro

| Contexto | Copy |
|----------|------|
| **Form inválido** | "Por favor, verifique os campos destacados" |
| **Pagamento falhou** | "Não foi possível processar. Tente outro método" |
| **Produto esgotado** | "Indisponível no momento. Que tal ver similares?" |
| **Timeout** | "Demorou mais que o esperado. Tente novamente" |

### 7.2 Mensagens de Sucesso

| Contexto | Copy |
|----------|------|
| **Cadastro** | "✅ Conta criada! Bem-vindo à Regalaya!" |
| **Compra** | "🎉 Presente comprado! Entrega prevista: {data}" |
| **Agendamento** | "⏰ Lembrete agendado para {data}" |

---

## 8. Validação de UX

### 8.1 Critérios de Aceite UX

| Critério | Métrica | Target |
|----------|---------|--------|
| **Usabilidade** | SUS Score | > 75 |
| **Satisfação** | NPS | > 50 |
| **Eficiência** | Tempo para primeira compra | < 3 min |
| **Acessibilidade** | Lighthouse A11y | > 90 |
| **Performance** | Lighthouse Performance | > 90 |

### 8.2 Testes de Usabilidade

| Teste | Participantes | Métrica |
|-------|---------------|---------|
| **Cadastro de contato** | 5 usuários | Taxa de sucesso > 90% |
| **Compra de presente** | 5 usuários | Tempo < 3 min |
| **Gestão de produto (Admin)** | 3 admins | Erros < 2 por sessão |

---

## 9. Anexos

### 9.1 Referências

- PRD: `docs/PRD.md`
- CP/VP: `_bmad-output/planning-artifacts/CP-VP.md`
- Design System: `regalaya-web/src/components/ui/`

### 9.2 Histórico de Revisões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 07/04/2026 | BMad Orchestrator | Criação inicial |

---

**Documento criado:** 07 de abril de 2026  
**Próxima revisão:** Após primeiros testes de usabilidade  
**Responsável:** UX Designer + Product Manager
