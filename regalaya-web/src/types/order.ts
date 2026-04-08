// Order types
import type { User } from "./user"
import type { Product } from "./product"

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: User
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  payment: PaymentInfo
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product?: Product
  name: string
  price: number
  quantity: number
  image?: string
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export interface PaymentInfo {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  pixCode?: string
  pixExpiration?: string
  cardBrand?: string
  cardLastFour?: string
  installments?: number
}

export type PaymentMethod = "pix" | "credit_card" | "debit_card" | "boleto"

export type PaymentStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "refunded"

export interface ShippingAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  deliveryDays: number
  isFree?: boolean
}
