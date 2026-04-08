// Payment types

export type PaymentMethodType = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BOLETO'
export type PaymentProvider = 'STRIPE' | 'MERCADO_PAGO'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'

export interface PaymentIntentRequest {
  orderId: string
  paymentMethod: PaymentMethodType
  cardToken?: string
  installments?: number
  idempotencyKey?: string
}

export interface PaymentIntentResponse {
  providerPaymentId: string
  provider: PaymentProvider
  paymentMethod: PaymentMethodType
  qrCode?: string
  qrCodeImage?: string
  copyPasteCode?: string
  expiresAt?: string
  clientSecret?: string
  paymentIntentId: string
  amount: number
  status: string
}

export interface PaymentStatusResponse {
  paymentId: string
  status: PaymentStatus
  provider: PaymentProvider
  paymentMethod: PaymentMethodType
  paidAt?: string
  expiresAt?: string
  amount: number
  failureReason?: string
}

export interface InstallmentOption {
  installments: number
  installmentValue: number
  totalWithInterest: number
  hasInterest: boolean
  interestRate: number
}
