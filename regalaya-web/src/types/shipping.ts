// Shipping types

export interface ShippingCalcRequest {
  zipCode: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  service?: string
}

export interface ShippingOption {
  carrier: string
  service: string
  description: string
  price: number
  estimatedDays: number
  estimatedDelivery: string
  isAvailable: boolean
}

export interface ShippingCalcResponse {
  zipCode: string
  options: ShippingOption[]
  freeShippingThreshold: number
  freeShippingAvailable: boolean
}
