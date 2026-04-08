/**
 * MOCK DATA - Dados simulados para visualização
 *
 * TODO: Substituir por chamadas à API real quando o backend estiver disponível
 *
 * Como usar:
 * 1. Substituir as importações de mock-data por chamadas API
 * 2. Usar React Query ou SWR para fetching de dados
 * 3. Implementar skeletons e loading states
 *
 * Exemplo de substituição:
 *
 * // ANTES (mock)
 * import { products } from '@/lib/mock-data'
 * const ProductList = () => products.map(p => <ProductCard key={p.id} {...p} />)
 *
 * // DEPOIS (API)
 * import { useQuery } from '@tanstack/react-query'
 * import { api } from '@/lib/api'
 *
 * const ProductList = () => {
 *   const { data, isLoading } = useQuery({
 *     queryKey: ['products'],
 *     queryFn: () => api.get('/products')
 *   })
 *   if (isLoading) return <ProductListSkeleton />
 *   return data.map(p => <ProductCard key={p.id} {...p} />)
 * }
 */

import type { PaymentMethod, PaymentStatus, OrderStatus } from "@/types/order"
import type { User } from "@/types/user"

// ============================================
// PRODUCTS / PRODUTOS
// ============================================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  categoryId: string
  tags: string[]
  sku?: string
  stock: number
  isActive: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Caixa de Bombons Belga",
    slug: "caixa-bombons-belga",
    description: "Caixa com 12 chocolates belgas de diferentes sabores. Perfeito para presentear em qualquer ocasião. Cada chocolate é feito à mão com ingredientes premium importados da Bélgica.",
    shortDescription: "12 chocolates belgas artesanais",
    price: 89.90,
    compareAtPrice: 109.90,
    images: [
      "/images/products/chocolates.jpg",
      "/images/products/chocolates-side.jpg",
      "/images/products/chocolates-open.jpg",
      "/images/products/chocolates-detail.jpg",
    ],
    category: "Chocolates",
    categoryId: "1",
    tags: ["chocolate", "belga", "presentes", "artesanal"],
    sku: "CHOC-001",
    stock: 50,
    isActive: true,
  },
  {
    id: "2",
    name: "Buquê de Flores Artesanais",
    slug: "bouquet-flores-artesanais",
    description: "Buquê preparado com flores frescas e artesanais. Ideal para aniversários e celebrações. Inclui rosas, lírios e flores sazonais cuidadosamente selecionadas.",
    shortDescription: "Flores artesanais exclusivas",
    price: 159.90,
    images: [
      "/images/products/flores.jpg",
      "/images/products/flores-detail.jpg",
      "/images/products/flores-packaging.jpg",
    ],
    category: "Flores",
    categoryId: "2",
    tags: ["flores", "buque", "romantico", "aniversario"],
    sku: "FLO-001",
    stock: 20,
    isActive: true,
  },
  {
    id: "3",
    name: "Vinho Tinto Premium",
    slug: "vinho-tinto-premium",
    description: "Garrafa de vinho tinto premium com notas de carvalho. Seleção especial para apreciadores. safra 2020, envelhecido por 18 meses em barris de carvalho francês.",
    shortDescription: "Vinho tinto reserva",
    price: 289.90,
    compareAtPrice: 349.90,
    images: [
      "/images/products/vinho.jpg",
      "/images/products/vinho-label.jpg",
      "/images/products/vinho-glass.jpg",
      "/images/products/vinho-box.jpg",
      "/images/products/vinho-detail.jpg",
    ],
    category: "Bebidas",
    categoryId: "3",
    tags: ["vinho", "premium", "bebida", "safra"],
    sku: "VIN-001",
    stock: 15,
    isActive: true,
  },
  {
    id: "4",
    name: "Kit Spa Relaxante",
    slug: "kit-spa-relaxante",
    description: "Kit completo com óleos essenciais, velas aromáticas e sais de banho para momentos de relaxamento. Perfeito para criar um ambiente de spa em casa.",
    shortDescription: "Kit completo de spa em casa",
    price: 199.90,
    images: [
      "/images/products/spa.jpg",
      "/images/products/flores.jpg",
      "/images/products/chocolates.jpg",
    ],
    category: "Bem-estar",
    categoryId: "4",
    tags: ["spa", "relaxamento", "bem-estar", "autocuidado"],
    sku: "SPA-001",
    stock: 30,
    isActive: true,
  },
  {
    id: "5",
    name: "Relógio Elegante",
    slug: "relogio-elegante",
    description: "Relógio com design elegante e pulseira de couro legítimo. Resistência à água IP67. Movimento japonês de alta precisão.",
    shortDescription: "Design clássico e elegante",
    price: 459.90,
    compareAtPrice: 599.90,
    images: [
      "/images/products/joias.jpg",
      "/images/products/joias-side.jpg",
      "/images/products/joias-detail.jpg",
      "/images/products/joias-box.jpg",
      "/images/products/joias-wrist.jpg",
    ],
    category: "Acessórios",
    categoryId: "5",
    tags: ["relogio", "acessorio", "elegante", "couro"],
    sku: "REL-001",
    stock: 10,
    isActive: true,
  },
  {
    id: "6",
    name: "Caneca Personalizada",
    slug: "caneca-personalizada",
    description: "Caneca térmica personalizada com mensagem especial. Mantém bebidas quentes por até 12 horas e frias por 24 horas. Aço inoxidável de qualidade alimentar.",
    shortDescription: "Caneca térmica personalizada",
    price: 79.90,
    images: [
      "/images/products/perfume.jpg",
      "/images/products/perfume-detail.jpg",
    ],
    category: "Presentes Personalizados",
    categoryId: "6",
    tags: ["caneca", "personalizado", "termica", "presente"],
    sku: "CAN-001",
    stock: 100,
    isActive: true,
  },
  {
    id: "7",
    name: "Almofada Decorativa",
    slug: "almofada-decorativa",
    description: "Almofada decorativa com estampa exclusiva. Tecido 100% algodão.",
    shortDescription: "Conforto e estilo",
    price: 89.90,
    images: ["/images/products/chocolates.jpg"],
    category: "Decoração",
    categoryId: "7",
    tags: ["almofada", "decoracao", "conforto"],
    sku: "ALM-001",
    stock: 45,
    isActive: true,
  },
  {
    id: "8",
    name: "Porta-joias Artesanal",
    slug: "porta-joias-artesanal",
    description: "Porta-joias de madeira artesanal com veludo interno. Compartimentos organizados.",
    shortDescription: "Elegância e organização",
    price: 129.90,
    images: ["/images/products/joias.jpg"],
    category: "Decoração",
    categoryId: "7",
    tags: ["porta-joias", "artesanal", "organizador"],
    sku: "JOI-001",
    stock: 25,
    isActive: true,
  },
]

