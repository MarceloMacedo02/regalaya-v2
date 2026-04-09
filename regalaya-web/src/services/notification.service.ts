import { http } from '@/lib/api'
import type { NotificationFilters, NotificationPage, NotificationReadResponse } from '@/types/notification'

export const notificationService = {
  getAll: (filters: NotificationFilters = {}) =>
    http.get<NotificationPage>('/notifications', {
      page: filters.page ?? 0,
      size: filters.size ?? 20,
      status: filters.status,
      type: filters.type,
    }),

  markAsRead: (id: string) =>
    http.patch<NotificationReadResponse>(`/notifications/${id}/read`, {}),
}
