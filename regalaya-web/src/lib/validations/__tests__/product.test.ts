import { createProductSchema, updateProductSchema, productFiltersSchema, productSortSchema } from '../product'

describe('createProductSchema', () => {
  it('should validate valid product', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida com mais de 10 caracteres',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      imageUrl: 'https://cdn.example.com/img.jpg',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should reject name less than 3 chars', () => {
    // Arrange
    const data = {
      name: 'AB',
      description: 'Descrição válida com mais de 10 caracteres',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Nome deve ter pelo menos 3 caracteres')
  })

  it('should reject name more than 100 chars', () => {
    // Arrange
    const data = {
      name: 'A'.repeat(101),
      description: 'Descrição válida',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Nome deve ter no máximo 100 caracteres')
  })

  it('should reject description less than 10 chars', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Curta',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Descrição deve ter pelo menos 10 caracteres')
  })

  it('should reject invalid price (zero)', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: 0,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Preço deve ser maior que zero')
  })

  it('should reject invalid price (negative)', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: -10,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
  })

  it('should reject negative stockQuantity', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: 99.90,
      stockQuantity: -5,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Quantidade deve ser não negativa')
  })

  it('should reject invalid UUID for categoryId', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'invalid-uuid',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Categoria deve ser um UUID válido')
  })

  it('should reject invalid URL for imageUrl', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      imageUrl: 'not-a-url',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('URL da imagem deve ser válida')
  })

  it('should accept optional fields as empty string', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      imageUrl: '',
      ecommerceId: '',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should accept optional fields as undefined', () => {
    // Arrange
    const data = {
      name: 'Produto Teste',
      description: 'Descrição válida',
      price: 99.90,
      stockQuantity: 10,
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }

    // Act
    const result = createProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })
})

describe('updateProductSchema', () => {
  it('should accept partial update', () => {
    // Arrange
    const data = {
      name: 'Produto Atualizado',
    }

    // Act
    const result = updateProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should validate price when provided', () => {
    // Arrange
    const data = {
      price: -10,
    }

    // Act
    const result = updateProductSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
  })
})

describe('productFiltersSchema', () => {
  it('should validate valid filters', () => {
    // Arrange
    const data = {
      categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      minPrice: 50,
      maxPrice: 150,
      inStock: true,
      search: 'product',
    }

    // Act
    const result = productFiltersSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should accept empty filters', () => {
    // Arrange
    const data = {}

    // Act
    const result = productFiltersSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID for categoryId', () => {
    // Arrange
    const data = {
      categoryId: 'invalid',
    }

    // Act
    const result = productFiltersSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
  })
})

describe('productSortSchema', () => {
  it('should validate valid sort', () => {
    // Arrange
    const data = {
      field: 'price',
      order: 'asc',
    }

    // Act
    const result = productSortSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should reject invalid field', () => {
    // Arrange
    const data = {
      field: 'invalid',
      order: 'asc',
    }

    // Act
    const result = productSortSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
  })

  it('should reject invalid order', () => {
    // Arrange
    const data = {
      field: 'price',
      order: 'invalid',
    }

    // Act
    const result = productSortSchema.safeParse(data)

    // Assert
    expect(result.success).toBe(false)
  })
})