// ============================================
// CATEGORIES / CATEGORIAS
// ============================================

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
}

export const categories: Category[] = [
  { id: "1", name: "Chocolates", slug: "chocolates", description: "Chocolates artesanais e premium", image: "/images/categories/chocolates.jpg", productCount: 45 },
  { id: "2", name: "Flores", slug: "flores", description: "Buquês e arranjos florais", image: "/images/categories/flores.jpg", productCount: 28 },
  { id: "3", name: "Bebidas", slug: "bebidas", description: "Vinhos, Champagnes e mais", image: "/images/categories/bebidas.jpg", productCount: 32 },
  { id: "4", name: "Bem-estar", slug: "bem-estar", description: "Spa e relaxamento", image: "/images/categories/bem-estar.jpg", productCount: 18 },
  { id: "5", name: "Acessórios", slug: "acessorios", description: "Relógios, joias e acessórios", image: "/images/categories/acessorios.jpg", productCount: 56 },
  { id: "6", name: "Personalizados", slug: "personalizados", description: "Presentes únicos e personalizados", image: "/images/categories/personalizados.jpg", productCount: 72 },
  { id: "7", name: "Decoração", slug: "decoracao", description: "Itens decorativos para casa", image: "/images/categories/decoracao.jpg", productCount: 63 },
  { id: "8", name: "Experiências", slug: "experiencias", description: "Vouchers de experiências", image: "/images/categories/experiencias.jpg", productCount: 15 },
  { id: "9", name: "Cestas de Presentes", slug: "cestas-de-presentes", description: "Cestas completas para presentear", image: "/images/categories/cestas.jpg", productCount: 24 },
  { id: "10", name: "Livros e Papelaria", slug: "livros-e-papelaria", description: "Livros, agendas e itens de papelaria", image: "/images/categories/livros.jpg", productCount: 38 },
  { id: "11", name: "Eletrônicos", slug: "eletronicos", description: "Gadgets e acessórios tecnológicos", image: "/images/categories/eletronicos.jpg", productCount: 42 },
  { id: "12", name: "Casa e Cozinha", slug: "casa-e-cozinha", description: "Itens práticos e decorativos", image: "/images/categories/casa.jpg", productCount: 51 },
]

