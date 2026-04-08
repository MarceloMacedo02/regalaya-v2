# Component Library Reference

## Componentes Web (Páginas Públicas)

### Layout Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| Header | `src/components/web/header.tsx` | Header completo integrando TopBar + MainHeader + MainNav |
| TopBar | `src/components/web/top-bar.tsx` | Barra superior com endereço, idioma e links |
| MainHeader | `src/components/web/main-header.tsx` | Logo + Info blocks (frete, suporte, carrinho) |
| MainNav | `src/components/web/main-nav.tsx` | Navegação principal com mega menu |
| MegaMenu | `src/components/web/mega-menu.tsx` | Dropdown menu com 3 colunas |
| Sidebar | `src/components/web/sidebar.tsx` | Sidebar com categorias e widgets |
| Footer | `src/components/web/footer.tsx` | Rodapé com links, newsletter e social |

### Content Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| HeroBanner | `src/components/web/hero-banner.tsx` | Banner principal hero |
| PromoBanners | `src/components/web/promo-banners.tsx` | Banners promocionais duplos |
| FeaturedProductsGrid | `src/components/web/featured-products-grid.tsx` | Grid de produtos em destaque |
| CategoryGrid | `src/components/web/category-grid.tsx` | Grid de categorias |
| OccasionSection | `src/components/web/occasion-section.tsx` | Seção de ocasiões especiais |

### UI Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| SearchDropdown | `src/components/web/search-dropdown.tsx` | Dropdown de busca com resultados |
| CategoryMenu | `src/components/web/category-menu.tsx` | Menu dropdown de categorias |

---

## Componentes UI (Design System)

### Form Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| Button | `src/components/ui/button.tsx` | Botões com variantes (default, outline, ghost, link) |
| Input | `src/components/ui/input.tsx` | Campos de input de texto |
| Label | `src/components/ui/label.tsx` | Labels para formulários |
| Checkbox | `src/components/ui/checkbox.tsx` | Checkboxes estilizados |
| Switch | `src/components/ui/switch.tsx` | Toggle switches |
| Select | `src/components/ui/select.tsx` | Dropdown selects |
| Textarea | `src/components/ui/textarea.tsx` | Campos de texto multi-line |

### Layout Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| Card | `src/components/ui/card.tsx` | Cards com header, content, footer |
| Tabs | `src/components/ui/tabs.tsx` | Tab navigation |
| Accordion | `src/components/ui/accordion.tsx` | Accordion/collapsible sections |
| Dialog | `src/components/ui/dialog.tsx` | Modal dialogs |
| DropdownMenu | `src/components/ui/dropdown-menu.tsx` | Dropdown menus |
| Tooltip | `src/components/ui/tooltip.tsx` | Tooltips informativos |
| Toast | `src/components/ui/toast.tsx` | Notificações toast |

### Data Display

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| Badge | `src/components/ui/badge.tsx` | Badges/contadores |
| Avatar | `src/components/ui/avatar.tsx` | Avatares de usuário |
| Table | `src/components/ui/table.tsx` | Tabelas de dados |
| Carousel | `src/components/ui/carousel.tsx` | Carrossel de imagens |

---

## Shared Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| JsonLd | `src/components/shared/json-ld.tsx` | SEO structured data (JSON-LD) |
| ProductCard | `src/components/shared/product-card.tsx` | Card de produto reutilizável |
| ProductGallery | `src/components/shared/product-gallery.tsx` | Galeria de imagens do produto |
| Breadcrumb | `src/components/shared/breadcrumb.tsx` | Navegação breadcrumb |
| Pagination | `src/components/shared/pagination.tsx` | Paginação de listas |
| LoadingSpinner | `src/components/shared/loading-spinner.tsx` | Indicador de loading |
| ErrorBoundary | `src/components/shared/error-boundary.tsx` | Error boundary para fallback |
| EmptyState | `src/components/shared/empty-state.tsx` | Estado vazio para listas |

---

## Admin Components

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| AdminLayout | `src/components/admin/admin-layout.tsx` | Layout do painel admin |
| AdminSidebar | `src/components/admin/admin-sidebar.tsx` | Sidebar do admin |
| AdminHeader | `src/components/admin/admin-header.tsx` | Header do admin |
| StatCard | `src/components/admin/stat-card.tsx` | Card de estatísticas |
| DataTable | `src/components/admin/data-table.tsx` | Tabelas de dados admin |
| StatusBadge | `src/components/admin/status-badge.tsx` | Badges de status |

---

## Hooks Disponíveis

| Hook | Caminho | Descrição |
|------|---------|-----------|
| useAuth | `src/hooks/useAuth.tsx` | Autenticação (login, register, logout) |
| useCart | `src/hooks/useCart.tsx` | Carrinho de compras |
| useWishlist | `src/hooks/useWishlist.tsx` | Lista de desejos |
| useProducts | `src/hooks/useProducts.tsx` | Produtos (fetch, filter, paginate) |
| useProductSearch | `src/hooks/useProductSearch.tsx` | Busca de produtos com debounce |
| useOrders | `src/hooks/useOrders.tsx` | Gerenciamento de pedidos |
| useCategories | `src/hooks/useCategories.tsx` | Categorias de produtos |

---

## Contexts Disponíveis

| Context | Caminho | Descrição |
|---------|---------|-----------|
| AuthContext | `src/contexts/AuthContext.tsx` | Contexto de autenticação |
| CartContext | `src/contexts/cart-context.tsx` | Contexto do carrinho |
| WishlistContext | `src/contexts/wishlist-context.tsx` | Contexto da wishlist |
| ThemeContext | `src/contexts/theme-context.tsx` | Contexto de tema (dark/light) |
| ToastContext | `src/contexts/toast-context.tsx` | Contexto de notificações |

---

## Services

| Service | Caminho | Descrição |
|---------|---------|-----------|
| products.service | `src/services/products.service.ts` | API de produtos |
| auth.service | `src/services/auth.service.ts` | API de autenticação |
| cart.service | `src/services/cart.service.ts` | API do carrinho |
| orders.service | `src/services/orders.service.ts` | API de pedidos |
| categories.service | `src/services/categories.service.ts` | API de categorias |

---

## Types

| Type File | Caminho | Descrição |
|-----------|---------|-----------|
| Product | `src/types/product.ts` | Tipos de produto e DTOs |
| Category | `src/types/category.ts` | Tipos de categoria |
| User | `src/types/user.ts` | Tipos de usuário |
| Order | `src/types/order.ts` | Tipos de pedido |
| Cart | `src/types/cart.ts` | Tipos do carrinho |
| Common | `src/types/common.ts` | Tipos compartilhados |
| Index | `src/types/index.ts` | Exportação centralizada |

---

## Mock Data

| Data | Caminho | Descrição |
|------|---------|-----------|
| Mock Data | `src/lib/mock-data.ts` | Dados mockados para desenvolvimento |

---

## Constants

| Constant | Caminho | Descrição |
|----------|---------|-----------|
| App Constants | `src/lib/constants.ts` | Constantes da aplicação (URLs, nomes, etc.) |
