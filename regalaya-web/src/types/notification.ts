import type { PageResponse } from '@/types/api'

export type NotificationStatus = 'PENDING' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED'

export type NotificationType =
  | 'DATE_REMINDER_7D'
  | 'DATE_REMINDER_1D'
  | 'ORDER_CONFIRMATION'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'AI_RECOMMENDATION'
  | 'MARKETING'

export interface NotificationItem {
  id: string
  type: NotificationType
  status: NotificationStatus
  title: string
  message: string
  ctaLabel: string
  ctaUrl?: string | null
  contactName?: string | null
  specialDateType?: string | null
  specialDateValue?: string | null
  scheduledAt: string
  sentAt?: string | null
  readAt?: string | null
  read: boolean
  retryCount: number
}

export type NotificationPage = PageResponse<NotificationItem>

export interface NotificationFilters {
  status?: NotificationStatus
  type?: NotificationType
  page?: number
  size?: number
}

export interface NotificationReadResponse {
  id: string
  readAt: string
}
