import { http } from '@/lib/api'

export interface OrderItemResponse {
  id: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  total: number
  imageUrl: string
}

export interface OrderResponse {
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

export interface OrderDetailResponse extends OrderResponse {
  customerPhone: string
  shippingAddress: string
  notes: string
  trackingCode: string
  orderItems: OrderItemResponse[]
  subtotal: number
  shipping: number
  discount: number
  paymentMethod: string
}

export interface CreateOrderItemRequest {
  productId: string
  quantity: number
}

export interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: CreateOrderItemRequest[]
  addressId?: string
  shippingAddress?: string
  paymentMethod?: string
  notes?: string
  message?: string
  scheduledAt?: string
}

export interface CreateCheckoutRequest {
  addressId?: string
  paymentMethod: string
  scheduledAt?: string
  notes?: string
  message?: string
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  notes?: string
}

export const ordersService = {
  // Admin endpoints
  getAll: (page = 0, size = 20, sort = 'createdAt,desc') =>
    http.get<{ content: OrderResponse[]; totalElements: number; totalPages: number; number: number; size: number }>(
      '/orders',
      { page, size, sort }
    ),

  getById: (id: string) =>
    http.get<OrderDetailResponse>(`/orders/${id}`),

  updateStatus: (id: string, request: UpdateOrderStatusRequest) =>
    http.patch<OrderDetailResponse>(`/orders/${id}/status`, request),

  getRecent: (limit = 5) =>
    http.get<OrderResponse[]>('/orders/recent', { limit }),

  // Client endpoints
  getMyOrders: (page = 0, size = 20) =>
    http.get<{ content: OrderResponse[]; totalElements: number; totalPages: number; number: number; size: number }>(
      '/client/orders',
      { page, size }
    ),

  getAllMyOrders: () =>
    http.get<OrderResponse[]>('/client/orders/all'),

  getMyOrderById: (id: string) =>
    http.get<OrderDetailResponse>(`/client/orders/${id}`),

  createOrder: (request: CreateOrderRequest) =>
    http.post<OrderDetailResponse>('/client/orders', request),

  createOrderFromCart: (request: CreateCheckoutRequest) =>
    http.post<OrderDetailResponse>('/client/orders', request),
}
