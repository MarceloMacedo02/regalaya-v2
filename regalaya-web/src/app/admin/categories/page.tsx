"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Package, Image as ImageIcon, Loader2 } from "lucide-react"
import { productsService } from "@/services/products.service"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types/category"

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<{ name: string; slug: string; description?: string; imageUrl?: string; parentId?: string }>({ name: "", slug: "", description: "", imageUrl: "" })

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const data = await productsService.findCategories()
        setCategoryList(data)
      } catch {
        toast({ title: "Erro ao carregar categorias", description: "Não foi possível carregar as categorias.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [toast])

  const filteredCategories = categoryList.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) return
    setIsSaving(true)
    try {
      await productsService.createCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        imageUrl: formData.imageUrl,
        parentId: formData.parentId,
      })
      const data = await productsService.findCategories()
      setCategoryList(data)
      setIsCreateOpen(false)
      setFormData({ name: "", slug: "", description: "", imageUrl: "" })
      toast({ title: "Categoria criada", description: "A categoria foi criada com sucesso." })
    } catch {
      toast({ title: "Erro ao criar", description: "Não foi possível criar a categoria.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedCategory || !formData.name) return
    setIsSaving(true)
    try {
      await productsService.updateCategory(selectedCategory.id, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        imageUrl: formData.imageUrl,
        parentId: formData.parentId,
      })
      const data = await productsService.findCategories()
      setCategoryList(data)
      setIsEditOpen(false)
      setSelectedCategory(null)
      toast({ title: "Categoria atualizada", description: "A categoria foi atualizada com sucesso." })
    } catch {
      toast({ title: "Erro ao atualizar", description: "Não foi possível atualizar a categoria.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    setIsSaving(true)
    try {
      await productsService.deleteCategory(selectedCategory.id)
      setCategoryList(categoryList.filter(c => c.id !== selectedCategory.id))
      setIsDeleteOpen(false)
      setSelectedCategory(null)
      toast({ title: "Categoria excluída", description: "A categoria foi removida com sucesso." })
    } catch (error: any) {
      toast({ title: "Erro ao excluir", description: error.message || "Não foi possível excluir a categoria.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const totalProducts = categoryList.reduce((acc, c) => acc + ((c as any).productCount || 0), 0)
  const activeCategories = categoryList.filter(c => (c as any).productCount > 0).length

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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Categorias</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as categorias de produtos da loja</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="btn-elegant gap-2">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Categorias</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{categoryList.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Produtos Total</span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold">#</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categorias Ativas</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Média/Categoria</span>
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <span className="text-purple-600 font-bold">Ø</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeCategories > 0 ? Math.round(totalProducts / activeCategories) : 0}</div>
        </div>
      </div>

      {/* Search */}
      <div className="admin-card">
        <div className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-4 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Produtos</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    <Package className="h-10 w-10 mx-auto mb-2" />
                    <p>Nenhuma categoria encontrada</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          {(category as any).imageUrl ? (
                            <img src={(category as any).imageUrl} alt={category.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 block">{category.name}</span>
                          {category.description && <span className="text-sm text-gray-400">{category.description}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#00A8E8]">{category.slug}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {(category as any).productCount || 0} produtos
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${(category as any).productCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {(category as any).productCount > 0 ? 'Ativa' : 'Vazia'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(category); setFormData({ name: category.name, slug: category.slug, description: category.description, imageUrl: (category as any).imageUrl, parentId: category.parentId }); setIsEditOpen(true) }} className="text-gray-400 hover:text-[#003566]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(category); setIsDeleteOpen(true) }} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Categoria</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none" placeholder="Nome da categoria" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none" placeholder="slug-da-categoria" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none min-h-[80px]" placeholder="Descrição opcional" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="btn-elegant-secondary" disabled={isSaving}>Cancelar</Button>
              <Button onClick={handleCreate} className="btn-elegant" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Criando...</> : "Criar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Editar Categoria</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none min-h-[80px]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setIsEditOpen(false); setSelectedCategory(null) }} className="btn-elegant-secondary" disabled={isSaving}>Cancelar</Button>
              <Button onClick={handleEdit} className="btn-elegant" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmar Exclusão</h2>
            <p className="text-gray-500 mb-6">Tem certeza que deseja excluir a categoria "{selectedCategory.name}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setSelectedCategory(null) }} className="btn-elegant-secondary" disabled={isSaving}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Excluindo...</> : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
