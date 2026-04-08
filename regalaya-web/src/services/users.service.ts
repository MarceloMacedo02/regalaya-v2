import { http } from '@/lib/api'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  plan: string | null
  createdAt: string
  updatedAt: string
  totalOrders: number
  totalSpent: number
}

export interface UserStats {
  totalUsers: number
}

export const usersService = {
  getAll: (params?: { page?: number; size?: number; sort?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.set('page', params.page.toString())
    if (params?.size !== undefined) searchParams.set('size', params.size.toString())
    if (params?.sort) searchParams.set('sort', params.sort)
    
    const query = searchParams.toString()
    return http.get<{ content: AdminUser[]; totalElements: number; totalPages: number }>(
      `/admin/users${query ? `?${query}` : ''}`
    )
  },

  getById: (id: string) =>
    http.get<AdminUser>(`/admin/users/${id}`),

  search: (query: string) =>
    http.get<AdminUser[]>(`/admin/users/search?q=${encodeURIComponent(query)}`),

  getStats: () =>
    http.get<UserStats>('/admin/users/stats'),
}
