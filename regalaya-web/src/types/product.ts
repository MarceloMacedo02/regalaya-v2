// Product types

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  images: string[]
  categoryId: string
  category?: import("./category").Category
  tags: string[]
  sku?: string
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  inStock?: boolean
  search?: string
}

export interface ProductSort {
  field: "price" | "name" | "createdAt" | "sales"
  order: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * DTO para criação de produto
 */
export interface CreateProductRequest {
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryId: string
  imageUrl?: string
  ecommerceId?: string
  shortDescription?: string
  compareAtPrice?: number
  images?: string[]
  tags?: string[]
  sku?: string
  isActive?: boolean
}

/**
 * DTO para atualização de produto
 */
export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  stockQuantity?: number
  categoryId?: string
  imageUrl?: string
  ecommerceId?: string
  shortDescription?: string
  compareAtPrice?: number
  images?: string[]
  tags?: string[]
  sku?: string
  isActive?: boolean
}
