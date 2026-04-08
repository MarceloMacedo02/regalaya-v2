import { apiFetch } from "./api"

export interface TrackingEvent {
  status: string
  date: string
  description: string
  completed: boolean
  current?: boolean
}

export interface TrackingData {
  orderCode: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  estimatedDelivery: string
  shippingAddress: string
  items: { name: string; quantity: number }[]
  timeline: TrackingEvent[]
  carrier?: string
  trackingCode?: string | null
}

export async function fetchTrackingData(orderCode: string, signal?: AbortSignal): Promise<TrackingData> {
  return apiFetch<TrackingData>(`/orders/${orderCode}/tracking`, { signal })
}