import { renderHook, waitFor, act } from '@testing-library/react'
import { useProducts } from '../useProducts'
import { productsService } from '@/services/products.service'

jest.mock('@/services/products.service')

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchProducts', () => {
    it('should fetch products on mount', async () => {
      // Arrange
      const mockResponse = {
        content: [
          { id: '1', name: 'Product 1', price: 99.90, stockQuantity: 10 },
          { id: '2', name: 'Product 2', price: 149.90, stockQuantity: 5 },
        ],
        page: 0,
        size: 20,
        totalElements: 2,
        totalPages: 1,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 2,
      }
      ;(productsService.findAll as jest.Mock).mockResolvedValue(mockResponse)

      // Act
      const { result } = renderHook(() => useProducts())

      // Assert
      expect(result.current.loading).toBe(true)
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.products).toHaveLength(2)
      expect(result.current.totalElements).toBe(2)
      expect(result.current.totalPages).toBe(1)
      expect(productsService.findAll).toHaveBeenCalledWith(0, 20, undefined, undefined)
    })

    it('should handle error on fetch', async () => {
      // Arrange
      const mockError = {
        status: 500,
        message: 'Erro interno ao buscar produtos',
      }
      ;(productsService.findAll as jest.Mock).mockRejectedValue(mockError)

      // Act
      const { result } = renderHook(() => useProducts())

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toEqual(mockError)
      expect(result.current.products).toHaveLength(0)
    })

    it('should fetch products with filters and sort', async () => {
      // Arrange
      const mockResponse = {
        content: [{ id: '1', name: 'Product 1', price: 99.90 }],
        page: 0,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 1,
      }
      ;(productsService.findAll as jest.Mock).mockResolvedValue(mockResponse)

      const filters = {
        categoryId: 'cat-123',
        minPrice: 50,
        maxPrice: 150,
        inStock: true,
        search: 'product',
      }
      const sort = {
        field: 'price' as const,
        order: 'asc' as const,
      }

      // Act
      const { result } = renderHook(() => useProducts())
      await act(async () => {
        await result.current.fetchProducts(0, filters, sort)
      })

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(productsService.findAll).toHaveBeenCalledWith(0, 20, filters, sort)
    })
  })

  describe('fetchProductById', () => {
    it('should fetch product by id', async () => {
      // Arrange
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        price: 99.90,
        description: 'Description',
      }
      ;(productsService.findById as jest.Mock).mockResolvedValue(mockProduct)

      // Act
      const { result } = renderHook(() => useProducts())
      let product
      await act(async () => {
        product = await result.current.fetchProductById('1')
      })

      // Assert
      expect(product).toEqual(mockProduct)
      expect(productsService.findById).toHaveBeenCalledWith('1')
    })

    it('should handle error when fetching by id', async () => {
      // Arrange
      const mockError = {
        status: 404,
        message: 'Produto não encontrado',
      }
      ;(productsService.findById as jest.Mock).mockRejectedValue(mockError)

      // Act
      const { result } = renderHook(() => useProducts())

      // Assert
      await expect(result.current.fetchProductById('1')).rejects.toEqual(mockError)
      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('CRUD operations', () => {
    it('should create product and refetch', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Product 1', price: 99.90 }
      ;(productsService.create as jest.Mock).mockResolvedValue(mockProduct)
      ;(productsService.findAll as jest.Mock).mockResolvedValue({
        content: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 0,
      })

      const { result } = renderHook(() => useProducts())

      // Act
      let createdProduct
      await act(async () => {
        createdProduct = await result.current.createProduct({
          name: 'Product 1',
          description: 'Description',
          price: 99.90,
          stockQuantity: 10,
          categoryId: 'uuid',
        })
      })

      // Assert
      expect(createdProduct).toEqual(mockProduct)
      expect(productsService.create).toHaveBeenCalledTimes(1)
      expect(productsService.findAll).toHaveBeenCalledTimes(2) // Initial + refetch
    })

    it('should update product and refetch', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Updated Product', price: 149.90 }
      ;(productsService.update as jest.Mock).mockResolvedValue(mockProduct)
      ;(productsService.findAll as jest.Mock).mockResolvedValue({
        content: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 0,
      })

      const { result } = renderHook(() => useProducts())

      // Act
      let updatedProduct
      await act(async () => {
        updatedProduct = await result.current.updateProduct('1', {
          name: 'Updated Product',
          price: 149.90,
        })
      })

      // Assert
      expect(updatedProduct).toEqual(mockProduct)
      expect(productsService.update).toHaveBeenCalledWith('1', expect.any(Object))
      expect(productsService.findAll).toHaveBeenCalledTimes(2)
    })

    it('should delete product and refetch', async () => {
      // Arrange
      ;(productsService.delete as jest.Mock).mockResolvedValue(undefined)
      ;(productsService.findAll as jest.Mock).mockResolvedValue({
        content: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 0,
      })

      const { result } = renderHook(() => useProducts())

      // Act
      await act(async () => {
        await result.current.deleteProduct('1')
      })

      // Assert
      expect(productsService.delete).toHaveBeenCalledWith('1')
      expect(productsService.findAll).toHaveBeenCalledTimes(2)
    })
  })

  describe('pagination', () => {
    it('should calculate hasNext and hasPrevious correctly', async () => {
      // Arrange
      const mockResponse = {
        content: [],
        page: 5,
        totalElements: 100,
        totalPages: 10,
        first: false,
        last: false,
        empty: false,
        numberOfElements: 10,
      }
      ;(productsService.findAll as jest.Mock).mockResolvedValue(mockResponse)

      // Act
      const { result } = renderHook(() => useProducts())

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.hasNext).toBe(true) // page 5 < totalPages 10 - 1
      expect(result.current.hasPrevious).toBe(true) // page 5 > 0
    })

    it('should set page correctly', async () => {
      // Arrange
      const mockResponse = {
        content: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 0,
      }
      ;(productsService.findAll as jest.Mock).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useProducts())

      // Act
      await act(async () => {
        result.current.setPage(3)
      })

      // Assert
      await waitFor(() => {
        expect(result.current.page).toBe(3)
      })
      expect(productsService.findAll).toHaveBeenCalledTimes(2) // Initial + page change
    })
  })

  describe('refetch and clearError', () => {
    it('should refetch when called', async () => {
      // Arrange
      const mockResponse = {
        content: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        empty: false,
        numberOfElements: 0,
      }
      ;(productsService.findAll as jest.Mock).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useProducts())

      // Act
      await act(async () => {
        result.current.refetch()
      })

      // Assert
      await waitFor(() => {
        expect(productsService.findAll).toHaveBeenCalledTimes(2)
      })
    })

    it('should clear error', async () => {
      // Arrange
      const mockError = { status: 500, message: 'Error' }
      ;(productsService.findAll as jest.Mock).mockRejectedValue(mockError)

      const { result } = renderHook(() => useProducts())

      // Assert - error should be set
      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })

      // Act
      act(() => {
        result.current.clearError()
      })

      // Assert
      expect(result.current.error).toBeNull()
    })
  })
})
