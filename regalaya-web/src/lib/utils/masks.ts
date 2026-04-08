/**
 * Máscaras e formatadores para inputs do formulário.
 */

/**
 * Formata telefone no padrão brasileiro: +55 XX XXXXX-XXXX
 */
export function formatPhone(value: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = value.replace(/\D/g, '')

  // Adiciona o código do país se não tiver
  let phone = cleaned
  if (!phone.startsWith('55') && phone.length >= 10) {
    phone = '55' + phone
  }

  // Limita a 13 dígitos (55 + 2 DDD + 9 dígitos)
  phone = phone.slice(0, 13)

  // Aplica a formatação
  if (phone.length <= 2) {
    return phone
  }
  if (phone.length <= 4) {
    return `+${phone.slice(0, 2)} ${phone.slice(2)}`
  }
  if (phone.length <= 9) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 4)} ${phone.slice(4)}`
  }
  if (phone.length <= 13) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 4)} ${phone.slice(4, 9)}-${phone.slice(9)}`
  }

  return `+${phone.slice(0, 2)} ${phone.slice(2, 4)} ${phone.slice(4, 9)}-${phone.slice(9, 13)}`
}

/**
 * Formata CPF no padrão brasileiro: XXX.XXX.XXX-XX
 */
export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11)

  if (cleaned.length <= 3) {
    return cleaned
  }
  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  }
  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
  }
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
}

/**
 * Hook para aplicar máscara de telefone em tempo real.
 * @returns Objeto com valor formatado e handlers
 */
export function usePhoneMask() {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const formatted = formatPhone(e.target.value)
    onChange(formatted)
  }

  return {
    formatPhone,
    handleChange,
  }
}

/**
 * Valida se um telefone está no formato brasileiro válido.
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Deve ter 11 dígitos (55 + 2 DDD + 9 dígitos)
  if (cleaned.length !== 11) {
    return false
  }

  // Deve começar com 55
  if (!cleaned.startsWith('55')) {
    return false
  }

  // DDD deve estar entre 11 e 99
  const ddd = parseInt(cleaned.slice(2, 4))
  if (ddd < 11 || ddd > 99) {
    return false
  }

  // O nono dígito deve ser 2-9 para celulares
  const ninthDigit = parseInt(cleaned[4])
  if (ninthDigit < 2 || ninthDigit > 9) {
    return false
  }

  return true
}

/**
 * Valida se um email está no formato válido.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
