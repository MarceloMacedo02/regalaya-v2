import { http } from '@/lib/api'

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageTicket: number
  revenueChange: number
  ordersChange: number
  customersChange: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  productId: string
  productName: string
  unitsSold: number
  revenue: number
}

export interface OrderSummary {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  userId: string
  userPlan: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  itemCount: number
}

export interface CustomerSummary {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  createdAt: string
  status: string
}

export const dashboardApi = {
  getStats: (period = 'month') =>
    http.get<DashboardStats>('/dashboard/stats', { period }),

  getSalesData: (period = 'month') =>
    http.get<SalesData[]>('/dashboard/sales', { period }),

  getTopProducts: (period = 'month', limit = 5) =>
    http.get<TopProduct[]>('/dashboard/top-products', { period, limit }),

  getRecentOrders: (limit = 5) =>
    http.get<{ content: OrderSummary[] }>('/admin/orders', { page: 0, size: limit }),

  getCustomers: (page = 0, size = 5) =>
    http.get<{ content: CustomerSummary[] }>('/admin/users', { page, size, role: 'CLIENT' }),
}
