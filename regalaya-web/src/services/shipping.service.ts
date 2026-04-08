/**
 * Shipping Service
 *
 * Serviço para cálculo de frete via Correios.
 */

import { http } from '@/lib/api'
import type { ShippingCalcRequest, ShippingCalcResponse } from '@/types/shipping'

export const shippingService = {
  /**
   * Calcula opções de frete para um CEP e peso
   */
  calculateShipping: (request: ShippingCalcRequest) =>
    http.post<ShippingCalcResponse>('/shipping/calculate', request),
}
