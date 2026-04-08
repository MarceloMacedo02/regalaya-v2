import { http, buildPageParams } from '@/lib/api'
import type { PageResponse, Pageable } from '@/types/api'

/**
 * Status possível do cliente
 */
export type CustomerStatus = 'ATIVO' | 'INATIVO'

/**
 * Representação de um cliente no painel admin
 */
export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string | null
  status: CustomerStatus
  registrationDate: string
  orderCount: number
  totalSpent: number
}

/**
 * Filtros disponíveis para busca de clientes
 */
export interface CustomerFilters {
  search?: string
  status?: CustomerStatus | 'TODOS'
  dateFrom?: string
  dateTo?: string
  minOrders?: number
  maxOrders?: number
}

/**
 * Stats resumidos dos clientes
 */
export interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  averageTicket: number
  totalRevenue: number
}

/**
 * Parâmetros de paginação com filtros
 */
export interface CustomerPageRequest extends Pageable {
  filters?: CustomerFilters
}

/**
 * Segmento do cliente
 */
export interface CustomerSegment {
  code: string
  label: string
  color: string
  description: string
}

/**
 * Métricas do cliente
 */
export interface CustomerMetrics {
  ltv: number
  averageOrderValue: number
  totalOrders: number
  purchaseFrequency: number
  lastPurchaseDate: string | null
  daysSinceLastPurchase: number | null
  favoriteCategory: string | null
  categorySpentPercentage: number
  segment: CustomerSegment
  isActive: boolean
}

/**
 * Perfil completo do cliente
 */
export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone: string | null
  photo?: string | null
  dateOfBirth?: string | null
  segmentLabel: string
  segmentColor: string
  metrics: CustomerMetrics
  plan: string
  createdAt: string
}

/**
 * Resumo de pedido do cliente ( wornist table )
 */
export interface CustomerOrderSummary {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentMethod?: string | null
  createdAt: string
  itemCount: number
}

/**
 * Filtros para pedidos de cliente
 */
export interface OrderFilterRequest {
  status?: string // PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
  startDate?: string
  endDate?: string
  productName?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

/**
 * Dados para gráficos
 */
export interface ChartDataPoint {
  label: string
  value: number
  count: number
}

export interface CustomerChartData {
  ltvEvolution: ChartDataPoint[]
  purchaseFrequency: ChartDataPoint[]
  averageOrderValueDistribution: ChartDataPoint[]
  topCategories: ChartDataPoint[]
  startPeriod: string
  endPeriod: string
}

export const customersService = {
  /**
   * Busca clientes paginado com filtros opcionais
   */
  getAll: (params: CustomerPageRequest = {}): Promise<PageResponse<AdminCustomer>> => {
    const queryParams: Record<string, string | number | boolean | undefined> = buildPageParams(params)

    if (params.filters) {
      const { search, status, dateFrom, dateTo, minOrders, maxOrders } = params.filters

      if (search) queryParams.search = search
      if (status && status !== 'TODOS') queryParams.status = status
      if (dateFrom) queryParams.dateFrom = dateFrom
      if (dateTo) queryParams.dateTo = dateTo
      if (minOrders !== undefined) queryParams.minOrders = minOrders
      if (maxOrders !== undefined) queryParams.maxOrders = maxOrders
    }

    return http.get<PageResponse<AdminCustomer>>('/v1/admin/customers', queryParams)
  },

  /**
   * Busca estatísticas resumidas dos clientes
   */
  getStats: (): Promise<CustomerStats> =>
    http.get<CustomerStats>('/v1/admin/customers/stats'),

  /**
   * Busca um cliente específico por ID
   */
  getById: (id: string): Promise<AdminCustomer> =>
    http.get<AdminCustomer>(`/v1/admin/customers/${id}`),

  /**
   * Atualiza o status de um cliente
   */
  updateStatus: (id: string, status: CustomerStatus): Promise<AdminCustomer> =>
    http.patch<AdminCustomer>(`/v1/admin/customers/${id}/status`, { status }),

  /**
   * Busca perfil detalhado do cliente ( HU-08.2.1 )
   */
  getCustomerProfile: (customerId: string): Promise<CustomerProfile> =>
    http.get<CustomerProfile>(`/api/v1/admin/customers/${customerId}`),

  /**
   * Busca histórico de pedidos do cliente com filtros ( HU-08.2.2 )
   */
  getCustomerOrders: (customerId: string, filter?: OrderFilterRequest): Promise<PageResponse<CustomerOrderSummary>> =>
    http.get<PageResponse<CustomerOrderSummary>>(`/api/v1/admin/customers/${customerId}/orders`, filter as Record<string, string | number | boolean | undefined>),

  /**
   * Exporta histórico de pedidos do cliente para CSV ( HU-08.2.2 )
   */
  exportCustomerOrdersToCsv: (customerId: string, filter?: OrderFilterRequest): Promise<string> =>
    http.get<Blob>('/api/v1/admin/customers/${customerId}/orders/export', {
      ...filter,
      responseType: 'blob'
    } as Record<string, string | number | boolean | undefined>).then(response => {
      // Converte blob para texto CSV
      return (response as Blob).text()
    }),

  /**
   * Busca dados analíticos para gráficos ( HU-08.2.4 )
   */
  getCustomerAnalytics: (
    customerId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CustomerChartData> =>
    http.get<CustomerChartData>(`/api/v1/admin/customers/${customerId}/analytics`, {
      startDate,
      endDate
    }),

  /**
   * Força recálculo de segmentação manualmente ( HU-08.2.3 )
   */
  recalculateCustomerSegmentation: (customerId: string): Promise<void> =>
    http.post(`/api/v1/admin/customers/${customerId}/recalculate-segmentation`, {}),
}