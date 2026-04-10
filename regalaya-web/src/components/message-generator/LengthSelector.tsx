"use client"

import { cn } from "@/lib/utils"

interface LengthSelectorProps {
  value: "curto" | "medio" | "longo"
  onChange: (length: "curto" | "medio" | "longo") => void
}

const LENGTH_OPTIONS = [
  { value: "curto" as const, label: "Curto", description: "50-100 palavras" },
  { value: "medio" as const, label: "Médio", description: "100-200 palavras" },
  { value: "longo" as const, label: "Longo", description: "200-400 palavras" },
]

export function LengthSelector({ value, onChange }: LengthSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">Comprimento da mensagem</label>
      <div className="flex gap-2">
        {LENGTH_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg border text-sm transition-all",
              value === option.value
                ? "border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#8B5CF6] font-medium"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            )}
          >
            <div>{option.label}</div>
            <div className="text-xs text-slate-400">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
