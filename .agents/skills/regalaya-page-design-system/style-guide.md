# Style Guide - Regalaya Design System

## 🎨 Paleta de Cores Completa

### Cores Primárias

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| Primary Rose | `#be7374` | rgb(190, 115, 116) | CTAs, links ativos, destaques |
| Primary Light | `#fed2cc` | rgb(254, 210, 204) | Backgrounds, ribbons, highlights |
| Primary Hover | `#a86263` | rgb(168, 98, 99) | Hover em elementos primários |
| Primary Active | `#945354` | rgb(148, 83, 84) | Estado ativo/pressed |

### Cores Neutras

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| White | `#ffffff` | rgb(255, 255, 255) | Fundo principal, superfícies |
| Surface Alt | `#f9f6f0` | rgb(249, 246, 240) | Backgrounds alternativos (hero, banners) |
| Gray 50 | `#f9fafb` | rgb(249, 250, 251) | Backgrounds sutis |
| Gray 100 | `#f3f4f6` | rgb(243, 244, 246) | Bordas leves, divisórias |
| Gray 200 | `#e5e7eb` | rgb(229, 231, 235) | Bordas padrão |
| Gray 300 | `#d1d5db` | rgb(209, 213, 219) | Bordas pontilhadas |
| Gray 400 | `#9ca3af` | rgb(156, 163, 175) | Texto terciário, placeholders |
| Gray 500 | `#6b7280` | rgb(107, 114, 128) | Texto secundário |
| Gray 600 | `#4b5563` | rgb(75, 85, 99) | Texto em hover |
| Gray 700 | `#374151` | rgb(55, 65, 81) | Texto principal |
| Gray 900 | `#111827` | rgb(17, 24, 39) | Títulos, texto em destaque |
| Black | `#1a1a1a` | rgb(26, 26, 26) | Logo, textos principais |

### Cores de Texto

| Nome | Hex | Uso |
|------|-----|-----|
| Text Primary | `#1a1a1a` | Títulos, headings |
| Text Secondary | `#788090` | Corpo de texto, descrições |
| Text Muted | `#9ca3af` | Labels, metadata, timestamps |
| Text Link | `#be7374` | Links, navegação ativa |

### Cores de Feedback

| Nome | Hex | Uso |
|------|-----|-----|
| Success | `#22c55e` | Sucesso, confirmações |
| Warning | `#f59e0b` | Alertas, atenção |
| Error | `#ef4444` | Erros, validações negativas |
| Info | `#3b82f6` | Informações, dicas |

### Cores de Destaque

| Nome | Hex | Uso |
|------|-----|-----|
| Star Gold | `#fcb900` | Ratings, estrelas |
| Badge Pink | `#be7374` | Badges de contagem |
| Promo Purple | `#f0e8f0` | Backgrounds promocionais |
| Accent Teal | `#14b8a6` | Elementos de destaque alternativos |

---

## 📐 Sistema de Tipografia

### Font Families

```css
/* Primary Font - Corpo de texto e UI */
font-family: 'Jost', sans-serif;

/* Display Font - Títulos decorativos */
font-family: 'Sacramento', cursive;
```

### Font Sizes (Mobile First)

| Token | Size | Line Height | Uso |
|-------|------|-------------|-----|
| xs | 10px (0.625rem) | 1.2 | Labels, badges, metadata |
| sm | 12px (0.75rem) | 1.4 | Links, navegação, captions |
| base | 13px (0.8125rem) | 1.5 | Corpo de texto padrão |
| lg | 16px (1rem) | 1.5 | Subtítulos, lead text |
| xl | 20px (1.25rem) | 1.4 | Títulos pequenos (h4) |
| 2xl | 24px (1.5rem) | 1.3 | Títulos médios (h3) |
| 3xl | 32px (2rem) | 1.2 | Títulos grandes (h2) |
| 4xl | 36px (2.25rem) | 1.1 | Títulos muito grandes |
| 5xl | 48px (3rem) | 1.1 | Hero titles, section titles |
| 6xl | 64px (4rem) | 1.05 | Display titles (hero) |
| 7xl | 72px (4.5rem) | 1.0 | Mega titles |

### Font Weights

| Peso | Valor | Uso |
|------|-------|-----|
| Light | 300 | Texto decorativo, subtitles |
| Regular | 400 | Corpo de texto padrão |
| Medium | 500 | Links, botões, labels |
| Semibold | 600 | Ênfase, subheadings |
| Bold | 700 | Títulos, headings, destaques |
| Black | 900 | Logo, display text |

