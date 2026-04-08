import { http } from '@/lib/api'
import type { CommunicationType } from './templates.service'

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENT' | 'CANCELLED'
export type DeliveryStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED'

export interface CommunicationDelivery {
  id: string
  recipientId: string
  recipientName: string
  recipientEmail: string | null
  recipientPhone: string | null
  status: DeliveryStatus
  errorMessage: string | null
  dispatchedAt: string | null
  opened: boolean
  clicked: boolean
}

export interface CommunicationCampaign {
  id: string
  name: string
  type: CommunicationType
  segmentCode: string
  templateName: string
  status: CampaignStatus
  recipientCount: number
  rateLimitedCount: number
  scheduledAt: string | null
  createdAt: string
  previewContent: string
  openRate: number
  clickRate: number
  deliveries: CommunicationDelivery[]
}

export interface CommunicationCampaignRequest {
  name: string
  type: CommunicationType
  segmentCode: string
  templateId: string
  customization?: Record<string, string>
  sendNow: boolean
  scheduledAt?: string | null
  customFilters?: Record<string, string>
  selectedCustomerIds?: string[]
}

const BASE_PATH = '/admin/communications'

export const communicationsService = {
  listCampaigns: (): Promise<CommunicationCampaign[]> =>
    http.get<CommunicationCampaign[]>(`${BASE_PATH}/campaigns`),

  findCampaignById: (id: string): Promise<CommunicationCampaign> =>
    http.get<CommunicationCampaign>(`${BASE_PATH}/campaigns/${id}`),

  sendCampaign: (payload: CommunicationCampaignRequest): Promise<CommunicationCampaign> =>
    http.post<CommunicationCampaign>(`${BASE_PATH}/send`, payload),

  deleteCampaign: (id: string): Promise<void> =>
    http.delete(`${BASE_PATH}/campaigns/${id}`),
}
