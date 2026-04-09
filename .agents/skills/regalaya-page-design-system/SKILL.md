# Regalaya Page Design System Skill

## Descrição

Skill para padronizar todas as páginas do projeto Regalaya seguindo o Design System estabelecido, garantindo consistência visual, layout, estilo e experiência do usuário.

---

## 🎨 Design Tokens

### Cores Principais

```css
/* Primary */
--color-primary: #be7374;           /* Rosa principal - CTAs, links ativos, destaques */
--color-primary-light: #fed2cc;     /* Rosa claro - backgrounds, ribbons */
--color-primary-hover: #a86263;     /* Rosa hover */

/* Neutrals */
--color-surface: #ffffff;           /* Fundo de superfícies */
--color-surface-alt: #f9f6f0;       /* Fundo alternativo (hero, banners) */
--color-border: #e5e5e5;            /* Bordas padrão */
--color-border-dotted: #d1d1d1;     /* Bordas pontilhadas */

/* Text */
--color-text-primary: #1a1a1a;      /* Texto principal (títulos) */
--color-text-secondary: #788090;    /* Texto secundário (corpo) */
--color-text-muted: #9ca3af;        /* Texto terciário (labels) */

/* Accent */
--color-accent: #fcb900;            /* Amarelo - estrelas, badges */
--color-success: #22c55e;           /* Verde - sucesso */
--color-error: #ef4444;             /* Vermelho - erros */
```

### Tipografia

```css
/* Fontes */
--font-primary: 'Jost', sans-serif;           /* Corpo de texto */
--font-display: 'Sacramento', cursive;        /* Títulos decorativos */

/* Tamanhos */
--text-xs: 10px;     /* Labels, badges */
--text-sm: 12px;     /* Links, navegação */
--text-base: 13px;   /* Corpo de texto */
--text-lg: 16px;     /* Subtítulos */
--text-xl: 20px;     /* Títulos pequenos */
--text-2xl: 24px;    /* Títulos médios */
--text-3xl: 32px;    /* Títulos grandes */
--text-5xl: 48px;    /* Hero titles */
--text-6xl: 64px;    /* Display titles */

/* Pesos */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-bold: 700;
--font-black: 900;
```

### Espaçamento

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## 📐 Layout Structure

### Estrutura Padrão de Páginas

```
┌─────────────────────────────────────────────┐
│  TOP BAR (Barra Superior)                   │
│  - Endereço | Idioma | Links úteis          │
├─────────────────────────────────────────────┤
│  MAIN HEADER                                │
│  - Logo (Sacramento font)                   │
│  - Info blocks (Frete, Suporte, Carrinho)   │
├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤
│  MAIN NAV (Navegação Principal)              │
│  - HOME  SHOP  PAGES  BLOG  CONTACT         │
│  - Mega menu no hover (SHOP)                │
├──────────────┬──────────────────────────────┤
│   SIDEBAR    │   MAIN CONTENT               │
│   (280px)    │                              │
│              │   - Hero Banner (opcional)   │
│ Categorias   │   - Promo Banners            │
│ Widgets      │   - Product Grid             │
│              │   - Content Sections         │
│              │   - CTA Section              │
├──────────────┴──────────────────────────────┤
│  FOOTER                                     │
│  - Links | Newsletter | Social | Copyright  │
└─────────────────────────────────────────────┘
```

### Container Padrão

```tsx
// Container padrão para conteúdo
<div className="container mx-auto px-4">
  {/* conteúdo */}
</div>

// Container wide (full-width sections)
<div className="container mx-auto px-4 max-w-7xl">
  {/* conteúdo */}
</div>
```

---

## 🧩 Componentes Padrão

### 1. Top Bar

```tsx
// src/components/web/top-bar.tsx
// Barra superior fina com borda inferior
// Altura: ~32px (py-2)
// Font: 13px
// Items: Endereço, Idioma, Links (Sign In, About, Track, FAQ)
```

**Regras:**
- Borda inferior: `border-b border-gray-100`
- Texto cinza escuro: `text-[#788090]`
- Links hover: `text-[#be7374]`
- Escondido em mobile: `hidden md:flex`

---

### 2. Main Header

```tsx
// src/components/web/main-header.tsx
// Header principal com logo e info blocks
// Padding: py-8
// Layout: flex-col lg:flex-row
```

**Regras:**
- Logo: `text-5xl font-black text-black tracking-tighter` + font Sacramento
- Info blocks: Ícones 36px + texto em 2 linhas
- Separadores: `h-8 w-[1px] bg-gray-100`
- Carrinho badge: `bg-[#be7374] text-white`

---

### 3. Main Navigation

```tsx
// src/components/web/main-nav.tsx
// Navegação com borda pontilhada superior
// Items uppercase com tracking-widest
```

