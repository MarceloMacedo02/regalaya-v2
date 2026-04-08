"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Package,
  Loader2,
} from "lucide-react"
import { categories } from "@/lib/mock-data"
import { Product } from "@/lib/mock-data"
import { ImageUploadManager } from "@/components/admin/image-upload-manager"
import { AIDescriptionGenerator } from "@/components/admin/ai-description-generator"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    compareAtPrice: undefined,
    categoryId: "",
    category: "",
    images: [],
    tags: [],
    stock: 0,
    sku: "",
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({ ...product })
    }
  }, [product])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero"
    }

    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = "Estoque não pode ser negativo"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Selecione uma categoria"
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "Adicione pelo menos uma imagem ao produto"
    }

    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = "Descrição deve ter pelo menos 20 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, this would save to the database
    console.log("Saving product:", formData)

    toast({
      title: mode === "create" ? "Produto criado!" : "Produto atualizado!",
      description: `${formData.name} foi ${mode === "create" ? "criado" : "atualizado"} com sucesso.`,
    })

    setIsSaving(false)
    router.push("/admin/products")
  }

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images })
    if (images.length > 0 && errors.images) {
      const { images: _, ...rest } = errors
      setErrors(rest)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {mode === "create" ? "Novo Produto" : "Editar Produto"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Preencha as informações para criar um novo produto"
              : `Editando: ${product?.name}`}
          </p>
        </div>
        <Badge variant={formData.isActive ? "success" : "secondary"} className="text-sm">
          {formData.isActive ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>
                  Dados principais do produto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Caixa de Bombons Premium"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Descrição do Produto *</Label>
                    <AIDescriptionGenerator
                      productName={formData.name || ""}
                      category={formData.category || ""}
                      price={formData.price || 0}
                      tags={formData.tags}
                      currentDescription={formData.description}
                      onGenerate={(description) =>
                        setFormData({ ...formData, description })
                      }
                    />
                  </div>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[150px] ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="Descreva o produto detalhadamente... ou use o gerador de IA acima"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Dica: Use o botão &quot;Gerar com IA&quot; para criar uma descrição automática
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descrição Curta (opcional)</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDescription: e.target.value })
                    }
                    placeholder="Ex: 12 chocolates belgas artesanais"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aparece como destaque no início da página do produto
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
                <CardDescription>
                  Adicione até 6 imagens (1 principal + 5 adicionais)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadManager
                  images={formData.images || []}
                  onChange={handleImagesChange}
                  maxImages={6}
                />
                {errors.images && (
                  <p className="text-sm text-destructive mt-2">{errors.images}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Preços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Preço Promocional (R$)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="Opcional"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se preenchido, aparece riscado ao lado do preço atual
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Estoque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantidade em Estoque *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className={errors.stock ? "border-red-500" : ""}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">{errors.stock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Código</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Ex: CHOC-001"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Categoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => {
                      const category = categories.find((c) => c.id === value)
                      setFormData({
                        ...formData,
                        categoryId: value,
                        category: category?.name,
                      })
                    }}
                  >
                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-destructive">{errors.categoryId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="ex: chocolate, presente, premium"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded"
                  />
                  <Label htmlFor="isActive" className="font-medium cursor-pointer">
                    Produto ativo e visível na loja
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full gap-2" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {mode === "create" ? "Criar Produto" : "Salvar Alterações"}
                  </>
                )}
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
