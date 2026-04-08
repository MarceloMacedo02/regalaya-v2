/**
 * Products Service
 * 
 * Serviço para operações com produtos e categorias.
 */

import { http, buildPageParams } from '@/lib/api'
import type { Product, ProductFilters, ProductSort, CreateProductRequest, UpdateProductRequest } from '@/types/product'
import type { Category } from '@/types/category'
import type { PageResponse } from '@/types/api'

export { CreateProductRequest, UpdateProductRequest }
export type { Product }

export const productsService = {
  /**
   * Lista produtos com paginação e filtros
   */
  async findAll(
    page = 0,
    size = 20,
    filters?: ProductFilters,
    sort?: ProductSort
  ): Promise<PageResponse<Product>> {
    const params: Record<string, string | number> = {
      ...buildPageParams({ page, size }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.minPrice !== undefined && { minPrice: filters.minPrice }),
      ...(filters?.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
      ...(filters?.search && { search: filters.search }),
      ...(sort && { sort: `${sort.field},${sort.order}` }),
    }

    return http.get<PageResponse<Product>>('/products', params)
  },

  /**
   * Busca produto por ID
   */
  async findById(id: string): Promise<Product> {
    return http.get<Product>(`/products/${id}`)
  },

  /**
   * Busca produto por slug
   */
  async findBySlug(slug: string): Promise<Product> {
    return http.get<Product>(`/products/slug/${slug}`)
  },

  /**
   * Cria novo produto
   */
  async create(data: CreateProductRequest): Promise<Product> {
    return http.post<Product>('/products', data)
  },

  /**
   * Atualiza produto existente
   */
  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    return http.put<Product>(`/products/${id}`, data)
  },

  /**
   * Atualiza parcialmente
   */
  async patch(id: string, data: Partial<UpdateProductRequest>): Promise<Product> {
    return http.patch<Product>(`/products/${id}`, data)
  },

  /**
   * Deleta produto
   */
  async delete(id: string): Promise<void> {
    return http.delete(`/products/${id}`)
  },

  /**
   * Lista categorias
   */
  async findCategories(): Promise<Category[]> {
    return http.get<Category[]>('/categories')
  },

  /**
   * Busca sugestões de produtos (autocomplete)
   */
  async getSuggestions(query: string): Promise<Product[]> {
    return http.get<Product[]>(`/products/suggestions`, { q: query })
  },

  /**
   * Cria nova categoria
   */
  async createCategory(data: { name: string; slug: string; description?: string; imageUrl?: string; parentId?: string }): Promise<Category> {
    return http.post<Category>('/categories', data)
  },

  /**
   * Atualiza categoria
   */
  async updateCategory(id: string, data: { name: string; slug: string; description?: string; imageUrl?: string; parentId?: string }): Promise<Category> {
    return http.put<Category>(`/categories/${id}`, data)
  },

  /**
   * Deleta categoria
   */
  async deleteCategory(id: string): Promise<void> {
    return http.delete(`/categories/${id}`)
  },

  /**
   * Upload de imagem para S3
   */
  async uploadImage(file: File, productId?: string): Promise<{ url: string; key: string }> {
    const formData = new FormData()
    formData.append('file', file)
    if (productId) {
      formData.append('productId', productId)
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/products/upload-image`,
      {
        method: 'POST',
        body: formData,
        headers: {
          // Não setar Content-Type para FormData - o browser seta automaticamente com boundary
        },
        credentials: 'include',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    return response.json()
  },
}
