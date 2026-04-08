// API types genéricos para comunicação backend-frontend

/**
 * Estrutura de erro da API
 */
export interface ApiError {
  status: number
  message: string
  error?: string
  path?: string
  validationErrors?: Record<string, string>
  timestamp?: string
}

/**
 * Resposta paginada padrão (Spring Data Page)
 */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
  numberOfElements: number
}

/**
 * Opções de paginação
 */
export interface Pageable {
  page?: number
  size?: number
  sort?: string
}

/**
 * Response de sucesso genérico
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp?: string
}

/**
 * Tipos de HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Opções para requisição HTTP
 */
export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: HttpMethod
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Função genérica de fetch com tratamento de erros
 */
export type ApiFetch = <T>(endpoint: string, options?: RequestOptions) => Promise<T>
