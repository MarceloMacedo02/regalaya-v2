"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type Context,
} from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { useToast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

function getLanguage(): string {
  if (typeof window === "undefined") return "pt"
  return localStorage.getItem("regalaya_language") || "pt"
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": getLanguage(),
  }
  const token = authService.getAccessToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

const SERVER_ERROR_MESSAGES: Record<string, string> = {
  pt: "Serviço temporariamente indisponível. Tente novamente em instantes.",
  es: "Servicio temporalmente no disponible. Inténtalo de nuevo en un momento.",
  en: "Service temporarily unavailable. Please try again shortly.",
}

function getServerErrorMessage(): string {
  if (typeof window === "undefined") return SERVER_ERROR_MESSAGES.pt
  const lang = localStorage.getItem("regalaya_language") || "pt"
  return SERVER_ERROR_MESSAGES[lang] || SERVER_ERROR_MESSAGES.pt
}

interface User {
  id: string
  phone: string
  name?: string
  email?: string
  username?: string
  role: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

interface RegisterData {
  name: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phoneCountryCode: string
  phoneAreaCode: string
  phoneNumber: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (phone: string) => Promise<void>
  verifyOTP: (phone: string, code: string) => Promise<void>

  register: (data: RegisterData) => Promise<void>
  loginWithPassword: (emailOrPhone: string, password: string) => Promise<User>
  forgotPassword: (email: string) => Promise<{ success: boolean }>
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<{ success: boolean }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean }>
  validateEmail: (token: string, email: string) => Promise<{ valid: boolean; message: string }>

  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
}

const AuthContext: Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const refreshTimerRef = useState<NodeJS.Timeout | null>(null)[0]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = authService.getAuthenticatedUser()
        const storedRefreshToken = authService.getRefreshToken()

        if (storedUser && storedRefreshToken) {
          setUser(storedUser as User)
          setTokens({
            accessToken: authService.getAccessToken() || '',
            refreshToken: storedRefreshToken,
            expiresAt: Date.now() + 15 * 60 * 1000,
          })

          scheduleTokenRefresh(storedRefreshToken)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const clearAuth = () => {
    authService.clearTokens()
    setUser(null)
    setTokens(null)
    if (refreshTimerRef) {
      clearTimeout(refreshTimerRef)
    }
  }

  const scheduleTokenRefresh = useCallback((refreshToken: string) => {
    const refreshTime = 10 * 60 * 1000

    const timer = setTimeout(async () => {
      try {
        const response = await authService.refreshToken(refreshToken)
        setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresAt: Date.now() + 15 * 60 * 1000,
        })
        scheduleTokenRefresh(response.refreshToken)
      } catch {
        clearAuth()
        router.push("/login?session=expired")
      }
    }, refreshTime)

    return timer
  }, [router])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedRefreshToken = authService.getRefreshToken()
      if (!storedRefreshToken) return false

      const response = await authService.refreshToken(storedRefreshToken)

      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + 15 * 60 * 1000,
      })

      scheduleTokenRefresh(response.refreshToken)

      return true
    } catch (error) {
      console.error("Token refresh failed:", error)
      return false
    }
  }, [scheduleTokenRefresh])

  const login = async (phone: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (phone: string, code: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser: User = {
        id: "1",
        phone,
        role: "admin",
      }

      const mockTokens: AuthTokens = {
        accessToken: `mock_access_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        expiresAt: Date.now() + 60 * 60 * 1000,
      }

      setUser(mockUser)
      setTokens(mockTokens)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      authService.clearTokens()
    } finally {
      clearAuth()

      toast({
        title: "Logout realizado",
        description: "Até logo!",
      })

      router.push("/login")
    }
  }, [router, toast])

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          name: `${data.name} ${data.lastName}`,
          email: data.email,
          password: data.password,
          username: data.email,
          phone: `${data.phoneCountryCode}${data.phoneAreaCode}${data.phoneNumber}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao registrar')
      }

      const result = await response.json()

      authService.setTokens(result.accessToken, result.refreshToken, result.user)
      setUser(result.user)
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + 15 * 60 * 1000,
      })

      scheduleTokenRefresh(result.refreshToken)
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(getServerErrorMessage())
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPassword = async (emailOrPhone: string, password: string): Promise<User> => {
    setIsLoading(true)
    try {
      const response = await authService.login({
        email: emailOrPhone,
        password,
      })

      setUser(response.user as User)
      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + 15 * 60 * 1000,
      })

      scheduleTokenRefresh(response.refreshToken)

      return response.user as User
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(getServerErrorMessage())
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword({ email })

      return { success: true }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(getServerErrorMessage())
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string, _confirmPassword: string) => {
    setIsLoading(true)
    try {
      await authService.resetPassword({ token, newPassword: password })

      return { success: true }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(getServerErrorMessage())
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = async (token: string, email: string) => {
    return authService.validateEmail({ token, email })
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao alterar senha')
      }

      return { success: true }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(getServerErrorMessage())
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        verifyOTP,
        register,
        loginWithPassword,
        forgotPassword,
        resetPassword,
        changePassword,
        validateEmail,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-gold-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Verificando autenticação...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "admin" && user?.role !== "ADMIN" && user?.role !== "MANAGER") {
        router.push("/")
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-gold-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Verificando permissões...</p>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "ADMIN" && user?.role !== "MANAGER")) {
    return null
  }

  return <>{children}</>
}