// ============================================
// BANNERS
// ============================================

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  link: string
  isActive: boolean
}

export const banners: Banner[] = [
  {
    id: "1",
    title: "Presentes Inesquecíveis",
    subtitle: "Encontre o presente perfeito para cada momento especial",
    image: "/images/banners/hero1.jpg",
    link: "/products",
    isActive: true,
  },
  {
    id: "2",
    title: "Dia dos Namorados",
    subtitle: "Surpreenda quem você ama com presentes únicos",
    image: "/images/banners/hero2.jpg",
    link: "/products?occasion=love",
    isActive: true,
  },
  {
    id: "3",
    title: "Natal Regalaya",
    subtitle: "Presentes mágicos para uma data mágica",
    image: "/images/banners/hero3.jpg",
    link: "/products/natal",
    isActive: false,
  },
  {
    id: "4",
    title: "Dia das Mães",
    subtitle: "Homenageie quem te deu a vida com presentes especiais",
    image: "/images/banners/hero1.jpg",
    link: "/products/dia-das-maes",
    isActive: true,
  },
]

// ============================================
// ORDERS / PEDIDOS (para admin)
// ============================================

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
  items: number
}

export const orders: Order[] = [
  { id: "1", orderNumber: "REG-2026-0001", customerName: "João Silva", customerEmail: "joao@email.com", total: 289.90, status: "delivered", paymentStatus: "paid", createdAt: "2026-03-28T10:30:00Z", items: 3 },
  { id: "2", orderNumber: "REG-2026-0002", customerName: "Maria Santos", customerEmail: "maria@email.com", total: 159.90, status: "shipped", paymentStatus: "paid", createdAt: "2026-03-27T15:45:00Z", items: 1 },
  { id: "3", orderNumber: "REG-2026-0003", customerName: "Pedro Costa", customerEmail: "pedro@email.com", total: 89.90, status: "processing", paymentStatus: "paid", createdAt: "2026-03-27T09:20:00Z", items: 2 },
  { id: "4", orderNumber: "REG-2026-0004", customerName: "Ana Oliveira", customerEmail: "ana@email.com", total: 459.90, status: "pending", paymentStatus: "pending", createdAt: "2026-03-26T14:10:00Z", items: 1 },
  { id: "5", orderNumber: "REG-2026-0005", customerName: "Carlos Lima", customerEmail: "carlos@email.com", total: 199.90, status: "cancelled", paymentStatus: "failed", createdAt: "2026-03-25T11:00:00Z", items: 2 },
]

// ============================================
// CUSTOMERS / CLIENTES (para admin)
// ============================================

export interface CustomerOrder {
  id: string
  orderNumber: string
  total: number
  status: Order["status"]
  createdAt: string
  items: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  createdAt: string
  status: "active" | "inactive"
  orders?: CustomerOrder[]
  addresses?: string[]
  lastOrderDate?: string
}

