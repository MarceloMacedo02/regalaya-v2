"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortOption {
  value: string
  label: string
}

const SORT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "Relevância" },
  { value: "price-asc", label: "Menor Preço" },
  { value: "price-desc", label: "Maior Preço" },
  { value: "newest", label: "Mais Recentes" },
]

interface SortSelectProps {
  value: string
  onChange: (sort: string) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const handleValueChange = (newValue: string) => {
    onChange(newValue)
  }

  return (
    <div className="w-48">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Ordenar por">
            {SORT_OPTIONS.find(option => option.value === value)?.label || "Ordenar por"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
