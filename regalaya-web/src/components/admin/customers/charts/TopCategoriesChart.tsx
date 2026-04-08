"use client"

import { BaseChart, CHART_COLORS } from "./BaseChart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { formatPrice } from "@/lib/utils"

interface ChartDataPoint {
  label: string
  value: number
  count: number
}

interface TopCategoriesChartProps {
  data: ChartDataPoint[]
}

export default function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-purple-600 font-bold">{formatPrice(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  // Limitar a 10 categorias (já deve vir limitado do backend)
  const topData = data.slice(0, 10)

  return (
    <BaseChart
      title="Top Categorias Compradas"
      description="Valor total gasto por categoria"
    >
      <BarChart
        data={topData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value) => `R$ ${value/1000}k`}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="value"
          name="Valor Total"
          fill={CHART_COLORS[2]}
          radius={[0, 4, 4, 0]}
        >
          {topData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </BaseChart>
  )
}