**Regras:**
- Borda superior: `border-t border-dotted border-gray-300`
- Items: `text-[12px] font-bold tracking-widest`
- Item ativo: Ribbon effect com `bg-[#fed2cc]` + clip-path
- Hover: `text-[#be7374]`

---

### 4. Ribbon Effect (Item Ativo)

```css
.active-ribbon {
  background-color: #fed2cc;
  clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
  padding-left: 32px !important;
  padding-right: 32px !important;
  margin-left: 8px;
  margin-right: 8px;
}
```

---

### 5. Sidebar

```tsx
// src/components/web/sidebar.tsx
// Sidebar fixa (desktop) 280px
// Oculta em mobile (< lg)
```

**Regras:**
- Box categorias: `bg-[#fed2cc]/60 rounded-lg p-6 pt-10`
- Divisórias: `divide-y divide-dotted divide-[#be7374]/30`
- Widgets: `bg-white border border-gray-100 rounded-xl p-8 text-center`
- Ícones widgets: `w-16 h-16 bg-gray-50 rounded-full`

---

### 6. Hero Banner

```tsx
// src/components/web/hero-banner.tsx
// Banner principal com altura mínima 500px
// Background: #f9f6f0
// Bordas arredondadas: rounded-2xl
```

**Regras:**
- Badge: `text-[12px] tracking-[0.4em] uppercase text-gray-400`
- Título: `text-6xl md:text-7xl font-bold text-gray-900 tracking-tighter`
- Preço: `text-xs font-bold uppercase text-gray-400`
- Botão: `bg-white text-black px-12 py-3 rounded-full text-[11px] font-bold uppercase`

---

### 7. Product Card

```tsx
// Componente de produto no grid
<div className="group text-center">
  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f9f9f9] mb-4">
    <img className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
    {/* Hover actions overlay */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      {/* Ícones: ShoppingBag, Search, Heart */}
    </div>
  </div>
  <p className="text-[13px] font-bold text-black mb-1">${price}</p>
  <h4 className="text-[12px] font-bold text-black uppercase mb-2">{name}</h4>
  <div className="flex justify-center text-[#fcb900] gap-0.5">
    {/* Stars */}
  </div>
</div>
```

**Regras:**
- Imagem: `aspect-square`, hover scale 110%, duration 500ms
- Overlay: opacity 0 → 100 no hover
- Ícones hover: `bg-white p-2 rounded shadow-lg`
- Preço em destaque, nome em uppercase

---

### 8. Section Title

```tsx
// Títulos de seção com linha pontilhada
<div className="relative flex items-center justify-center my-16">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-dotted border-gray-300"></div>
  </div>
  <h2 className="relative px-8 bg-white text-5xl font-cursive text-black">{title}</h2>
</div>
```

---

### 9. Promo Banners

```tsx
// Grid de 2 banners lado a lado
<section className="grid md:grid-cols-2 gap-8">
  {/* Banner com imagem de fundo */}
  <div className="relative h-[300px] rounded-2xl overflow-hidden group">
    <img className="w-full h-full object-cover group-hover:scale-105" />
    {/* Overlay content */}
  </div>
  {/* Banner com background sólido */}
  <div className="bg-[#f0e8f0] rounded-2xl h-[300px] flex items-center justify-center">
    {/* Content card */}
  </div>
</section>
```

---

## 📄 Template de Página

### Template Base para Novas Páginas

