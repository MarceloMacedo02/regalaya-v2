/**
 * Hook para tratamento de erros de API.
 * 
 * Fornece tratamento padronizado para erros de API com toast notifications.
 */

'use client'

import { useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { ApiError } from '@/types/api'
import { useRouter } from 'next/navigation'

interface UseErrorHandlerReturn {
  handleError: (error: unknown, context?: string) => void
  clearError: () => void
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const { toast } = useToast()
  const router = useRouter()

  /**
   * Trata erros de API com toast notifications.
   */
  const handleError = useCallback((error: unknown, context?: string) => {
    const apiError = error as ApiError

    // Log error para debugging
    console.error(`[${context || 'API Error'}]:`, error)

    // Validação errors (400)
    if (apiError.validationErrors) {
      Object.entries(apiError.validationErrors).forEach(([field, message]) => {
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: message,
          duration: 5000,
        })
      })
      return
    }

    // Tratamento por status code
    switch (apiError.status) {
      case 400:
        toast({
          variant: 'destructive',
          title: 'Requisição inválida',
          description: apiError.message || 'Verifique os dados informados',
          duration: 5000,
        })
        break

      case 401:
        toast({
          variant: 'destructive',
          title: 'Não autenticado',
          description: 'Faça login para continuar',
          duration: 5000,
        })
        // Redirect para login com tratamento de erro
        try {
          router.push('/login')
        } catch (error) {
          console.error('Redirect failed:', error)
        }
        break

      case 403:
        toast({
          variant: 'destructive',
          title: 'Acesso negado',
          description: 'Você não tem permissão para esta ação',
          duration: 5000,
        })
        break

      case 404:
        toast({
          variant: 'destructive',
          title: 'Não encontrado',
          description: apiError.message || 'Recurso não encontrado',
          duration: 5000,
        })
        break

      case 409:
        toast({
          variant: 'destructive',
          title: 'Conflito',
          description: apiError.message || 'Já existe um recurso com estes dados',
          duration: 5000,
        })
        break

      case 422:
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: apiError.message || 'Dados inválidos',
          duration: 5000,
        })
        break

      case 429:
        toast({
          variant: 'destructive',
          title: 'Muitas requisições',
          description: 'Aguarde alguns instantes e tente novamente',
          duration: 5000,
        })
        break

      case 500:
        toast({
          variant: 'destructive',
          title: 'Erro interno',
          description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
          duration: 5000,
        })
        break

      case 0:
        // Network error
        toast({
          variant: 'destructive',
          title: 'Erro de conexão',
          description: 'Verifique sua conexão com a internet',
          duration: 5000,
        })
        break

      default:
        toast({
          variant: 'destructive',
          title: getErrorTitle(apiError.status),
          description: apiError.message || 'Ocorreu um erro',
          duration: 5000,
        })
    }
  }, [toast, router])

  /**
   * Limpa erros (útil para forms).
   */
  const clearError = useCallback(() => {
    // Pode ser expandido para limpar estado de erro específico
  }, [])

  return {
    handleError,
    clearError,
  }
}

/**
 * Obtém título do erro baseado no status code.
 */
function getErrorTitle(status: number): string {
  switch (status) {
    case 400:
      return 'Requisição inválida'
    case 401:
      return 'Não autenticado'
    case 403:
      return 'Acesso negado'
    case 404:
      return 'Não encontrado'
    case 409:
      return 'Conflito'
    case 422:
      return 'Erro de validação'
    case 429:
      return 'Muitas requisições'
    case 500:
      return 'Erro interno'
    default:
      return 'Erro na requisição'
  }
}
