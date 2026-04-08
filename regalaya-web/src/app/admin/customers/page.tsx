'use client'

import { useCallback } from 'react'
import { Download, Users, TrendingUp, DollarSign, ShoppingBag, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/utils'
import { useCustomerPagination } from '@/hooks/useCustomerPagination'
import { useColumnPreferences } from '@/hooks/useColumnPreferences'
import { CustomerFilters } from '@/components/admin/customers/CustomerFilters'
import { CustomerTable } from '@/components/admin/customers/CustomerTable'
import { ColumnConfigModal } from '@/components/admin/customers/ColumnConfigModal'
import { CustomerSkeletonTable } from '@/components/admin/customers/CustomerSkeletonTable'
import type { AdminCustomer, CustomerFilters as CustomerFiltersType } from '@/services/customers.service'

/**
 * Página de Gestão de Clientes Admin.
 *
 * Funcionalidades:
 * - Stats cards com métricas resumidas (Story 8.1.1)
 * - Filtros avançados com busca, status, data e pedidos (Story 8.1.2)
 * - Tabela com colunas customizáveis (Story 8.1.3)
 * - Paginação com page size configurável (Story 8.1.4)
 */
export default function AdminCustomersPage() {
  const {
    data,
    stats,
    isLoading,
    isLoadingStats,
    page,
    size,
    filters,
    setPage,
    setSize,
    setFilters,
    refresh,
  } = useCustomerPagination()

  const {
    columns,
    toggleColumn,
    resetColumns,
    visibleColumns,
  } = useColumnPreferences()

  /**
   * Handler para exportar clientes visíveis como CSV
   */
  const handleExportCSV = useCallback(() => {
    if (!data || data.content.length === 0) return

    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Status', 'Pedidos', 'Total Gasto', 'Cadastro']
    const rows = data.content.map((c: AdminCustomer) => [
      c.id,
      c.name,
      c.email,
      c.phone || '',
      c.status,
      c.orderCount.toString(),
      c.totalSpent.toFixed(2),
      c.registrationDate,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(v => `"${v}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }, [data])

  /**
   * Handler para visualizar detalhes de um cliente
   */
  const handleViewCustomer = useCallback((customer: AdminCustomer) => {
    // Placeholder para navegação para detalhes do cliente
    console.log('View customer:', customer)
    // router.push(`/admin/customers/${customer.id}`)
  }, [])

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualize e gerencie todos os clientes da loja
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          variant="adminSecondary"
          size="admin"
          className="gap-2"
          disabled={!data || data.content.length === 0}
          aria-label="Exportar clientes para CSV"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total de Clientes */}
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total de Clientes
            </span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.totalCustomers ?? 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Cadastrados na plataforma
              </div>
            </>
          )}
        </div>

        {/* Clientes Ativos */}
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Clientes Ativos
            </span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold text-green-600">
                {stats?.activeCustomers ?? 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats?.totalCustomers
                  ? `${Math.round((stats.activeCustomers / stats.totalCustomers) * 100)}% do total`
                  : 'Do total'}
              </div>
            </>
          )}
        </div>

        {/* Ticket Médio */}
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Ticket Médio
            </span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(stats?.averageTicket ?? 0)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Por cliente</div>
            </>
          )}
        </div>

        {/* Receita Total */}
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Receita Total
            </span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-green-600" />
            </div>
          </div>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(stats?.totalRevenue ?? 0)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Acumulada</div>
            </>
          )}
        </div>
      </div>

      {/* Filtros */}
      <CustomerFilters
        filters={filters}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
        resultCount={data?.totalElements}
      />

      {/* Toolbar da tabela */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ColumnConfigModal
            columns={columns}
            onToggleColumn={toggleColumn}
            onResetColumns={resetColumns}
          />
        </div>
      </div>

      {/* Tabela de Clientes */}
      {isLoading ? (
        <CustomerSkeletonTable />
      ) : data ? (
        <CustomerTable
          data={data}
          visibleColumns={visibleColumns}
          page={page}
          size={size}
          onPageChange={setPage}
          onSizeChange={setSize}
          onViewCustomer={handleViewCustomer}
        />
      ) : (
        <div className="admin-card">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Erro ao carregar clientes
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
              Não foi possível carregar a lista de clientes. Verifique sua conexão e tente novamente.
            </p>
            <Button
              variant="adminPrimary"
              size="admin"
              onClick={refresh}
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
