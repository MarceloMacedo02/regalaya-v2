'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { PageResponse } from '@/types/api'
import type { AdminCustomer, CustomerFilters, CustomerStats } from '@/services/customers.service'
import { customersService } from '@/services/customers.service'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

const LOCAL_STORAGE_PAGE_SIZE_KEY = 'regalaya_customers_page_size'

interface UseCustomerPaginationReturn {
  data: PageResponse<AdminCustomer> | null
  stats: CustomerStats | null
  isLoading: boolean
  isLoadingStats: boolean
  page: number
  size: number
  filters: CustomerFilters
  setPage: (page: number) => void
  setSize: (size: number) => void
  setFilters: (filters: CustomerFilters) => void
  refresh: () => void
}

/**
 * Hook para gerenciar paginação, filtros e carregamento de clientes admin.
 * Persiste o page size no localStorage.
 */
export function useCustomerPagination(): UseCustomerPaginationReturn {
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const [data, setData] = useState<PageResponse<AdminCustomer> | null>(null)
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_PAGE_SIZE_KEY)
      return stored ? parseInt(stored, 10) : 25
    }
    return 25
  })
  const [filters, setFilters] = useState<CustomerFilters>({})

  // Ref para evitar race conditions
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  // Persiste page size no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PAGE_SIZE_KEY, size.toString())
    }
  }, [size])

  // Busca stats (independente da paginação)
  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true)
      const statsData = await customersService.getStats()
      setStats(statsData)
    } catch (error) {
      handleError(error, 'CustomerStats')
    } finally {
      setIsLoadingStats(false)
    }
  }, [handleError])

  // Busca clientes paginado
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await customersService.getAll({
        page,
        size,
        filters: filtersRef.current,
      })
      setData(result)
    } catch (error) {
      handleError(error, 'CustomerPagination')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [page, size, handleError])

  // Recarrega quando page, size ou filters mudam
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Carrega stats uma vez
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Reset para página 0 quando filters mudam
  const setFiltersAndReset = useCallback((newFilters: CustomerFilters) => {
    setFilters(newFilters)
    setPage(0)
  }, [])

  const setSizeAndReset = useCallback((newSize: number) => {
    setSize(newSize)
    setPage(0)
  }, [])

  return {
    data,
    stats,
    isLoading,
    isLoadingStats,
    page,
    size,
    filters,
    setPage,
    setSize: setSizeAndReset,
    setFilters: setFiltersAndReset,
    refresh: fetchCustomers,
  }
}
