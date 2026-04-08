"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PeriodFilterProps {
  onPeriodChange: (period: string) => void
  currentPeriod: string
}

export function PeriodFilter({ onPeriodChange, currentPeriod }: PeriodFilterProps) {
  const [customRange, setCustomRange] = useState({
    start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  })

  const handlePresetChange = (value: string) => {
    const today = new Date()
    let startDate = new Date()

    switch (value) {
      case "today":
        startDate = today
        break
      case "week":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "quarter":
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1)
        break
      case "custom":
        onPeriodChange("custom")
        return
      default:
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    setCustomRange({
      start: format(startDate, "yyyy-MM-dd"),
      end: format(today, "yyyy-MM-dd"),
    })
    onPeriodChange(value)
  }

  const handleCustomRangeApply = () => {
    onPeriodChange(`custom:${customRange.start}:${customRange.end}`)
  }

  const selectValue = currentPeriod.startsWith("custom:") ? "custom" : currentPeriod

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Periodo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectValue} onValueChange={handlePresetChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Ultimos 7 dias</SelectItem>
            <SelectItem value="month">Ultimos 30 dias</SelectItem>
            <SelectItem value="quarter">Ultimos 90 dias</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        {selectValue === "custom" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Data inicio
                </label>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Data fim
                </label>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <Button size="sm" onClick={handleCustomRangeApply} className="w-full">
              Aplicar
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {selectValue !== "custom" && (
            <p>
              {selectValue === "today" && "Dados de hoje"}
              {selectValue === "week" && "Ultimos 7 dias"}
              {selectValue === "month" && "Ultimos 30 dias"}
              {selectValue === "quarter" && "Ultimos 90 dias"}
              {selectValue === "year" && "Este ano calendario"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
