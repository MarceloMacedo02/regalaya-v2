'use client'

import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Mail,
  Phone,
  AlertCircle,
} from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AdminCustomer } from '@/services/customers.service'
import type { PageResponse } from '@/types/api'
import { formatPrice, formatDate, formatPhone } from '@/lib/utils'
import { PageSizeSelector } from './PageSizeSelector'

interface CustomerTableProps {
  data: PageResponse<AdminCustomer>
  visibleColumns: string[]
  page: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
  onViewCustomer?: (customer: AdminCustomer) => void
}

/**
 * Tabela dinâmica de clientes com colunas customizáveis e paginação.
 * Responsiva: oculta colunas menos importantes em telas menores.
 */
export function CustomerTable({
  data,
  visibleColumns,
  page,
  size,
  onPageChange,
  onSizeChange,
  onViewCustomer,
}: CustomerTableProps) {
  const { content: customers, totalElements, totalPages, first, last } = data

  // Calcula páginas visíveis para paginação numérica
  const visiblePages = useMemo(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(0, page - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible)
    start = Math.max(0, end - maxVisible)

    for (let i = start; i < end; i++) {
      pages.push(i)
    }
    return pages
  }, [page, totalPages])

  // Estado vazio
  if (customers.length === 0) {
    return (
      <div className="admin-card">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Nenhum cliente encontrado
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Não encontramos clientes com os filtros aplicados. Tente ajustar os critérios de busca.
          </p>
        </div>
      </div>
    )
  }

  // Helpers de visibilidade por breakpoint
  const isColumnVisible = (key: string, breakpoint?: string): boolean => {
    if (!visibleColumns.includes(key)) return false
    if (!breakpoint) return true
    // A visibilidade por breakpoint é tratada via CSS classes
    return true
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="p-5">
        <Table role="table" aria-label="Tabela de clientes">
          <TableHeader>
            <TableRow>
              {visibleColumns.includes('name') && (
                <TableHead className="min-w-[200px]">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    Nome
                  </span>
                </TableHead>
              )}
              {visibleColumns.includes('email') && (
                <TableHead className="hidden md:table-cell min-w-[200px]">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    Email
                  </span>
                </TableHead>
              )}
              {visibleColumns.includes('phone') && (
                <TableHead className="hidden lg:table-cell min-w-[140px]">
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    Telefone
                  </span>
                </TableHead>
              )}
              {visibleColumns.includes('status') && (
                <TableHead className="min-w-[100px]">Status</TableHead>
              )}
              {visibleColumns.includes('orderCount') && (
                <TableHead className="hidden sm:table-cell text-right min-w-[80px]">
                  Pedidos
                </TableHead>
              )}
              {visibleColumns.includes('totalSpent') && (
                <TableHead className="hidden md:table-cell text-right min-w-[120px]">
                  Total Gasto
                </TableHead>
              )}
              {visibleColumns.includes('registrationDate') && (
                <TableHead className="hidden lg:table-cell min-w-[120px]">
                  Cadastro
                </TableHead>
              )}
              {visibleColumns.includes('actions') && (
                <TableHead className="w-20 text-right">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} role="row">
                {visibleColumns.includes('name') && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#003566]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#003566] font-semibold text-sm">
                          {customer.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-gray-800 block truncate">
                          {customer.name || 'Sem nome'}
                        </span>
                        <span className="text-xs text-gray-400 md:hidden block truncate">
                          {customer.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes('email') && (
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-gray-600 truncate block max-w-[200px]" title={customer.email}>
                      {customer.email || '-'}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('phone') && (
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-gray-600">
                      {customer.phone ? formatPhone(customer.phone) : '-'}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('status') && (
                  <TableCell>
                    <Badge
                      variant={customer.status === 'ATIVO' ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {customer.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes('orderCount') && (
                  <TableCell className="hidden sm:table-cell text-right">
                    <span className="font-medium text-gray-800">
                      {customer.orderCount}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('totalSpent') && (
                  <TableCell className="hidden md:table-cell text-right">
                    <span className="font-semibold text-green-600">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('registrationDate') && (
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-gray-500">
                      {formatDate(customer.registrationDate)}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('actions') && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-[#003566] hover:bg-[#003566]/5"
                        onClick={() => onViewCustomer?.(customer)}
                        aria-label={`Ver detalhes de ${customer.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginação */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
          {/* Info de total */}
          <div className="text-sm text-gray-500" role="status" aria-live="polite">
            Mostrando{' '}
            <span className="font-medium text-gray-700">
              {totalElements === 0 ? 0 : page * size + 1}
            </span>
            {' '}a{' '}
            <span className="font-medium text-gray-700">
              {Math.min((page + 1) * size, totalElements)}
            </span>
            {' '}de{' '}
            <span className="font-medium text-gray-700">{totalElements}</span>
            {' '}cliente(s)
          </div>

          {/* Controles de paginação */}
          <div className="flex items-center gap-2">
            <PageSizeSelector value={size} onChange={onSizeChange} />

            <div className="flex items-center gap-1 ml-4" role="navigation" aria-label="Paginação">
              {/* Primeira página */}
              <Button
                variant="adminGhost"
                size="adminSm"
                disabled={first || totalPages === 0}
                onClick={() => onPageChange(0)}
                aria-label="Ir para a primeira página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Página anterior */}
              <Button
                variant="adminGhost"
                size="adminSm"
                disabled={first || totalPages === 0}
                onClick={() => onPageChange(page - 1)}
                aria-label="Ir para a página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Números de página */}
              {visiblePages.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'adminPrimary' : 'adminGhost'}
                  size="adminSm"
                  onClick={() => onPageChange(p)}
                  className="min-w-[36px] h-8 px-2"
                  aria-label={`Ir para página ${p + 1}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p + 1}
                </Button>
              ))}

              {/* Próxima página */}
              <Button
                variant="adminGhost"
                size="adminSm"
                disabled={last || totalPages === 0}
                onClick={() => onPageChange(page + 1)}
                aria-label="Ir para a próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Última página */}
              <Button
                variant="adminGhost"
                size="adminSm"
                disabled={last || totalPages === 0}
                onClick={() => onPageChange(totalPages - 1)}
                aria-label="Ir para a última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