### Letter Spacing

| Token | Valor | Uso |
|-------|-------|-----|
| tighter | -0.05em | Logo, títulos grandes |
| tight | -0.025em | Headings |
| normal | 0 | Corpo de texto |
| wide | 0.025em | Labels uppercase |
| wider | 0.05em | Labels uppercase pequenas |
| widest | 0.1em | Navigation items, badges |

### Text Transform

| Classe | Uso |
|--------|-----|
| uppercase | Navigation items, badges, labels, CTAs |
| capitalize | Nomes próprios, títulos de produtos |
| lowercase | Emails, URLs, códigos |

---

## 📏 Sistema de Espaçamento

### Scale Base (4px)

| Token | Valor | Tailwind | Uso Comum |
|-------|-------|----------|-----------|
| 1 | 4px | p-1, m-1 | Espaços mínimos, gaps pequenos |
| 2 | 8px | p-2, m-2 | Gaps entre ícones, padding leve |
| 3 | 12px | p-3, m-3 | Espaçamento interno de componentes |
| 4 | 16px | p-4, m-4 | Padding padrão de cards |
| 6 | 24px | p-6, m-6 | Espaçamento entre seções |
| 8 | 32px | p-8, m-8 | Espaçamento entre componentes |
| 10 | 40px | p-10, m-10 | Espaçamento de layout |
| 12 | 48px | p-12, m-12 | Margens de seção |
| 16 | 64px | p-16, m-16 | Espaçamento grande entre seções |
| 24 | 96px | - | Hero spacing, padding de página |

### Espaçamento por Componente

| Componente | Padding | Margin | Gap |
|------------|---------|--------|-----|
| Top Bar | py-2 | - | gap-6 |
| Main Header | py-8 | - | gap-6 md:gap-12 |
| Main Nav | py-5 | - | gap-0 |
| Sidebar Box | p-6 | mb-10 | - |
| Widget Box | p-8 | mb-4 | - |
| Product Card | - | mb-4 | gap-x-6 gap-y-12 |
| Hero Banner | px-12 md:px-24 | mb-12 | - |
| Section | py-16 | - | - |
| Container | px-4 | - | gap-10 |

---

## 🔲 Sistema de Bordas

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 4px | Inputs, botões pequenos |
| md | 8px | Cards pequenos, dropdowns |
| lg | 12px | Cards de produto, modais |
| xl | 16px | Widgets, feature boxes |
| 2xl | 24px | Banners, hero sections |
| full | 9999px | Badges, avatares, botões pill |

### Border Styles

| Estilo | Classe | Uso |
|--------|--------|-----|
| Sólida | `border` | Bordas padrão de cards |
| Pontilhada | `border-dotted` | Separadores visuais, nav top |
| Tracejada | `border-dashed` | Áreas de drop, placeholders |
| Nenhuma | `border-none` | Inputs focados, botões |

### Border Widths

| Token | Valor | Uso |
|-------|-------|-----|
| 0 | 0px | Sem borda |
| 1 | 1px | Bordas sutis (separadores) |
| 2 | 2px | Bordas padrão (cards, inputs) |
| 4 | 4px | Bordas de destaque |

### Border Colors

| Cor | Hex | Uso |
|-----|-----|-----|
| Gray 100 | `#f3f4f6` | Bordas muito sutis |
| Gray 200 | `#e5e7eb` | Bordas padrão |
| Gray 300 | `#d1d5db` | Bordas pontilhadas nav |
| Primary/30 | `rgba(190,115,116,0.3)` | Divisórias sidebar |
| Primary | `#be7374` | Bordas de destaque |

---

## 🌑 Sombras (Shadows)

| Token | Classe | Uso |
|-------|--------|-----|
| sm | `shadow-sm` | Cards pequenos, inputs |
| md | `shadow-md` | Dropdowns, popovers |
| lg | `shadow-lg` | Modais, sidebars flutuantes |
| xl | `shadow-xl` | Hero overlays, banners |
| 2xl | `shadow-2xl` | Mega menu, dialogs |
| none | `shadow-none` | Estado default sem sombra |

### Sombras Customizadas

