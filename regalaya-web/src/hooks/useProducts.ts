/**
 * Hook para operações com produtos.
 * 
 * Gerencia estado, loading, error e operações CRUD de produtos.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { productsService } from '@/services/products.service'
import type { Product, CreateProductRequest, UpdateProductRequest, ProductFilters, ProductSort } from '@/types/product'
import type { PageResponse, ApiError } from '@/types/api'

interface UseProductsReturn {
  // Estado
  products: Product[]
  loading: boolean
  error: ApiError | null
  
  // Paginação
  page: number
  totalPages: number
  totalElements: number
  hasNext: boolean
  hasPrevious: boolean
  
  // Operações
  fetchProducts: (page?: number, filters?: ProductFilters, sort?: ProductSort) => Promise<void>
  fetchProductById: (id: string) => Promise<Product>
  createProduct: (data: CreateProductRequest) => Promise<Product>
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  
  // Utilitários
  refetch: () => void
  clearError: () => void
  setPage: (page: number) => void
}

export function useProducts(): UseProductsReturn {
  // Estado de dados
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  
  // Paginação
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  
  // Trigger para refetch
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  /**
   * Busca produtos com paginação e filtros.
   */
  const fetchProducts = useCallback(async (
    pageNum = 0,
    filters?: ProductFilters,
    sort?: ProductSort
  ) => {
    setLoading(true)
    setError(null)

    try {
      const response = await productsService.findAll(pageNum, 20, filters, sort)
      setProducts(response.content)
      setPage(response.page)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (err) {
      setError(err as ApiError)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Busca produto por ID.
   */
  const fetchProductById = useCallback(async (id: string): Promise<Product> => {
    setLoading(true)
    setError(null)

    try {
      const product = await productsService.findById(id)
      return product
    } catch (err) {
      setError(err as ApiError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Cria novo produto.
   */
  const createProduct = useCallback(async (data: CreateProductRequest): Promise<Product> => {
    setError(null)
    
    try {
      const product = await productsService.create(data)
      // Trigger refetch
      setRefetchTrigger(prev => prev + 1)
      return product
    } catch (err) {
      setError(err as ApiError)
      throw err
    }
  }, [])

  /**
   * Atualiza produto existente.
   */
  const updateProduct = useCallback(async (id: string, data: UpdateProductRequest): Promise<Product> => {
    setError(null)
    
    try {
      const product = await productsService.update(id, data)
      // Trigger refetch
      setRefetchTrigger(prev => prev + 1)
      return product
    } catch (err) {
      setError(err as ApiError)
      throw err
    }
  }, [])

  /**
   * Deleta produto.
   */
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    setError(null)
    
    try {
      await productsService.delete(id)
      // Trigger refetch
      setRefetchTrigger(prev => prev + 1)
    } catch (err) {
      setError(err as ApiError)
      throw err
    }
  }, [])

  /**
   * Limpa erro.
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Força refetch.
   */
  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1)
  }, [])

  // Auto-fetch on mount ou quando refetchTrigger muda
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        await fetchProducts(page)
      } catch (error) {
        // Error already handled in fetchProducts
        if (isMounted) {
          console.error('Fetch products failed:', error)
        }
      }
    }

    fetchData()

    // Cleanup function para prevenir memory leak
    return () => {
      isMounted = false
    }
  }, [fetchProducts, page, refetchTrigger])

  // Calcula se tem próxima/anterior página
  const hasNext = page < totalPages - 1
  const hasPrevious = page > 0

  return {
    products,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    hasNext,
    hasPrevious,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch,
    clearError,
    setPage,
  }
}
