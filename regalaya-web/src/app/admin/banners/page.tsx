"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff, Link as LinkIcon } from "lucide-react"

interface Banner {
  id: string
  title: string
  image: string
  link: string
  isActive: boolean
  order: number
}

const mockBanners: Banner[] = [
  { id: "1", title: "Banner Principal - Natal", image: "/images/banners/christmas.jpg", link: "/collections/natal", isActive: true, order: 1 },
  { id: "2", title: "Banner Promoção", image: "/images/banners/promo.jpg", link: "/collections/promocoes", isActive: true, order: 2 },
  { id: "3", title: "Banner Dia dos Namorados", image: "/images/banners/valentine.jpg", link: "/collections/dia-dos-namorados", isActive: false, order: 3 },
]

export default function BannersPage() {
  const [banners] = useState<Banner[]>(mockBanners)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBanners = banners.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeBanners = banners.filter(b => b.isActive).length

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os banners da loja</p>
        </div>
        <Button className="btn-elegant gap-2">
          <Plus className="h-4 w-4" />
          Novo Banner
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Banners</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{banners.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Banners Ativos</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{activeBanners}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Inativos</span>
            <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <EyeOff className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-600">{banners.length - activeBanners}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-5">
          <input
            type="text"
            placeholder="Buscar banners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none"
          />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ordem</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Banner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Link</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">#{banner.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-800">{banner.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#00A8E8]">{banner.link}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {banner.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#003566]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}