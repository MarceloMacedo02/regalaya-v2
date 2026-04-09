// API client utilities
// Centralize API calls with auto-refresh token support

import type { ApiError, PageResponse, RequestOptions } from '@/types/api'
import Cookies from 'js-cookie'

/**
 * Base API configuration
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

/**
 * Timeout para requisições (em ms) - 5 minutos para suportar processamento de IA
 */
export const API_TIMEOUT = 300000;

/**
 * Internal type for retry logic (includes endpoint for reconstruction)
 */
interface RetryRequest extends RequestOptions {
  endpoint?: string
}

/**
 * Flag para evitar múltiplas chamadas de refresh simultâneas
 */
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * Obtém o token JWT dos cookies
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return Cookies.get('accessToken') || localStorage.getItem('accessToken') || null
}

/**
 * Obtém o refresh token dos cookies
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return Cookies.get('refreshToken') || localStorage.getItem('refreshToken') || null
}

/**
 * Obtém o idioma atual do localStorage
 */
function getLanguage(): string {
  if (typeof window === 'undefined') return 'pt'
  return localStorage.getItem('regalaya_language') || 'pt'
}

/**
 * Headers padrão para requisições
 */
export function getDefaultHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept-Language': getLanguage(),
  }

  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * Constrói URL com query params
 */
function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params || Object.keys(params).length === 0) {
    return `${baseUrl}${endpoint}`
  }

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return `${baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`
}

/**
 * Adiciona callback para ser executado após refresh do token
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * Executa todos os callbacks com o novo token
 */
function onRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

/**
 * Limpa todos os callbacks e tokens
 */
function onRefreshFailed() {
  refreshSubscribers = []
  clearAuthTokens()
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login?session=expired'
  }
}

/**
 * Limpa todos os tokens de autenticação
 */
function clearAuthTokens() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  
  Cookies.remove('accessToken', { path: '/' })
  Cookies.remove('refreshToken', { path: '/' })
  Cookies.remove('user', { path: '/' })
}

/**
 * Salva novos tokens
 */
function saveTokens(accessToken: string, refreshToken: string) {
  Cookies.set('accessToken', accessToken, { expires: 7, path: '/', secure: true, sameSite: 'strict' })
  Cookies.set('refreshToken', refreshToken, { expires: 30, path: '/', secure: true, sameSite: 'strict' })
}

/**
 * Tenta renovar o token de acesso
 */
async function attemptTokenRefresh(originalRequest: RetryRequest): Promise<Response> {
  const refreshToken = getRefreshToken()
  
  if (!refreshToken) {
    throw { status: 401, message: 'Sessão expirada' } as ApiError
  }
  
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newToken: string) => {
        originalRequest.headers = {
          ...getDefaultHeaders(),
          ...originalRequest.headers,
          'Authorization': `Bearer ${newToken}`,
        }
        
        const url = buildUrl(API_BASE_URL, originalRequest.endpoint || '')
        fetch(url, {
          ...originalRequest,
          headers: originalRequest.headers,
          body: originalRequest.body ? JSON.stringify(originalRequest.body) : undefined,
        })
          .then(resolve)
          .catch(reject)
      })
    })
  }
  
  isRefreshing = true
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    
    if (!response.ok) {
      throw { status: 401, message: 'Refresh token inválido' } as ApiError
    }
    
    const data = await response.json()
    const { accessToken, refreshToken: newRefreshToken } = data
    
    saveTokens(accessToken, newRefreshToken)
    
    onRefreshed(accessToken)
    
    originalRequest.headers = {
      ...getDefaultHeaders(),
      ...originalRequest.headers,
      'Authorization': `Bearer ${accessToken}`,
    }
    
    const url = buildUrl(API_BASE_URL, originalRequest.endpoint || '')
    return fetch(url, {
      ...originalRequest,
      headers: originalRequest.headers,
      body: originalRequest.body ? JSON.stringify(originalRequest.body) : undefined,
    })
  } catch (error) {
    onRefreshFailed()
    throw error
  } finally {
    isRefreshing = false
  }
}

/**
 * Generic fetch wrapper with error handling and auto-refresh
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = buildUrl(API_BASE_URL, endpoint, options.params)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    clearTimeout(timeoutId)

    // Handle 401 - try to refresh token
    if (response.status === 401) {
      const refreshToken = getRefreshToken()
      
      if (refreshToken && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/logout')) {
        try {
          const retryResponse = await attemptTokenRefresh({ ...options, endpoint })
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}))
            throw {
              status: retryResponse.status,
              message: errorData.message || `Erro na requisição: ${retryResponse.status}`,
            } as ApiError
          }
          
          if (retryResponse.status === 204) {
            return {} as T
          }
          
          return retryResponse.json()
        } catch (refreshError) {
          throw refreshError
        }
      }
      
      clearAuthTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session=expired'
      }
      
      throw { status: 401, message: 'Sessão expirada. Faça login novamente.' } as ApiError
    }

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      const apiError: ApiError = {
        status: response.status,
        message: errorData.message || `Erro na requisição: ${response.status}`,
        error: errorData.error,
        path: errorData.path,
        validationErrors: errorData.validationErrors,
        timestamp: errorData.timestamp,
      }

      throw apiError
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json()
    }

    return response.text() as Promise<T>
  } catch (error) {
    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        status: 408,
        message: 'Timeout da requisição. Tente novamente.',
      } as ApiError
    }

    // Re-throw API errors
    if ((error as ApiError).status !== undefined) {
      throw error
    }

    // Network errors
    throw {
      status: 0,
      message: 'Ops! Tivemos uma instabilidade momentânea na conexão. Por favor, verifique sua rede ou tente novamente em instantes.',
    } as ApiError
  }
}

/**
 * HTTP Methods wrappers
 */
export const http = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) => 
    apiFetch<T>(endpoint, { method: 'GET', params }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, options?: { headers?: HeadersInit }) => 
    apiFetch<T>(endpoint, { method: 'POST', body: data, ...options }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown) => 
    apiFetch<T>(endpoint, { method: 'PUT', body: data }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: unknown) => 
    apiFetch<T>(endpoint, { method: 'PATCH', body: data }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string) => 
    apiFetch<T>(endpoint, { method: 'DELETE' }),
}

/**
 * Helper para paginação
 */
export function buildPageParams(pageable: { page?: number; size?: number; sort?: string }) {
  return {
    page: pageable.page ?? 0,
    size: pageable.size ?? 20,
    ...(pageable.sort && { sort: pageable.sort }),
  }
}
