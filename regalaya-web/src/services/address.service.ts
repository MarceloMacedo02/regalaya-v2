import { http } from '@/lib/api'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '@/types/user'

export const addressService = {
  getAll: () =>
    http.get<Address[]>('/addresses'),

  getById: (id: string) =>
    http.get<Address>(`/addresses/${id}`),

  create: (data: CreateAddressRequest) =>
    http.post<Address>('/addresses', data),

  update: (id: string, data: UpdateAddressRequest) =>
    http.put<Address>(`/addresses/${id}`, data),

  delete: (id: string) =>
    http.delete(`/addresses/${id}`),

  setDefault: (id: string) =>
    http.patch<Address>(`/addresses/${id}/default`, {}),
}
