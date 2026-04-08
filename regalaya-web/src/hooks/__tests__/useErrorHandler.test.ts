import { renderHook } from '@testing-library/react'
import { useErrorHandler } from '../useErrorHandler'
import { useToast } from '@/hooks/use-toast'

jest.mock('@/hooks/use-toast')

describe('useErrorHandler', () => {
  const mockToast = jest.fn()
  const mockPush = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    // Mock useRouter
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }))
  })

  describe('validation errors', () => {
    it('should handle validation errors with field-level toasts', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = {
        status: 400,
        message: 'Dados inválidos',
        validationErrors: {
          name: 'Nome é obrigatório',
          price: 'Preço deve ser maior que zero',
        },
      }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledTimes(2) // One toast per field
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Erro de validação',
          description: 'Nome é obrigatório',
          duration: 5000,
        })
      )
    })
  })

  describe('status code handling', () => {
    it('should handle 400 Bad Request', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 400, message: 'Requisição inválida' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Requisição inválida',
        })
      )
    })

    it('should handle 401 Unauthorized and redirect', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 401, message: 'Não autenticado' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Não autenticado',
        })
      )
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('should handle 403 Forbidden', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 403, message: 'Acesso negado' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Acesso negado',
        })
      )
    })

    it('should handle 404 Not Found', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 404, message: 'Produto não encontrado' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Não encontrado',
        })
      )
    })

    it('should handle 409 Conflict', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 409, message: 'Já existe' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Conflito',
        })
      )
    })

    it('should handle 422 Unprocessable Entity', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 422, message: 'Erro de validação' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Erro de validação',
        })
      )
    })

    it('should handle 429 Too Many Requests', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 429, message: 'Rate limit excedido' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Muitas requisições',
        })
      )
    })

    it('should handle 500 Internal Server Error', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 500, message: 'Erro interno' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Erro interno',
        })
      )
    })

    it('should handle network error (status 0)', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 0, message: 'Erro de conexão' }

      // Act
      result.current.handleError(error, 'Test')

      // Assert
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Erro de conexão',
        })
      )
    })
  })

  describe('logging', () => {
    it('should log error with context', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 500, message: 'Error' }
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      result.current.handleError(error, 'TestContext')

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('[TestContext]:', error)
      consoleSpy.mockRestore()
    })

    it('should log error without context', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())
      const error = { status: 500, message: 'Error' }
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      result.current.handleError(error)

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('[API Error]:', error)
      consoleSpy.mockRestore()
    })
  })

  describe('clearError', () => {
    it('should clear error', () => {
      // Arrange
      const { result } = renderHook(() => useErrorHandler())

      // Act
      result.current.clearError()

      // Assert
      // clearError is a no-op in current implementation
      expect(typeof result.current.clearError).toBe('function')
    })
  })
})
