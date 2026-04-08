"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Package, Filter, Images, Eye, X, Loader2 } from "lucide-react"
import { productsService } from "@/services/products.service"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"
import { ImageUploadManager } from "@/components/admin/image-upload-manager"
import { AIDescriptionGenerator } from "@/components/admin/ai-description-generator"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "", description: "", shortDescription: "", price: 0, compareAtPrice: undefined as number | undefined, categoryId: "", images: [] as string[], tags: [] as string[], stock: 0, sku: "", isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((cat) => map.set(cat.id, cat.name))
    return map
  }, [categories])

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsService.findAll(0, 100),
          productsService.findCategories(),
        ])
        setProducts(productsRes.content || [])
        setCategories(categoriesRes)
      } catch (error) {
        toast({ title: "Erro ao carregar dados", description: "Não foi possível carregar produtos e categorias.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.slug.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && product.isActive) || (statusFilter === "inactive" && !product.isActive)
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchQuery, categoryFilter, statusFilter])

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setFormData({ name: "", description: "", shortDescription: "", price: 0, compareAtPrice: undefined, categoryId: "", images: [], tags: [], stock: 0, sku: "", isActive: true })
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      categoryId: product.categoryId,
      images: product.images || [],
      tags: (product as any).tags || [],
      stock: product.stock,
      sku: product.sku || "",
      isActive: product.isActive,
    })
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = (productId: string) => setProductToDelete(productId)

  const confirmDelete = async () => {
    if (!productToDelete) return
    try {
      await productsService.delete(productToDelete)
      setProducts(products.filter((p) => p.id !== productToDelete))
      toast({ title: "Produto excluído", description: "O produto foi removido com sucesso." })
    } catch {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir o produto.", variant: "destructive" })
    }
    setProductToDelete(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSaving(true)
    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      const data = {
        name: formData.name,
        slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice,
        sku: formData.sku,
        stock: formData.stock,
        categoryId: formData.categoryId,
        images: formData.images,
        isActive: formData.isActive,
      }

      if (editingProduct) {
        await productsService.update(editingProduct.id, data as any)
        toast({ title: "Produto atualizado", description: "O produto foi atualizado com sucesso." })
      } else {
        await productsService.create(data as any)
        toast({ title: "Produto criado", description: "O produto foi cadastrado com sucesso." })
      }

      // Refresh products list
      const productsRes = await productsService.findAll(0, 100)
      setProducts(productsRes.content || [])
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message || "Não foi possível salvar o produto.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name || formData.name.trim().length < 3) newErrors.name = "Nome deve ter pelo menos 3 caracteres"
    if (!formData.price || formData.price <= 0) newErrors.price = "Preço deve ser maior que zero"
    if (formData.stock === undefined || formData.stock < 0) newErrors.stock = "Estoque não pode ser negativo"
    if (!formData.categoryId) newErrors.categoryId = "Selecione uma categoria"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getCategoryName = (categoryId: string) => categoryMap.get(categoryId) || "Sem categoria"

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images })
    if (images.length > 0 && errors.images) {
      const { images: _, ...rest } = errors
      setErrors(rest)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">Cadastre, edite e gerencie seu catálogo de produtos</p>
        </div>
        <Button onClick={handleCreateProduct} className="btn-elegant gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Produtos</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Produtos Ativos</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{products.filter((p) => p.isActive).length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estoque Baixo</span>
            <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <span className="text-amber-600 font-bold">!</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">{products.filter((p) => p.stock > 0 && p.stock <= 10).length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Imagens/Média</span>
            <div className="h-9 w-9 rounded-lg bg-[#00A8E8]/10 flex items-center justify-center">
              <Images className="h-5 w-5 text-[#00A8E8]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {products.length > 0 ? ((products.reduce((acc, p) => acc + (p.images?.length || 0), 0) / products.length) || 0).toFixed(1) : "0"}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Buscar por nome ou slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-4 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all"
                style={{ backgroundColor: '#fafafa' }}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="admin-input w-[160px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] admin-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="btn-elegant-secondary">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-600">Produto</TableHead>
              <TableHead className="font-semibold text-gray-600">Categoria</TableHead>
              <TableHead className="font-semibold text-gray-600">Preço</TableHead>
              <TableHead className="font-semibold text-gray-600">Estoque</TableHead>
              <TableHead className="font-semibold text-gray-600">Imagens</TableHead>
              <TableHead className="font-semibold text-gray-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-600">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Package className="h-10 w-10" />
                    <p>Nenhum produto encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <div className="relative">
                          <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                          {product.images.length > 1 && (
                            <Badge className="absolute -bottom-1 -right-1 h-5 text-[10px] bg-[#003566] text-white">+{product.images.length - 1}</Badge>
                          )}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-[#00A8E8]">{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">{getCategoryName(product.categoryId)}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Badge className={product.stock > 10 ? "admin-badge-success" : product.stock > 0 ? "admin-badge-warning" : "admin-badge-danger"}>
                      {product.stock} un.
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Images className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.images?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={product.isActive ? "admin-badge-success" : "admin-badge-secondary"}>
                      {product.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setPreviewProduct(product)} className="text-gray-400 hover:text-[#003566]">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="text-gray-400 hover:text-[#00A8E8]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto dialog-elegant">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription className="text-gray-500">{editingProduct ? "Altere as informações do produto" : "Preencha as informações para criar um novo produto"}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium block">Nome do Produto *</Label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Caixa de Bombons Premium" className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all" />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 font-medium block">Descrição</Label>
                  <AIDescriptionGenerator productName={formData.name} category={getCategoryName(formData.categoryId)} price={formData.price} tags={formData.tags} currentDescription={formData.description} onGenerate={(desc) => setFormData({ ...formData, description: desc })} />
                </div>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 min-h-[100px] focus:border-[#003566]" placeholder="Descreva o produto..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Preço (R$) *</Label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all" />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Estoque *</Label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all" />
                  {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium block">Categoria *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566]"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 font-medium block">Imagens do Produto</Label>
                <ImageUploadManager images={formData.images} onChange={handleImagesChange} maxImages={6} label="" />
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 font-medium block">Tags (separadas por vírgula)</Label>
                <input type="text" value={formData.tags.join(", ")} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="ex: chocolate, presente, premium" className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded border-gray-300" />
                  <Label htmlFor="isActive" className="text-gray-600">Produto ativo e visível na loja</Label>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="btn-elegant-secondary" disabled={isSaving}>Cancelar</Button>
              <Button type="submit" className="btn-elegant" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : editingProduct ? "Salvar Alterações" : "Criar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewProduct} onOpenChange={() => setPreviewProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto dialog-elegant">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Visualizar Produto</DialogTitle>
          </DialogHeader>
          {previewProduct && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="aspect-square rounded-xl bg-gray-100 border overflow-hidden">
                  <img src={previewProduct.images?.[0] || "/images/products/chocolates.jpg"} alt={previewProduct.name} className="w-full h-full object-cover" />
                </div>
                {previewProduct.images && previewProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {previewProduct.images.map((img, idx) => (
                      <div key={idx} className="h-16 w-16 rounded-lg bg-gray-100 border overflow-hidden flex-shrink-0">
                        <img src={img} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Badge className="mb-2 admin-badge-secondary">{getCategoryName(previewProduct.categoryId)}</Badge>
                  <h2 className="text-xl font-bold text-gray-900">{previewProduct.name}</h2>
                  {previewProduct.sku && <p className="text-sm text-gray-500">SKU: {previewProduct.sku}</p>}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">{formatPrice(previewProduct.price)}</span>
                </div>
                <div className="flex gap-2">
                  <Badge className={previewProduct.stock > 10 ? "admin-badge-success" : previewProduct.stock > 0 ? "admin-badge-warning" : "admin-badge-danger"}>
                    {previewProduct.stock > 0 ? `${previewProduct.stock} em estoque` : "Fora de estoque"}
                  </Badge>
                  <Badge className={previewProduct.isActive ? "admin-badge-success" : "admin-badge-secondary"}>{previewProduct.isActive ? "Ativo" : "Inativo"}</Badge>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-600 text-sm">{previewProduct.description || "Sem descrição"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent className="dialog-elegant">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-500">Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)} className="btn-elegant-secondary">Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
