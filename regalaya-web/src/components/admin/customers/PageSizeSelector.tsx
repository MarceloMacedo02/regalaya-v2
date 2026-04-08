'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PageSizeSelectorProps {
  value: number
  onChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200]

/**
 * Seletor de quantidade de itens por página.
 * Opções: 25, 50, 100, 200.
 */
export function PageSizeSelector({ value, onChange }: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Linhas por página:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger className="w-20 h-9 text-sm" aria-label="Selecionar quantidade de linhas por página">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