```css
/* Product card hover */
.shadow-product-hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Mega menu dropdown */
.shadow-mega-menu {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* Badge count */
.shadow-badge {
  box-shadow: 0 2px 8px rgba(190, 115, 116, 0.4);
}
```

---

## 🎭 Efeitos e Animações

### Transições

| Propriedade | Duração | Timing | Uso |
|-------------|---------|--------|-----|
| Colors | 200ms | ease | Hover em links, botões |
| Background | 300ms | ease | Hover em cards |
| Transform | 300ms | ease | Hover effects gerais |
| Scale (img) | 500ms | ease | Zoom em imagens |
| Opacity | 200ms | ease-out | Fade in/out overlays |
| All (dropdown) | 200ms | ease-out | Mega menu appear |

### Animações Customizadas

```css
/* Fade In (mega menu, dropdowns) */
@keyframes fade-in {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
.animate-fade-in { 
  animation: fade-in 0.2s ease-out forwards; 
}

/* Pulse (badges, loading) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse { 
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
}

/* Slide Up (toasts, notifications) */
@keyframes slide-up {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
.animate-slide-up { 
  animation: slide-up 0.3s ease-out forwards; 
}
```

### Hover Effects

```tsx
// Product image zoom
className="group-hover:scale-110 transition-all duration-500"

// Card lift
className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

// Link color change
className="hover:text-[#be7374] transition-colors duration-200"

// Overlay appear
className="opacity-0 group-hover:opacity-100 transition-opacity"

// Button scale
className="hover:scale-105 transition-transform duration-200"
```

---

## 📐 Z-Index Scale

| Valor | Uso |
|-------|-----|
| 0 | Elementos normais (default) |
| 10 | Dropdowns, menus |
| 20 | Sticky headers |
| 30 | Mobile menu overlay |
| 40 | Sidebars flutuantes |
| 50 | Header principal (sticky) |
| 100 | Modals, dialogs |
| 200 | Toasts, notifications |
| 999 | Loading overlays |

---

## 🖼️ Sistema de Imagens

### Aspect Ratios

| Ratio | Classe | Uso |
|-------|--------|-----|
| 1:1 | `aspect-square` | Product cards, avatares |
| 4:3 | `aspect-[4/3]` | Blog post thumbnails |
| 16:9 | `aspect-video` | Banners, hero images |
| 2:3 | `aspect-[2/3]` | Product gallery vertical |
| Free | - | Hero banners (altura fixa) |

### Image Sizes

| Contexto | Width | Height | Sizes Attribute |
|----------|-------|--------|-----------------|
| Product Card | 400px | 400px | `(max-width: 768px) 50vw, 400px` |
| Hero Banner | 1920px | 600px | `100vw` |
| Promo Banner | 800px | 300px | `(max-width: 768px) 100vw, 50vw` |
| Category Thumb | 200px | 200px | `(max-width: 640px) 50vw, 200px` |
| Blog Thumb | 600px | 400px | `(max-width: 768px) 100vw, 600px` |
| Avatar | 40px | 40px | `40px` |

### Loading Strategy

```tsx
// Above the fold (hero, logo)
priority
sizes="100vw"

// Below the fold (products, categories)
loading="lazy"
sizes="(max-width: 768px) 50vw, 400px"

// Thumbnails, avatars
loading="lazy"
sizes="40px"
```

---

## 📱 Breakpoints e Responsividade

### Breakpoints Tailwind

| Token | Min Width | Dispositivos |
|-------|-----------|--------------|
| sm | 640px | Phones grandes |
| md | 768px | Tablets |
| lg | 1024px | Laptops, desktops pequenos |
| xl | 1280px | Desktops grandes |
| 2xl | 1536px | Telas muito grandes |

### Layout Responsivo por Componente

#### Container
```tsx
// Mobile: padding 16px
// Desktop: max-width 1280px
className="container mx-auto px-4 max-w-7xl"
```

#### Grid de Produtos
```tsx
// 2 cols mobile → 3 cols tablet → 4 cols desktop
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
```

#### Sidebar
```tsx
// Mobile: oculta, empilhada
// Desktop (lg+): 280px fixa à esquerda
className="lg:w-[280px] flex-shrink-0"
```

#### Hero Banner
```tsx
// Mobile: altura 300px, texto centralizado
// Desktop: altura 500px, texto à esquerda
className="relative h-[300px] md:h-[500px]"
```

#### Navigation
```tsx
// Mobile: hamburger menu, drawer
// Desktop: horizontal, items visíveis
className="hidden md:flex"
```

