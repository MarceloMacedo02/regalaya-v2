"use client"

import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BaseChartProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function BaseChart({ title, description, children, className }: BaseChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Cores padrão para gráficos
export const CHART_COLORS = [
  "#003566", // Azul marinho (primário)
  "#22C55E", // Verde
  "#F59E0B", // Amber
  "#EF4444", // Vermelho
  "#8B5CF6", // Roxo
  "#EC4899", // Rosa
  "#06B6D4", // Cyan
  "#F97316", // Laranja
]