export const customers: Customer[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "+55 11 99999-0001",
    totalOrders: 5,
    totalSpent: 1245.90,
    createdAt: "2025-06-15T10:00:00Z",
    status: "active",
    lastOrderDate: "2026-03-28T10:30:00Z",
    addresses: ["São Paulo, SP", "Rio de Janeiro, RJ"],
    orders: [
      { id: "1", orderNumber: "REG-2026-0001", total: 289.90, status: "delivered", createdAt: "2026-03-28T10:30:00Z", items: 3 },
      { id: "6", orderNumber: "REG-2026-0006", total: 199.90, status: "delivered", createdAt: "2026-03-15T14:20:00Z", items: 2 },
      { id: "11", orderNumber: "REG-2026-0011", total: 359.90, status: "delivered", createdAt: "2026-02-20T09:15:00Z", items: 4 },
      { id: "16", orderNumber: "REG-2026-0016", total: 249.90, status: "delivered", createdAt: "2026-01-10T16:45:00Z", items: 2 },
      { id: "21", orderNumber: "REG-2026-0021", total: 146.30, status: "delivered", createdAt: "2025-12-05T11:30:00Z", items: 1 },
    ],
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+55 11 99999-0002",
    totalOrders: 3,
    totalSpent: 567.80,
    createdAt: "2025-08-20T14:30:00Z",
    status: "active",
    lastOrderDate: "2026-03-27T15:45:00Z",
    addresses: ["São Paulo, SP"],
    orders: [
      { id: "2", orderNumber: "REG-2026-0002", total: 159.90, status: "shipped", createdAt: "2026-03-27T15:45:00Z", items: 1 },
      { id: "7", orderNumber: "REG-2026-0007", total: 259.90, status: "delivered", createdAt: "2026-02-14T10:00:00Z", items: 3 },
      { id: "12", orderNumber: "REG-2026-0012", total: 148.00, status: "delivered", createdAt: "2026-01-05T13:20:00Z", items: 2 },
    ],
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@email.com",
    phone: "+55 11 99999-0003",
    totalOrders: 8,
    totalSpent: 2340.50,
    createdAt: "2025-03-10T09:15:00Z",
    status: "active",
    lastOrderDate: "2026-03-27T09:20:00Z",
    addresses: ["Curitiba, PR", "Florianópolis, SC"],
    orders: [
      { id: "3", orderNumber: "REG-2026-0003", total: 89.90, status: "processing", createdAt: "2026-03-27T09:20:00Z", items: 2 },
      { id: "8", orderNumber: "REG-2026-0008", total: 459.90, status: "delivered", createdAt: "2026-03-10T15:30:00Z", items: 1 },
      { id: "13", orderNumber: "REG-2026-0013", total: 329.90, status: "delivered", createdAt: "2026-02-25T11:45:00Z", items: 3 },
    ],
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@email.com",
    phone: "+55 11 99999-0004",
    totalOrders: 1,
    totalSpent: 459.90,
    createdAt: "2026-03-01T16:45:00Z",
    status: "active",
    lastOrderDate: "2026-03-26T14:10:00Z",
    addresses: ["Belo Horizonte, MG"],
    orders: [
      { id: "4", orderNumber: "REG-2026-0004", total: 459.90, status: "pending", createdAt: "2026-03-26T14:10:00Z", items: 1 },
    ],
  },
  {
    id: "5",
    name: "Carlos Lima",
    email: "carlos@email.com",
    phone: "+55 11 99999-0005",
    totalOrders: 2,
    totalSpent: 399.80,
    createdAt: "2025-11-25T11:20:00Z",
    status: "inactive",
    lastOrderDate: "2026-03-25T11:00:00Z",
    addresses: ["Porto Alegre, RS"],
    orders: [
      { id: "5", orderNumber: "REG-2026-0005", total: 199.90, status: "cancelled", createdAt: "2026-03-25T11:00:00Z", items: 2 },
      { id: "10", orderNumber: "REG-2026-0010", total: 199.90, status: "delivered", createdAt: "2025-12-20T09:30:00Z", items: 1 },
    ],
  },
  {
    id: "6",
    name: "Fernanda Souza",
    email: "fernanda@email.com",
    phone: "+55 11 99999-0006",
    totalOrders: 4,
    totalSpent: 879.60,
    createdAt: "2025-07-12T08:30:00Z",
    status: "active",
    lastOrderDate: "2026-03-20T16:00:00Z",
    addresses: ["Campinas, SP"],
    orders: [
      { id: "14", orderNumber: "REG-2026-0014", total: 299.90, status: "delivered", createdAt: "2026-03-20T16:00:00Z", items: 3 },
      { id: "19", orderNumber: "REG-2026-0019", total: 189.90, status: "delivered", createdAt: "2026-02-08T14:15:00Z", items: 2 },
    ],
  },
  {
    id: "7",
    name: "Ricardo Alves",
    email: "ricardo@email.com",
    phone: "+55 11 99999-0007",
    totalOrders: 6,
    totalSpent: 1567.40,
    createdAt: "2025-04-05T10:00:00Z",
    status: "active",
    lastOrderDate: "2026-03-18T11:30:00Z",
    addresses: ["Salvador, BA", "Recife, PE"],
    orders: [],
  },
  {
    id: "8",
    name: "Juliana Martins",
    email: "juliana@email.com",
    phone: "+55 11 99999-0008",
    totalOrders: 2,
    totalSpent: 349.80,
    createdAt: "2025-10-18T15:45:00Z",
    status: "active",
    lastOrderDate: "2026-03-12T09:45:00Z",
    addresses: ["Brasília, DF"],
    orders: [],
  },
]

