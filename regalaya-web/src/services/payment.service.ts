/**
 * Payment Service
 *
 * Serviço para operações de pagamento (PIX, Cartão de Crédito).
 */

import { http } from '@/lib/api'
import type {
  PaymentIntentRequest,
  PaymentIntentResponse,
  PaymentStatusResponse,
  InstallmentOption,
} from '@/types/payment'

export const paymentService = {
  /**
   * Cria um payment intent para um pedido
   */
  createIntent: (request: PaymentIntentRequest) =>
    http.post<PaymentIntentResponse>('/payments/create-intent', request),

  /**
   * Obtém o status de pagamento de um pedido
   */
  getPaymentStatus: (orderId: string) =>
    http.get<PaymentStatusResponse>(`/payments/${orderId}`),

  /**
   * Calcula opções de parcelamento
   */
  calculateInstallments: (total: number, maxInstallments = 12) =>
    http.get<InstallmentOption[]>('/payments/installments', { total, maxInstallments }),
}
