/**
 * Checkout utility functions shared across checkout components.
 */

/**
 * Formats a number as Brazilian Real currency string.
 */
export const formatCurrency = (value: number): string =>
  value.toFixed(2).replace(".", ",")

/**
 * Formats a numeric string as Brazilian CEP (00000-000).
 */
export const formatCEP = (value: string): string =>
  value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9)

/**
 * Calculates the target date excluding weekends.
 * Returns a formatted date string (DD/MM).
 */
export const calculateBusinessDays = (days: number): string => {
  const date = new Date()
  let added = 0
  while (added < days) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

/**
 * Formats seconds into MM:SS display string.
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

/**
 * Formats card expiry input (MM/YY).
 */
export const formatCardExpiry = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 4)
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2)
  }
  return cleaned
}

/**
 * Formats CVV input (digits only, max 4).
 */
export const formatCVV = (value: string): string =>
  value.replace(/\D/g, "").slice(0, 4)

/**
 * Payment method display labels.
 */
export const getPaymentMethodLabel = (method: string | null): string => {
  const labels: Record<string, string> = {
    pix: "PIX",
    PIX: "PIX",
    card: "Cartão de Crédito",
    CREDIT_CARD: "Cartão de Crédito",
    boleto: "Boleto Bancário",
  }
  return labels[method ?? ""] ?? method ?? "Não informado"
}