// ============================================
// DASHBOARD STATS / MÉTRICAS (para admin)
// ============================================

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageTicket: number
  revenueChange: number
  ordersChange: number
  customersChange: number
}

export const dashboardStats: DashboardStats = {
  totalRevenue: 156780.90,
  totalOrders: 234,
  totalCustomers: 189,
  averageTicket: 669.92,
  revenueChange: 12.5,
  ordersChange: 8.3,
  customersChange: 15.2,
}

// ============================================
// DASHBOARD CHARTS DATA (para admin)
// ============================================

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export const salesData: SalesData[] = [
  { date: "2026-03-23", revenue: 4250.90, orders: 12 },
  { date: "2026-03-24", revenue: 5120.50, orders: 15 },
  { date: "2026-03-25", revenue: 3890.00, orders: 10 },
  { date: "2026-03-26", revenue: 6780.30, orders: 18 },
  { date: "2026-03-27", revenue: 7230.80, orders: 20 },
  { date: "2026-03-28", revenue: 5890.40, orders: 16 },
  { date: "2026-03-29", revenue: 6120.60, orders: 17 },
]

export interface TopProduct {
  productId: string
  productName: string
  unitsSold: number
  revenue: number
  image?: string
}

export const topProducts: TopProduct[] = [
  { productId: "1", productName: "Caixa de Bombons Belga", unitsSold: 45, revenue: 4045.50, image: "/images/products/chocolates.jpg" },
  { productId: "3", productName: "Vinho Tinto Premium", unitsSold: 32, revenue: 9276.80, image: "/images/products/vinho.jpg" },
  { productId: "2", productName: "Buquê de Flores Artesanais", unitsSold: 28, revenue: 4477.20, image: "/images/products/flores.jpg" },
  { productId: "5", productName: "Relógio Elegante", unitsSold: 15, revenue: 6898.50, image: "/images/products/joias.jpg" },
  { productId: "4", productName: "Kit Spa Relaxante", unitsSold: 22, revenue: 4397.80, image: "/images/products/spa.jpg" },
]

export interface PeriodComparison {
  current: {
    revenue: number
    orders: number
    customers: number
  }
  previous: {
    revenue: number
    orders: number
    customers: number
  }
}

export const periodComparison: PeriodComparison = {
  current: {
    revenue: 156780.90,
    orders: 234,
    customers: 189,
  },
  previous: {
    revenue: 139450.75,
    orders: 216,
    customers: 164,
  },
}

// ============================================
// ORDER DETAILS / DETALHES DO PEDIDO
// ============================================

export interface OrderItemDetail {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface OrderStatusHistory {
  status: Order["status"]
  timestamp: string
  note?: string
}

export interface OrderDetail extends Order {
  customerPhone: string
  customerDocument?: string
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentDetails: PaymentDetails
  statusHistory: OrderStatusHistory[]
  trackingCode?: string
  trackingUrl?: string
  notes?: string
  updatedAt?: string
  orderItems?: OrderItemDetail[]
  subtotal: number
  shipping: number
  discount: number
}

export interface PaymentDetails {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  pixCode?: string
  pixExpiration?: string
  cardBrand?: string
  cardLastFour?: string
  installments?: number
  paidAt?: string
}

export interface ShippingAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  recipientName: string
  recipientPhone: string
}

