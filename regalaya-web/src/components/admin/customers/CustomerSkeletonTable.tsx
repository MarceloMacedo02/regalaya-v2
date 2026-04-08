'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CustomerSkeletonTableProps {
  rows?: number
}

/**
 * Skeleton de carregamento para a tabela de clientes.
 * Exibe linhas com placeholders animados simulando a estrutura da tabela real.
 */
export function CustomerSkeletonTable({ rows = 10 }: CustomerSkeletonTableProps) {
  return (
    <div className="admin-card">
      <div className="p-5">
        {/* Skeleton dos filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
          <div className="flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-48">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-40">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>

        {/* Skeleton da tabela */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="hidden sm:table-cell"><Skeleton className="h-4 w-14" /></TableHead>
              <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="hidden xl:table-cell"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="w-20"><Skeleton className="h-4 w-12" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="w-8">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-6 w-14 rounded-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-10" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="w-20">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Skeleton da paginação */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
