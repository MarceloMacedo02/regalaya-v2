'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, Filter, Calendar, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CustomerFilters as CustomerFiltersType } from '@/services/customers.service'

const LOCAL_STORAGE_FILTERS_KEY = 'regalaya_customers_filters'

interface CustomerFiltersProps {
  filters: CustomerFiltersType
  onApplyFilters: (filters: CustomerFiltersType) => void
  onClearFilters: () => void
  resultCount?: number
}

/**
 * Componente de filtros avançados para a tabela de clientes.
 * Inclui busca com debounce, filtros de status, data e número de pedidos.
 * Persiste filtros no localStorage.
 */
export function CustomerFilters({
  filters,
  onApplyFilters,
  onClearFilters,
  resultCount,
}: CustomerFiltersProps) {
  const [search, setSearch] = useState(filters.search || '')
  const [status, setStatus] = useState<CustomerFiltersType['status']>(filters.status || 'TODOS')
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || '')
  const [dateTo, setDateTo] = useState(filters.dateTo || '')
  const [minOrders, setMinOrders] = useState(filters.minOrders?.toString() || '')
  const [maxOrders, setMaxOrders] = useState(filters.maxOrders?.toString() || '')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Ref para debounce timer
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Ref para filtros atuais (evita stale closures)
  const filtersRef = useRef<CustomerFiltersType>({
    search: filters.search,
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    minOrders: filters.minOrders,
    maxOrders: filters.maxOrders,
  })
  filtersRef.current = {
    search,
    status: status !== 'TODOS' ? status : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    minOrders: minOrders ? parseInt(minOrders, 10) : undefined,
    maxOrders: maxOrders ? parseInt(maxOrders, 10) : undefined,
  }

  // Cleanup do timer na desmontagem
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [])

  // Carrega filtros do localStorage na montagem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_FILTERS_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as CustomerFiltersType
          if (parsed.search) setSearch(parsed.search)
          if (parsed.status) setStatus(parsed.status)
          if (parsed.dateFrom) setDateFrom(parsed.dateFrom)
          if (parsed.dateTo) setDateTo(parsed.dateTo)
          if (parsed.minOrders !== undefined) setMinOrders(parsed.minOrders.toString())
          if (parsed.maxOrders !== undefined) setMaxOrders(parsed.maxOrders.toString())
        }
      } catch {
        // Ignora erros de parse
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Aplica filtros internamente com persistência
   */
  const applyFiltersInternal = useCallback((newFilters: CustomerFiltersType) => {
    // Persiste no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_FILTERS_KEY, JSON.stringify(newFilters))
    }
    onApplyFilters(newFilters)
  }, [onApplyFilters])

  /**
   * Handler de busca com debounce de 300ms
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)

    // Limpa timer anterior
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    // Agenda nova busca
    searchTimerRef.current = setTimeout(() => {
      const currentFilters = filtersRef.current
      applyFiltersInternal({
        ...currentFilters,
        search: value || undefined,
      })
    }, 300)
  }

  const handleStatusChange = (value: string) => {
    const newStatus = value as CustomerFiltersType['status']
    setStatus(newStatus)
    applyFiltersInternal({
      ...filtersRef.current,
      status: newStatus !== 'TODOS' ? newStatus : undefined,
    })
  }

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateFrom(value)
    applyFiltersInternal({
      ...filtersRef.current,
      dateFrom: value || undefined,
    })
  }

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateTo(value)
    applyFiltersInternal({
      ...filtersRef.current,
      dateTo: value || undefined,
    })
  }

  const handleMinOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinOrders(value)
    const numValue = value ? parseInt(value, 10) : undefined
    applyFiltersInternal({
      ...filtersRef.current,
      minOrders: numValue,
    })
  }

  const handleMaxOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxOrders(value)
    const numValue = value ? parseInt(value, 10) : undefined
    applyFiltersInternal({
      ...filtersRef.current,
      maxOrders: numValue,
    })
  }

  const handleClearAll = () => {
    setSearch('')
    setStatus('TODOS')
    setDateFrom('')
    setDateTo('')
    setMinOrders('')
    setMaxOrders('')
    setShowAdvanced(false)

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_FILTERS_KEY)
    }
    onClearFilters()
  }

  // Verifica se há filtros ativos (exceto busca)
  const hasActiveFilters = status !== 'TODOS' || dateFrom || dateTo || minOrders || maxOrders
  const hasAnyFilter = search || hasActiveFilters

  return (
    <div className="admin-card">
      <div className="p-5">
        {/* Busca principal */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="relative flex-1">
            <label htmlFor="customer-search" className="sr-only">Buscar clientes</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="customer-search"
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="Buscar clientes por nome, email ou telefone"
            />
          </div>

          <div className="w-full md:w-48">
            <label htmlFor="customer-status" className="sr-only">Filtrar por status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="customer-status" aria-label="Filtrar por status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="ATIVO">Ativos</SelectItem>
                <SelectItem value="INATIVO">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="adminGhost"
            size="adminSm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
            aria-expanded={showAdvanced}
            aria-label={showAdvanced ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-[#003566]" />
            )}
          </Button>

          {hasAnyFilter && (
            <Button
              variant="adminGhost"
              size="adminSm"
              onClick={handleClearAll}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Limpar todos os filtros"
            >
              <X className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Filtros avançados */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Data de cadastro - De */}
              <div>
                <label htmlFor="date-from" className="block text-xs font-medium text-gray-500 mb-1.5">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Cadastro a partir de
                </label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  aria-label="Filtrar por data de cadastro inicial"
                />
              </div>

              {/* Data de cadastro - Até */}
              <div>
                <label htmlFor="date-to" className="block text-xs font-medium text-gray-500 mb-1.5">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Cadastro até
                </label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={handleDateToChange}
                  aria-label="Filtrar por data de cadastro final"
                />
              </div>

              {/* Mínimo de pedidos */}
              <div>
                <label htmlFor="min-orders" className="block text-xs font-medium text-gray-500 mb-1.5">
                  <Hash className="h-3 w-3 inline mr-1" />
                  Mín. pedidos
                </label>
                <Input
                  id="min-orders"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minOrders}
                  onChange={handleMinOrdersChange}
                  aria-label="Filtrar por número mínimo de pedidos"
                />
              </div>

              {/* Máximo de pedidos */}
              <div>
                <label htmlFor="max-orders" className="block text-xs font-medium text-gray-500 mb-1.5">
                  <Hash className="h-3 w-3 inline mr-1" />
                  Máx. pedidos
                </label>
                <Input
                  id="max-orders"
                  type="number"
                  min="0"
                  placeholder="∞"
                  value={maxOrders}
                  onChange={handleMaxOrdersChange}
                  aria-label="Filtrar por número máximo de pedidos"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        {resultCount !== undefined && (
          <p className="text-sm text-gray-500 mt-3" role="status" aria-live="polite">
            {resultCount === 0
              ? 'Nenhum cliente encontrado com os filtros aplicados'
              : `${resultCount} cliente(s) encontrado(s)`}
          </p>
        )}
      </div>
    </div>
  )
}
