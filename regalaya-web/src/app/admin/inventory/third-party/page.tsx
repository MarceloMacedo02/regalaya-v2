"use client"

import { ThirdPartyList } from "@/components/admin/inventory/third-party-list"
import { suppliers } from "@/lib/mock-inventory-data"
import { useInventory } from "@/contexts/inventory-context"
import type { Supplier } from "@/types/inventory"

export default function InventoryThirdPartyPage() {
  const { items } = useInventory()

  const handleAddSupplier = () => {
    console.log("Adicionar fornecedor")
    // Implementar lógica de adição
  }

  const handleEditSupplier = (supplier: Supplier) => {
    console.log("Editar fornecedor:", supplier)
    // Implementar lógica de edição
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores e Parceiros</h1>
          <p className="text-muted-foreground">
            Gerencie fornecedores, parceiros e produtos de terceiros
          </p>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      <ThirdPartyList
        suppliers={suppliers}
        onAddSupplier={handleAddSupplier}
        onEditSupplier={handleEditSupplier}
      />

      {/* Informações Adicionais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Benefícios de Produtos de Terceiros */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Vantagens de Produtos de Terceiros</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Menor investimento em estoque próprio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Maior variedade de produtos no catálogo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Comissão sobre vendas sem custo de armazenagem</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Parceria estratégica com fornecedores especializados</span>
            </li>
          </ul>
        </div>

        {/* Métricas de Terceiros */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Métricas de Terceiros</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fornecedores Ativos</span>
              <span className="font-semibold">{suppliers.filter(s => s.status === 'active').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Produtos de Terceiros</span>
              <span className="font-semibold">
                {items.filter(i => i.thirdParty).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prazo Médio de Entrega</span>
              <span className="font-semibold">
                {(suppliers.reduce((acc, s) => acc + s.averageDeliveryDays, 0) / suppliers.length).toFixed(1)} dias
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avaliação Média</span>
              <span className="font-semibold">
                {(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)} ★
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
