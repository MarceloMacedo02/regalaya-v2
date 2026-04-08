---
name: regalaya-page-design-system
description: >
  Skill para padronizar todas as páginas do projeto Regalaya seguindo o Design System estabelecido.
  Use esta skill SEMPRE que criar novas páginas, componentes, formulários ou qualquer elemento de UI.
  Garante consistência visual, layout, estilo e experiência do usuário.
version: 1.0.0
author: Regalaya Team
created: 2026-04-03
updated: 2026-04-03
---

# Regalaya Page Design System

## Quando Usar

Use esta skill **SEMPRE** que:
- ✅ Criar uma nova página no projeto
- ✅ Criar novos componentes de UI
- ✅ Modificar layout de páginas existentes
- ✅ Criar formulários ou formulários complexos
- ✅ Implementar elementos de interface (botões, cards, modais, etc.)
- ✅ Revisar código para padronização visual
- ✅ Criar variações responsivas (mobile, tablet, desktop)

## Quando NÃO Usar

Não use esta skill para:
- ❌ Lógica de negócio pura (services, hooks, utils)
- ❌ Configurações de infraestrutura (Docker, CI/CD, etc.)
- ❌ Testes unitários (a menos que envolvam componentes visuais)
- ❌ Scripts de automação

## Estrutura da Skill

```
.qwen/skills/regalaya-page-design-system/
├── SKILL.md                    # Documento principal (regras, padrões, checklist)
├── style-guide.md              # Guia de estilo completo (cores, tipografia, espaçamento, etc.)
├── component-library.md        # Referência de componentes disponíveis
└── page-templates.md           # Templates de páginas prontas para uso
```

## Como Usar

### 1. Ao Criar Nova Página

```bash
# Passo 1: Consultar SKILL.md para estrutura padrão
# Passo 2: Escolher template em page-templates.md
# Passo 3: Adaptar conteúdo mantendo estrutura
# Passo 4: Usar componentes de component-library.md
# Passo 5: Validar com checklist em SKILL.md
```

### 2. Ao Criar Componente

```bash
# Passo 1: Verificar se componente já existe em component-library.md
# Passo 2: Se existir, reutilizar
# Passo 3: Se não existir, criar seguindo style-guide.md
# Passo 4: Adicionar à component-library.md
```

### 3. Ao Modificar Página Existente

```bash
# Passo 1: Comparar com templates em page-templates.md
# Passo 2: Identificar divergências do padrão
# Passo 3: Corrigir cores, tipografia, espaçamento
# Passo 4: Validar responsividade e acessibilidade
```

## Regras Fundamentais

### 1. Cores

**SEMPRE** usar cores do Design System:
- Primary: `#be7374`
- Primary Light: `#fed2cc`
- Text Secondary: `#788090`
- Surface Alt: `#f9f6f0`

**NUNCA** usar cores hardcoded fora do padrão.

### 2. Tipografia

**SEMPRE** usar fontes do sistema:
- Corpo: `font-['Jost',sans-serif]`
- Títulos decorativos: `font-['Sacramento',cursive]`

**SEMPRE** usar tamanhos padrão (xs, sm, base, lg, xl, 2xl, 3xl, 5xl, 6xl).

### 3. Layout

**SEMPRE** seguir estrutura:
```
Top Bar → Header → Nav → (Sidebar + Content) → Footer
```

**SEMPRE** usar container padrão:
```tsx
<div className="container mx-auto px-4">
```

### 4. Responsividade

**SEMPRE** usar abordagem mobile-first:
```tsx
// Mobile primeiro → Desktop depois
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

### 5. Acessibilidade

**SEMPRE** incluir:
- `alt` em imagens
- `aria-label` em botões sem texto
- `role` em elementos semânticos
- Focus states visíveis
- Contraste mínimo 4.5:1

### 6. Performance

**SEMPRE** otimizar imagens:
```tsx
// Above the fold
<Image priority sizes="100vw" />

// Below the fold
<Image loading="lazy" sizes="(max-width: 768px) 50vw, 400px" />
```

### 7. Componentes

**SEMPRE** reutilizar componentes existentes antes de criar novos.

**SEMPRE** criar componentes reutilizáveis quando padrão se repete 3+ vezes.

## Checklist de Validação

Antes de commitar, verificar:

- [ ] Layout segue estrutura padrão
- [ ] Cores usam tokens do Design System
- [ ] Tipografia usa fontes e tamanhos padrão
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Imagens com `alt`, `sizes` e `loading`
- [ ] Botões com `aria-label` quando necessário
- [ ] Links com estados hover/focus
- [ ] Formulários com validação e labels
- [ ] Animações suaves (200-500ms)
- [ ] Sidebar oculta em mobile (se aplicável)
- [ ] Grid responsivo configurado
- [ ] Footer presente em todas as páginas
- [ ] Breadcrumb em páginas internas

## Referências Rápidas

### Cores Principais
```
Primary: #be7374
Primary Light: #fed2cc
Text: #788090
Surface Alt: #f9f6f0
Star Gold: #fcb900
```

### Fontes
```
Primary: Jost, sans-serif
Display: Sacramento, cursive
```

### Tamanhos de Texto
```
xs: 10px | sm: 12px | base: 13px | lg: 16px
xl: 20px | 2xl: 24px | 3xl: 32px | 5xl: 48px | 6xl: 64px
```

### Espaçamento
```
Base: 4px scale (1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px, etc.)
```

### Border Radius
```
sm: 4px | md: 8px | lg: 12px | xl: 16px | 2xl: 24px | full: 9999px
```

## Manutenção da Skill

Esta skill deve ser atualizada quando:
- Novos componentes forem criados
- Cores do Design System mudarem
- Novos padrões de layout forem estabelecidos
- Breaking changes no Tailwind ou Next.js

Para atualizar, editar os arquivos em:
```
.qwen/skills/regalaya-page-design-system/
```

## Exemplo de Uso

### Cenário: Criar página de FAQ

```tsx
// 1. Copiar template base de page-templates.md
// 2. Adaptar conteúdo para FAQ
// 3. Usar componentes existentes (Accordion, etc.)
// 4. Seguir padrão de cores e tipografia
// 5. Validar com checklist

import { Accordion } from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="text-[#788090] hover:text-[#be7374]">Home</a></li>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <li className="text-black font-medium">FAQ</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-[#f9f6f0] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-['Sacramento',cursive] text-black mb-4">
            Perguntas Frequentes
          </h1>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {/* FAQ items */}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
```

---

**Última atualização**: 2026-04-03
**Versão**: 1.0.0
