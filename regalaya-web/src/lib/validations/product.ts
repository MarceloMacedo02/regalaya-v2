import { z } from 'zod';

/**
 * Schema de validação para criação de produto.
 * Alinhado com backend CreateProductRequest.
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),

  price: z
    .number()
    .min(0.01, 'Preço deve ser maior que zero')
    .max(999999.99, 'Preço deve ser menor que 999999.99'),

  stockQuantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade deve ser não negativa')
    .max(10000, 'Quantidade deve ser menor que 10000')
    .optional()
    .default(0),

  categoryId: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .uuid('Categoria deve ser um UUID válido'),

  imageUrl: z
    .string()
    .url('URL da imagem deve ser válida')
    .optional()
    .or(z.literal('')),

  ecommerceId: z
    .string()
    .optional()
    .or(z.literal(''))
});

/**
 * Schema de validação para update de produto.
 * Todos os campos são opcionais (update parcial).
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Schema de validação para filtro de produtos.
 */
export const productFiltersSchema = z.object({
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  search: z.string().min(1).optional()
});

/**
 * Schema de validação para ordenação de produtos.
 */
export const productSortSchema = z.object({
  field: z.enum(['price', 'name', 'createdAt', 'sales']),
  order: z.enum(['asc', 'desc'])
});

// Types inferidos dos schemas
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type ProductSort = z.infer<typeof productSortSchema>;
