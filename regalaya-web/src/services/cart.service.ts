/**
 * Cart Service
 *
 * Serviço para operações com o carrinho de compras.
 */

import { http } from '@/lib/api'

export interface CartItem {
  productId: string
  productName: string
  productImage: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface Cart {
  userId: string
  items: CartItem[]
  itemCount: number
  totalQuantity: number
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode: string | null
  couponDiscount: number
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface ApplyCouponRequest {
  code: string
}

export const cartService = {
  async getCart(): Promise<Cart> {
    return http.get<Cart>('/cart')
  },

  async addToCart(data: AddToCartRequest): Promise<Cart> {
    return http.post<Cart>('/cart/items', data)
  },

  async updateItem(productId: string, data: UpdateCartItemRequest): Promise<Cart> {
    return http.patch<Cart>(`/cart/items/${productId}`, data)
  },

  async removeItem(productId: string): Promise<Cart> {
    return http.delete<Cart>(`/cart/items/${productId}`)
  },

  async clearCart(): Promise<void> {
    return http.delete<void>('/cart')
  },

  async applyCoupon(code: string): Promise<Cart> {
    return http.post<Cart>('/cart/apply-coupon', { code })
  },

  async removeCoupon(): Promise<Cart> {
    return http.delete<Cart>('/cart/coupon')
  },
}
