/**
 * Auth Service
 * 
 * Serviço para operações de autenticação e gestão de usuários.
 */

import { http } from '@/lib/api'
import type { User } from '@/types/user'
import Cookies from 'js-cookie'

export type { User }

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ValidateEmailRequest {
  token: string
  email: string
}

export interface LogoutResponse {
  message: string
  logoutTime: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
}

export const authService = {
  /**
   * Realiza login com email e senha
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/login', data)
    
    this.setTokens(response.accessToken, response.refreshToken, response.user)
    
    return response
  },

  /**
   * Realiza registro de novo usuário
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return http.post<AuthResponse>('/auth/register', data)
  },

  /**
   * Logout - revoga tokens no backend e limpa armazenamento local
   */
  async logout(): Promise<LogoutResponse> {
    const accessToken = this.getAccessToken()
    
    try {
      const response = await http.post<LogoutResponse>('/auth/logout', null, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      })
      
      return response
    } finally {
      this.clearTokens()
    }
  },

  /**
   * Logout local sem chamada ao backend (fallback)
   */
  logoutLocal(): void {
    this.clearTokens()
  },

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    return http.post('/auth/forgot-password', data)
  },

  /**
   * Redefine senha com token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    return http.post('/auth/reset-password', data)
  },

  /**
   * Valida email com token de verificação
   */
  async validateEmail(data: ValidateEmailRequest): Promise<{ valid: boolean; message: string }> {
    return http.post('/auth/validate-email', data)
  },

  /**
   * Renova token de acesso
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/refresh', { refreshToken })
    
    this.setTokens(response.accessToken, response.refreshToken, response.user)
    
    return response
  },

  /**
   * Obtém usuário autenticado do armazenamento
   */
  getAuthenticatedUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userCookie = Cookies.get('user')
    if (userCookie) {
      try {
        return JSON.parse(userCookie)
      } catch {
        return null
      }
    }
    
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    
    return null
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  },

  /**
   * Obtém access token
   */
  getAccessToken(): string | undefined {
    if (typeof window === 'undefined') return undefined
    return Cookies.get('accessToken') || localStorage.getItem('accessToken') || undefined
  },

  /**
   * Obtém refresh token
   */
  getRefreshToken(): string | undefined {
    if (typeof window === 'undefined') return undefined
    return Cookies.get('refreshToken') || localStorage.getItem('refreshToken') || undefined
  },

  /**
   * Salva tokens e usuário
   */
  setTokens(accessToken: string, refreshToken: string, user: User): void {
    Cookies.set('accessToken', accessToken, { expires: 7, path: '/', secure: true, sameSite: 'strict' })
    Cookies.set('refreshToken', refreshToken, { expires: 30, path: '/', secure: true, sameSite: 'strict' })
    Cookies.set('user', JSON.stringify(user), { expires: 7, path: '/', secure: true, sameSite: 'strict' })
  },

  /**
   * Limpa todos os tokens
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      Cookies.remove('accessToken', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      Cookies.remove('user', { path: '/' })
    }
  },
}
