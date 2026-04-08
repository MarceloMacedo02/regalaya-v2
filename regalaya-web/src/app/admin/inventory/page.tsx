"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Search } from "lucide-react"

const mockInventory = [
  { id: "1", name: "Caixa de Bombons Premium", sku: "CB-001", stock: 45, minStock: 10, price: 89.90 },
  { id: "2", name: "Trufa de Chocolate", sku: "TR-002", stock: 8, minStock: 15, price: 12.90 },
  { id: "3", name: "Barra de Chocolate 100g", sku: "BC-003", stock: 120, minStock: 20, price: 15.90 },
  { id: "4", name: "Cesta de Páscoa Média", sku: "CP-004", stock: 5, minStock: 10, price: 159.90 },
]

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredItems = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProducts = mockInventory.length
  const lowStock = mockInventory.filter(i => i.stock <= i.minStock).length
  const totalValue = mockInventory.reduce((acc, i) => acc + (i.stock * i.price), 0)
  const healthyStock = totalProducts - lowStock

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">Controle completo de produtos e alertas</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Produtos</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estoque Baixo</span>
            <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">{lowStock}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Valor Total</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">R$ {totalValue.toLocaleString()}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Saudáveis</span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{healthyStock}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-5">
          <input
            type="text"
            placeholder="Buscar produtos..."
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estoque</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mín.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valor Unit.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.sku}</td>
                  <td className="px-4 py-3 font-semibold">{item.stock}</td>
                  <td className="px-4 py-3 text-gray-500">{item.minStock}</td>
                  <td className="px-4 py-3 text-green-600">R$ {item.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.stock > item.minStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.stock > item.minStock ? 'OK' : 'Baixo'}
                    </span>
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