export const orderDetails: OrderDetail[] = [
  {
    id: "1",
    orderNumber: "REG-2026-0001",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    customerPhone: "+55 11 99999-0001",
    customerDocument: "123.456.789-00",
    total: 289.90,
    subtotal: 259.90,
    shipping: 30.00,
    discount: 0,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: "2026-03-28T10:30:00Z",
    updatedAt: "2026-03-29T14:00:00Z",
    items: 3,
    orderItems: [
      { id: "1", productId: "1", name: "Caixa de Bombons Belga", price: 89.90, quantity: 2, image: "/images/products/chocolates.jpg" },
      { id: "2", productId: "3", name: "Vinho Tinto Premium", price: 89.90, quantity: 1, image: "/images/products/vinho.jpg" },
    ],
    shippingAddress: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      recipientName: "João Silva",
      recipientPhone: "+55 11 99999-0001",
    },
    paymentDetails: {
      method: "credit_card",
      status: "approved",
      transactionId: "TXN-123456789",
      cardBrand: "Visa",
      cardLastFour: "4242",
      installments: 3,
      paidAt: "2026-03-28T10:35:00Z",
    },
    statusHistory: [
      { status: "pending", timestamp: "2026-03-28T10:30:00Z", note: "Pedido criado" },
      { status: "processing", timestamp: "2026-03-28T11:00:00Z", note: "Pagamento aprovado" },
      { status: "shipped", timestamp: "2026-03-28T16:00:00Z", note: "Pedido enviado para entrega" },
      { status: "delivered", timestamp: "2026-03-29T14:00:00Z", note: "Pedido entregue ao cliente" },
    ],
    trackingCode: "BR123456789",
    trackingUrl: "https://correios.com.br/rastrear/BR123456789",
  },
  {
    id: "2",
    orderNumber: "REG-2026-0002",
    customerName: "Maria Santos",
    customerEmail: "maria@email.com",
    customerPhone: "+55 11 99999-0002",
    total: 159.90,
    subtotal: 159.90,
    shipping: 0,
    discount: 0,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2026-03-27T15:45:00Z",
    updatedAt: "2026-03-28T09:00:00Z",
    items: 1,
    orderItems: [
      { id: "3", productId: "2", name: "Buquê de Flores Artesanais", price: 159.90, quantity: 1, image: "/images/products/flores.jpg" },
    ],
    shippingAddress: {
      street: "Av. Paulista",
      number: "1000",
      complement: "Conj 100",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      recipientName: "Maria Santos",
      recipientPhone: "+55 11 99999-0002",
    },
    paymentDetails: {
      method: "pix",
      status: "approved",
      transactionId: "TXN-987654321",
      paidAt: "2026-03-27T15:50:00Z",
    },
    statusHistory: [
      { status: "pending", timestamp: "2026-03-27T15:45:00Z" },
      { status: "processing", timestamp: "2026-03-27T16:00:00Z" },
      { status: "shipped", timestamp: "2026-03-28T09:00:00Z" },
    ],
    trackingCode: "BR987654321",
  },
]

// ============================================
// ADMIN USERS / USUÁRIOS ADMIN
// ============================================

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: AdminRole
  status: "active" | "inactive"
  avatar?: string
  lastLogin?: string
  createdAt: string
  permissions: string[]
}

export type AdminRole = "superadmin" | "admin" | "viewer"

export const adminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Administrador Principal",
    email: "admin@regalaya.com.br",
    phone: "+55 11 99999-0000",
    role: "superadmin",
    status: "active",
    lastLogin: "2026-03-29T08:00:00Z",
    createdAt: "2025-01-01T00:00:00Z",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Gestor de Pedidos",
    email: "pedidos@regalaya.com.br",
    phone: "+55 11 99999-0001",
    role: "admin",
    status: "active",
    lastLogin: "2026-03-28T14:30:00Z",
    createdAt: "2025-06-15T10:00:00Z",
    permissions: ["orders.read", "orders.write", "customers.read"],
  },
  {
    id: "3",
    name: "Visualizador",
    email: "viewer@regalaya.com.br",
    phone: "+55 11 99999-0002",
    role: "viewer",
    status: "active",
    lastLogin: "2026-03-27T09:00:00Z",
    createdAt: "2025-09-20T14:00:00Z",
    permissions: ["orders.read", "products.read"],
  },
  {
    id: "4",
    name: "Admin Inativo",
    email: "inactive@regalaya.com.br",
    phone: "+55 11 99999-0003",
    role: "admin",
    status: "inactive",
    createdAt: "2025-03-10T08:00:00Z",
    permissions: ["orders.read"],
  },
]