---

## 🎯 Padrões de Componentes

### Botões

| Variante | Estilo | Uso |
|----------|--------|-----|
| Primary | `bg-[#be7374] text-white hover:bg-[#a86263]` | CTAs principais |
| Secondary | `bg-white text-black border border-gray-100 hover:bg-gray-50` | CTAs secundários |
| Outline | `border-2 border-[#be7374] text-[#be7374] hover:bg-[#be7374] hover:text-white` | Ações alternativas |
| Ghost | `text-gray-600 hover:text-[#be7374] hover:bg-gray-50` | Ações menos importantes |
| Link | `text-[#be7374] underline hover:no-underline` | Navegação, links |

#### Tamanhos de Botão

| Tamanho | Classes | Uso |
|---------|---------|-----|
| sm | `px-4 py-2 text-xs` | Botões pequenos, inline |
| md | `px-6 py-3 text-sm` | Botões padrão |
| lg | `px-12 py-3 text-[11px] uppercase font-bold` | CTAs hero, banners |
| xl | `px-8 py-4 text-base` | Botões de destaque |

### Cards

| Tipo | Estilo | Uso |
|------|--------|-----|
| Product | `bg-[#f9f9f9] rounded-xl overflow-hidden` | Product cards |
| Feature | `bg-white border border-gray-100 rounded-xl p-8` | Feature boxes, widgets |
| Promo | `rounded-2xl overflow-hidden relative h-[300px]` | Promo banners |
| Category | `bg-[#fed2cc]/60 rounded-lg p-6` | Category sidebar |

### Inputs

| Estado | Estilo |
|--------|--------|
| Default | `border border-gray-200 bg-white` |
| Focus | `border-[#be7374] ring-2 ring-[#be7374]/20 outline-none` |
| Error | `border-red-500 ring-2 ring-red-500/20` |
| Disabled | `bg-gray-100 cursor-not-allowed opacity-60` |

---

## 📝 Padrões de Texto

### Headings

```tsx
// H1 - Page Title
<h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter">
  Page Title
</h1>

// H2 - Section Title
<h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
  Section Title
</h2>

// H3 - Subsection
<h3 className="text-2xl font-bold text-black mb-4">
  Subsection Title
</h3>

// H4 - Component Title
<h4 className="text-[13px] font-bold text-black uppercase mb-2">
  Component Title
</h4>
```

### Body Text

```tsx
// Lead paragraph
<p className="text-lg text-[#788090] mb-4">
  Lead text content here.
</p>

// Standard body text
<p className="text-[13px] text-[#788090] leading-relaxed">
  Body text content here.
</p>

// Small/caption text
<p className="text-xs text-gray-400 uppercase tracking-wider">
  Caption or label.
</p>
```

### Links

```tsx
// Standard link
<a className="text-[#be7374] hover:underline transition-colors">
  Link text
</a>

// Navigation link
<a className="text-[12px] font-bold tracking-widest uppercase hover:text-[#be7374] transition-colors">
  NAV ITEM
</a>

// Footer link
<a className="text-sm text-gray-400 hover:text-[#be7374] transition-colors">
  Footer link
</a>
```

---

## ✅ Checklist de Estilo

### Ao Criar Componente Novo

- [ ] Usa cores do Design System (não hardcoded fora do padrão)
- [ ] Tipografia segue tokens (Jost/Sacramento, tamanhos padrão)
- [ ] Espaçamento usa scale de 4px
- [ ] Border radius segue sistema (sm, md, lg, xl, 2xl, full)
- [ ] Sombras usam tokens padrão
- [ ] Transições têm duração consistente (200-500ms)
- [ ] Hover effects são suaves e visuais
- [ ] Responsivo em todos os breakpoints
- [ ] Acessível (aria-labels, focus states, contraste)
- [ ] Imagens otimizadas com Next.js Image

### Ao Revisar Página

- [ ] Layout segue estrutura padrão
- [ ] Cores consistentes em toda a página
- [ ] Tipografia hierárquica (headings > body > captions)
- [ ] Espaçamento consistente entre seções
- [ ] Componentes reusados quando possível
- [ ] Estados hover/focus/active definidos
- [ ] Loading states presentes
- [ ] Empty states tratados
- [ ] Error states com fallback

---

**Última atualização**: 2026-04-03
**Versão**: 1.0.0
