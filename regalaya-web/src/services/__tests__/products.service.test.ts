import { productsService } from '../products.service'
import { http } from '@/lib/api'

jest.mock('@/lib/api')

describe('productsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return paginated products', async () => {
      // Arrange
      const mockResponse = {
        content: [
          { id: '1', name: 'Product 1', price: 99.90 },
          { id: '2', name: 'Product 2', price: 149.90 },
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
      ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

      // Act
      const result = await productsService.findAll(0, 20)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(http.get).toHaveBeenCalledWith('/products', {
        page: 0,
        size: 20,
      })
    })

    it('should pass filters and sort to API', async () => {
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
      ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

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
      await productsService.findAll(0, 20, filters, sort)

      // Assert
      expect(http.get).toHaveBeenCalledWith('/products', {
        page: 0,
        size: 20,
        categoryId: 'cat-123',
        minPrice: 50,
        maxPrice: 150,
        search: 'product',
        sort: 'price,asc',
      })
    })
  })

  describe('findById', () => {
    it('should return product by id', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Product 1', price: 99.90 }
      ;(http.get as jest.Mock).mockResolvedValue(mockProduct)

      // Act
      const result = await productsService.findById('1')

      // Assert
      expect(result).toEqual(mockProduct)
      expect(http.get).toHaveBeenCalledWith('/products/1')
    })
  })

  describe('findBySlug', () => {
    it('should return product by slug', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Product 1', slug: 'product-1' }
      ;(http.get as jest.Mock).mockResolvedValue(mockProduct)

      // Act
      const result = await productsService.findBySlug('product-1')

      // Assert
      expect(result).toEqual(mockProduct)
      expect(http.get).toHaveBeenCalledWith('/products/slug/product-1')
    })
  })

  describe('create', () => {
    it('should create a new product', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Product 1', price: 99.90 }
      ;(http.post as jest.Mock).mockResolvedValue(mockProduct)

      const requestData = {
        name: 'Product 1',
        description: 'Description',
        price: 99.90,
        stockQuantity: 10,
        categoryId: 'category-id',
      }

      // Act
      const result = await productsService.create(requestData)

      // Assert
      expect(result).toEqual(mockProduct)
      expect(http.post).toHaveBeenCalledWith('/products', requestData)
    })
  })

  describe('update', () => {
    it('should update an existing product', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Updated Product', price: 149.90 }
      ;(http.put as jest.Mock).mockResolvedValue(mockProduct)

      const updateData = {
        name: 'Updated Product',
        price: 149.90,
      }

      // Act
      const result = await productsService.update('1', updateData)

      // Assert
      expect(result).toEqual(mockProduct)
      expect(http.put).toHaveBeenCalledWith('/products/1', updateData)
    })
  })

  describe('patch', () => {
    it('should partially update a product', async () => {
      // Arrange
      const mockProduct = { id: '1', name: 'Patched Product' }
      ;(http.patch as jest.Mock).mockResolvedValue(mockProduct)

      const patchData = {
        name: 'Patched Product',
      }

      // Act
      const result = await productsService.patch('1', patchData)

      // Assert
      expect(result).toEqual(mockProduct)
      expect(http.patch).toHaveBeenCalledWith('/products/1', patchData)
    })
  })

  describe('delete', () => {
    it('should delete a product', async () => {
      // Arrange
      ;(http.delete as jest.Mock).mockResolvedValue(undefined)

      // Act
      await productsService.delete('1')

      // Assert
      expect(http.delete).toHaveBeenCalledWith('/products/1')
    })
  })

  describe('findCategories', () => {
    it('should return categories', async () => {
      // Arrange
      const mockCategories = [
        { id: '1', name: 'Category 1', slug: 'category-1' },
        { id: '2', name: 'Category 2', slug: 'category-2' },
      ]
      ;(http.get as jest.Mock).mockResolvedValue(mockCategories)

      // Act
      const result = await productsService.findCategories()

      // Assert
      expect(result).toEqual(mockCategories)
      expect(http.get).toHaveBeenCalledWith('/categories')
    })
  })
})
