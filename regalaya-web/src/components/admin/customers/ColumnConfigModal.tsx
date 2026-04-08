'use client'

import { useState } from 'react'
import { GripVertical, Eye, EyeOff, RotateCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import type { ColumnConfig } from '@/hooks/useColumnPreferences'

interface ColumnConfigModalProps {
  columns: ColumnConfig[]
  onToggleColumn: (key: string) => void
  onResetColumns: () => void
}

/**
 * Modal para configurar visibilidade e ordem das colunas da tabela.
 * Permite mostrar/esconder colunas via checkboxes e resetar para padrão.
 */
export function ColumnConfigModal({
  columns,
  onToggleColumn,
  onResetColumns,
}: ColumnConfigModalProps) {
  const [open, setOpen] = useState(false)

  // Ordena colunas por order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="adminSecondary"
          size="adminSm"
          className="gap-2"
          aria-label="Configurar colunas da tabela"
        >
          <GripVertical className="h-4 w-4" />
          Colunas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Colunas</DialogTitle>
          <DialogDescription>
            Selecione quais colunas deseja exibir na tabela de clientes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 max-h-80 overflow-y-auto pr-2">
          {sortedColumns.map((column) => (
            <div
              key={column.key}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-gray-300 cursor-grab" aria-hidden="true">
                <GripVertical className="h-4 w-4" />
              </div>
              <Checkbox
                id={`column-${column.key}`}
                checked={column.visible}
                onCheckedChange={() => onToggleColumn(column.key)}
                aria-label={`Mostrar coluna ${column.label}`}
              />
              <label
                htmlFor={`column-${column.key}`}
                className="text-sm text-gray-700 cursor-pointer flex items-center gap-2 flex-1"
              >
                {column.visible ? (
                  <Eye className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-300" />
                )}
                {column.label}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="adminGhost"
            size="adminSm"
            onClick={onResetColumns}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar padrão
          </Button>
          <Button
            variant="adminPrimary"
            size="adminSm"
            onClick={() => setOpen(false)}
          >
            Concluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
