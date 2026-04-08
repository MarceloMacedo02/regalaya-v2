"use client"

import { BaseChart, CHART_COLORS } from "./BaseChart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, ResponsiveContainer } from "recharts"
import { formatPrice } from "@/lib/utils"

interface ChartDataPoint {
  label: string
  value: number
  count: number
}

interface LTVEvolutionChartProps {
  data: ChartDataPoint[]
}

export default function LTVEvolutionChart({ data }: LTVEvolutionChartProps) {
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-green-600 font-bold">{formatPrice(payload[0].value)}</p>
          <p className="text-xs text-gray-500">{payload[0].payload.count} pedidos</p>
        </div>
      )
    }
    return null
  }

  return (
    <BaseChart
      title="Evolução do LTV"
      description="Valor acumulado mês a mês"
    >
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorLtv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tickFormatter={(value) => `R$ ${value/1000}k`}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="value"
          name="LTV Acumulado"
          stroke={CHART_COLORS[0]}
          fillOpacity={1}
          fill="url(#colorLtv)"
          strokeWidth={2}
        />
      </AreaChart>
    </BaseChart>
  )
}