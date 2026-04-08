/**
 * Auth Context
 * 
 * Contexto global para estado de autenticação.
 * Gerencia user state, login, logout, refresh de tokens e proteção de rotas.
 */

'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useToast } from '@/hooks/use-toast'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/services/auth.service'
import type { ApiError } from '@/types/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshSession: () => Promise<boolean>
  clearError: () => void
  error: ApiError | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const REFRESH_THRESHOLD_MS = 5 * 60 * 1000

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-account']
const ADMIN_ROUTES = ['/admin']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const storedUser = authService.getAuthenticatedUser()
    setUser(storedUser)
    setLoading(false)
    
    if (storedUser && authService.getRefreshToken()) {
      scheduleTokenRefresh()
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))
      
      if (!isPublicRoute && pathname !== '/') {
        router.push('/login')
      }
    }
    
    if (user && pathname === '/login') {
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        router.push('/admin/dashboard')
      } else {
        router.push('/account')
      }
    }
  }, [user, loading, pathname, router])

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
    }
    
    refreshTimerRef.current = setTimeout(async () => {
      const refreshToken = authService.getRefreshToken()
      if (refreshToken) {
        try {
          await authService.refreshToken(refreshToken)
          scheduleTokenRefresh()
        } catch {
          authService.clearTokens()
          setUser(null)
          router.push('/login')
        }
      }
    }, REFRESH_THRESHOLD_MS)
  }, [router])

  const login = useCallback(async (data: LoginRequest) => {
    setError(null)
    try {
      const response = await authService.login(data)
      
      setUser(response.user)
      
      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${response.user.name}!`,
      })
      
      scheduleTokenRefresh()
      
      return response
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: apiError.message || 'Credenciais inválidas',
      })
      
      throw err
    }
  }, [toast, scheduleTokenRefresh])

  const register = useCallback(async (data: RegisterRequest) => {
    setError(null)
    try {
      const response = await authService.register(data)
      
      if (response.accessToken) {
        authService.setTokens(response.accessToken, response.refreshToken, response.user)
        setUser(response.user)
        scheduleTokenRefresh()
      }
      
      toast({
        title: 'Conta criada!',
        description: 'Bem-vindo à Regalaya!',
      })
      
      return response
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      
      toast({
        variant: 'destructive',
        title: 'Erro no registro',
        description: apiError.message || 'Não foi possível criar a conta',
      })
      
      throw err
    }
  }, [toast, scheduleTokenRefresh])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      authService.clearTokens()
    } finally {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
      
      setUser(null)
      
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      })
      
      router.push('/login')
    }
  }, [router, toast])

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = authService.getRefreshToken()
    if (!refreshToken) {
      return false
    }
    
    try {
      const response = await authService.refreshToken(refreshToken)
      setUser(response.user)
      scheduleTokenRefresh()
      return true
    } catch {
      authService.clearTokens()
      setUser(null)
      return false
    }
  }, [scheduleTokenRefresh])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshSession,
        clearError,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  
  return context
}