// ============================================
// STORE SETTINGS / CONFIGURAÇÕES DA LOJA
// ============================================

export interface StoreSettings {
  general: GeneralSettings
  email: EmailSettings
  payment: PaymentSettings
  shipping: ShippingSettings
}

export interface GeneralSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  storeCnpj: string
  storeAddress: string
  workingHours: string
  currency: string
  timezone: string
}

export interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpSecure: boolean
  fromEmail: string
  fromName: string
}

export interface PaymentSettings {
  pixEnabled: boolean
  pixKey: string
  creditCardEnabled: boolean
  debitCardEnabled: boolean
  boletoEnabled: boolean
  maxInstallments: number
  creditCardDiscount?: number
  pixDiscount?: number
}

export interface ShippingSettings {
  freeShippingMinValue: number
  localPickupEnabled: boolean
  localPickupAddress: string
  shippingMethods: ShippingMethod[]
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  deliveryDays: number
  enabled: boolean
}

export const storeSettings: StoreSettings = {
  general: {
    storeName: "Regalaya Presentes",
    storeEmail: "contato@regalaya.com.br",
    storePhone: "+55 11 3333-4444",
    storeCnpj: "12.345.678/0001-90",
    storeAddress: "Rua dos Presentes, 123 - São Paulo, SP",
    workingHours: "Seg-Sex: 9h às 18h",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
  },
  email: {
    smtpHost: "smtp.regalaya.com.br",
    smtpPort: 587,
    smtpUser: "contato@regalaya.com.br",
    smtpSecure: true,
    fromEmail: "noreply@regalaya.com.br",
    fromName: "Regalaya Presentes",
  },
  payment: {
    pixEnabled: true,
    pixKey: "12.345.678/0001-90",
    creditCardEnabled: true,
    debitCardEnabled: true,
    boletoEnabled: false,
    maxInstallments: 12,
    creditCardDiscount: 0,
    pixDiscount: 5,
  },
  shipping: {
    freeShippingMinValue: 299.90,
    localPickupEnabled: true,
    localPickupAddress: "Rua dos Presentes, 123 - São Paulo, SP",
    shippingMethods: [
      { id: "1", name: "SEDEX", description: "Entrega expressa", price: 29.90, deliveryDays: 2, enabled: true },
      { id: "2", name: "PAC", description: "Entrega econômica", price: 15.90, deliveryDays: 7, enabled: true },
      { id: "3", name: "Retirada", description: "Retirada na loja", price: 0, deliveryDays: 1, enabled: true },
    ],
  },
}

// ============================================
// USERS / USUÁRIOS
// ============================================

export const users: User[] = [
  {
    id: "1",
    phone: "+55 11 99999-1111",
    name: "Carlos Silva",
    email: "carlos@regalaya.com.br",
    role: "ADMIN",
    avatar: "/avatars/admin1.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    phone: "+55 11 99999-2222",
    name: "Maria Santos",
    email: "maria@regalaya.com.br",
    role: "ADMIN",
    avatar: "/avatars/admin2.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    phone: "+55 11 99999-3333",
    name: "João Oliveira",
    email: "joao@regalaya.com.br",
    role: "ADMIN",
    avatar: "/avatars/admin3.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    phone: "+55 11 99999-4444",
    name: "Ana Costa",
    email: "ana@regalaya.com.br",
    role: "ADMIN",
    avatar: "/avatars/admin4.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    phone: "+55 11 98888-5555",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    phone: "+55 11 98888-6666",
    name: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    phone: "+55 11 98888-7777",
    name: "Roberto Mendes",
    email: "roberto.mendes@email.com",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
