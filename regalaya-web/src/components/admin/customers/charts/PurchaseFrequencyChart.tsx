"use client"

import { BaseChart, CHART_COLORS } from "./BaseChart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartDataPoint {
  label: string
  value: number
  count: number
}

interface PurchaseFrequencyChartProps {
  data: ChartDataPoint[]
}

export default function PurchaseFrequencyChart({ data }: PurchaseFrequencyChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-blue-600 font-bold">{payload[0].value} pedidos</p>
        </div>
      )
    }
    return null
  }

  return (
    <BaseChart
      title="Frequência de Compras"
      description="Número de pedidos por mês"
    >
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="count"
          name="Pedidos"
          fill={CHART_COLORS[1]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </BaseChart>
  )
}