```tsx
'use client';

import { Header } from '@/components/web/header';
import { Footer } from '@/components/web/footer';

interface PageProps {
  // props da página
}

export default function PageName({}: PageProps) {
  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      <Header />
      
      {/* Breadcrumb (se aplicável) */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        {/* breadcrumb */}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar (se aplicável) */}
          <aside className="lg:w-[280px] flex-shrink-0">
            {/* sidebar content */}
          </aside>

          {/* Page Content */}
          <div className="flex-grow">
            {/* page content */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 🎯 Padrões por Tipo de Página

### 1. Páginas de Produto

```tsx
// Estrutura obrigatória:
- Galeria de imagens (zoom on hover)
- Título + Preço + Rating
- Seletor de variações (cor, tamanho)
- Botão "Adicionar ao Carrinho" (bg-[#be7374])
- Descrição do produto
- Tabs: Descrição | Avaliações | Envio
- Produtos relacionados
```

### 2. Páginas de Categoria

```tsx
// Estrutura obrigatória:
- Título da categoria
- Filtros na sidebar (preço, marca, rating)
- Grid de produtos (2/3/4 colunas responsivo)
- Ordenação (dropdown)
- Paginação
```

### 3. Páginas de Checkout

```tsx
// Estrutura obrigatória:
- Steps indicator (Cart → Info → Payment → Confirm)
- Formulário em etapas
- Resumo do pedido na sidebar
- Validação em tempo real
```

### 4. Páginas de Conta

```tsx
// Estrutura obrigatória:
- Sidebar com menu (Profile, Orders, Addresses, Security)
- Content area com formulário
- Tabs ou accordion para seções
```

---

## 📱 Responsividade

### Breakpoints

```tsx
// Mobile First
sm: 640px    // Tablets pequenos
md: 768px    // Tablets
lg: 1024px   // Desktops
xl: 1280px   // Desktops grandes
2xl: 1536px  // Telas grandes
```

### Grid Responsivo de Produtos

```tsx
// 2 colunas mobile → 3 tablet → 4 desktop
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
  {/* products */}
</div>
```

### Sidebar

```tsx
// Oculta em mobile, 280px em desktop
<aside className="lg:w-[280px] flex-shrink-0">
  {/* sidebar content */}
</aside>
```

---

## ♿ Acessibilidade

### Regras Obrigatórias

1. **Imagens**: Sempre com `alt` descritivo
2. **Botões**: Sempre com `aria-label` quando ícone-only
3. **Links**: Estados hover/focus visíveis
4. **Formulários**: Labels associados aos inputs
5. **Navegação**: Role="navigation" em menus
6. **Cores**: Contraste mínimo 4.5:1 para texto normal
7. **Focus**: Outline visível em todos os elementos interativos

### Exemplo de Botão Acessível

```tsx
<Button 
  variant="ghost" 
  size="icon" 
  aria-label="Adicionar aos favoritos"
>
  <Heart className="h-5 w-5" />
</Button>
```

---

## ⚡ Performance

### Regras de Imagens

```tsx
// Next.js Image com prioridade acima da dobra
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
  priority  // Apenas para imagens above-the-fold
  sizes="(max-width: 768px) 100vw, 1200px"
/>

// Imagens abaixo da dobra
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={400}
  loading="lazy"
  sizes="(max-width: 768px) 50vw, 400px"
/>
```

### Lazy Loading de Componentes

```tsx
// Componentes pesados carregados dinamicamente
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton />, ssr: false }
);
```

---

## 🎭 Animações e Transições

### Padrões de Transição

```css
/* Hover em links */
transition-colors duration-200

/* Hover em cards */
transition-all duration-300

/* Hover em imagens (zoom) */
transition-all duration-500 group-hover:scale-110

/* Fade in (mega menu) */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
```

### Hover em Product Cards

```tsx
// Overlay de ícones aparece suavemente
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
  {/* icons */}
</div>
```

---

## 📋 Checklist de Validação

### Antes de Commitar uma Página

- [ ] Layout segue estrutura padrão (Top Bar → Header → Nav → Content → Footer)
- [ ] Cores usam tokens do Design System (#be7374, #fed2cc, #788090)
- [ ] Tipografia usa fontes e tamanhos padrão (Jost, Sacramento)
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Imagens com `alt`, `sizes` e `loading` apropriados
- [ ] Botões com `aria-label` quando necessário
- [ ] Links com estados hover/focus
- [ ] Formulários com validação e labels
- [ ] Animações suaves (200-500ms)
- [ ] Sidebar oculta em mobile (se aplicável)
- [ ] Grid responsivo configurado
- [ ] Footer presente em todas as páginas
- [ ] Breadcrumb em páginas internas (se aplicável)

---

## 🚀 Como Usar Esta Skill

### Ao Criar Nova Página:

1. **Copiar o template base** deste arquivo
2. **Adaptar o conteúdo** mantendo a estrutura
3. **Usar componentes existentes** (Header, Footer, Sidebar, etc.)
4. **Seguir padrões de cores e tipografia**
5. **Validar com o checklist** antes de commitar

### Ao Modificar Página Existente:

1. **Verificar se segue o padrão** de layout
2. **Atualizar cores** para tokens do Design System
3. **Ajustar tipografia** para fontes padrão
4. **Adicionar responsividade** se ausente
5. **Validar acessibilidade** e performance

---

## 📚 Referências

- **Header**: `src/components/web/header.tsx`
- **Footer**: `src/components/web/footer.tsx`
- **Top Bar**: `src/components/web/top-bar.tsx`
- **Main Header**: `src/components/web/main-header.tsx`
- **Main Nav**: `src/components/web/main-nav.tsx`
- **Sidebar**: `src/components/web/sidebar.tsx`
- **Hero Banner**: `src/components/web/hero-banner.tsx`
- **Promo Banners**: `src/components/web/promo-banners.tsx`
- **Featured Products**: `src/components/web/featured-products-grid.tsx`
- **Globals CSS**: `src/app/globals.css`
- **Next Config**: `next.config.ts`

---

## 🔄 Manutenção

Esta skill deve ser atualizada quando:
- Novos componentes forem criados
- Cores do Design System mudarem
- Novos padrões de layout forem estabelecidos
- Breaking changes no Tailwind ou Next.js

**Última atualização**: 2026-04-03
**Versão**: 1.0.0
