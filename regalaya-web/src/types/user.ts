// User types

export interface User {
  id: string
  phone: string
  name?: string
  email?: string
  role: UserRole
  plan?: UserPlan
  avatar?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = "USER" | "ADMIN" | "MANAGER" | "VIEWER"
export type UserPlan = "FREE" | "PREMIUM" | "BUSINESS"

export interface Address {
  id: string
  label: string
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  reference?: string
  recipientPhone?: string
  isDefault: boolean
  isActive: boolean
}

export interface CreateAddressRequest {
  label: string
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  reference?: string
  recipientPhone?: string
  isDefault?: boolean
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  isActive?: boolean
}

export interface Contact {
  id: string
  name: string
  phone?: string
  whatsappId?: string
  consent: boolean
  createdAt: string
  updatedAt: string
  specialDates?: SpecialDate[]
}

export interface ContactDetail extends Contact {
  specialDates: SpecialDate[]
}

export interface SpecialDate {
  id: string
  contactId: string
  type: SpecialDateType
  date: string
  recurrence: RecurrenceType
  lastNotified?: string
  createdAt: string
}

export type SpecialDateType = "BIRTHDAY" | "ANNIVERSARY" | "CHRISTMAS" | "WEDDING" | "CUSTOM"
export type RecurrenceType = "YEARLY" | "MONTHLY" | "ONCE"

export interface CreateContactRequest {
  name: string
  phone?: string
  whatsappId?: string
  consent: boolean
}

export interface UpdateContactRequest {
  name: string
  phone?: string
  whatsappId?: string
  consent?: boolean
}

export interface CreateSpecialDateRequest {
  type: SpecialDateType
  date: string
  recurrence: RecurrenceType
}

export interface UpdateSpecialDateRequest {
  type: SpecialDateType
  date: string
  recurrence: RecurrenceType
}

export interface ImportContactEntry {
  name: string
  phone?: string
  whatsappId?: string
}

export interface ImportReport {
  total: number
  success: number
  errors: number
  errorDetails: {
    row: number
    name: string
    reason: string
  }[]
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface OTPRequest {
  phone: string
}

export interface OTPVerify {
  phone: string
  code: string
}
