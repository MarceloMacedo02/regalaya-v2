'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Configuração de uma coluna na tabela
 */
export interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  order: number
}

const LOCAL_STORAGE_COLUMNS_KEY = 'regalaya_customers_columns'

interface UseColumnPreferencesReturn {
  columns: ColumnConfig[]
  toggleColumn: (key: string) => void
  reorderColumns: (fromIndex: number, toIndex: number) => void
  resetColumns: () => void
  visibleColumns: string[]
}

/**
 * Configuração padrão das colunas
 */
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Nome', visible: true, order: 0 },
  { key: 'email', label: 'Email', visible: true, order: 1 },
  { key: 'phone', label: 'Telefone', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'orderCount', label: 'Pedidos', visible: true, order: 4 },
  { key: 'totalSpent', label: 'Total Gasto', visible: true, order: 5 },
  { key: 'registrationDate', label: 'Cadastro', visible: true, order: 6 },
  { key: 'actions', label: 'Ações', visible: true, order: 7 },
]

/**
 * Hook para gerenciar preferências de colunas da tabela.
 * Persiste configurações no localStorage por usuário.
 */
export function useColumnPreferences(): UseColumnPreferencesReturn {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_COLUMNS_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as ColumnConfig[]
          // Garante que todas as colunas padrão existam
          return mergeWithDefaults(parsed)
        }
      } catch {
        // Ignora erros de parse
      }
    }
    return DEFAULT_COLUMNS
  })

  // Persiste mudanças no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_COLUMNS_KEY, JSON.stringify(columns))
    }
  }, [columns])

  /**
   * Alterna visibilidade de uma coluna
   */
  const toggleColumn = useCallback((key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    )
  }, [])

  /**
   * Reordena colunas (move de uma posição para outra)
   */
  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    setColumns(prev => {
      const result = [...prev]
      const [moved] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, moved)
      // Atualiza orders
      return result.map((col, idx) => ({ ...col, order: idx }))
    })
  }, [])

  /**
   * Reseta colunas para configuração padrão
   */
  const resetColumns = useCallback(() => {
    setColumns(DEFAULT_COLUMNS)
  }, [])

  /**
   * Lista de chaves de colunas visíveis, ordenadas
   */
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order)
    .map(col => col.key)

  return {
    columns,
    toggleColumn,
    reorderColumns,
    resetColumns,
    visibleColumns,
  }
}

/**
 * Garante que colunas armazenadas tenham todas as colunas padrão
 */
function mergeWithDefaults(stored: ColumnConfig[]): ColumnConfig[] {
  const storedKeys = new Set(stored.map(c => c.key))

  // Adiciona colunas padrão que não existem no stored
  const merged = [...stored]
  DEFAULT_COLUMNS.forEach(defaultCol => {
    if (!storedKeys.has(defaultCol.key)) {
      merged.push({ ...defaultCol })
    }
  })

  // Garante que todas as colunas tenham order
  return merged
    .sort((a, b) => a.order - b.order)
    .map((col, idx) => ({ ...col, order: col.order ?? idx }))
}
