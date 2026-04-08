"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Calendar, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { SalesData } from "@/lib/mock-data"

interface SalesChartProps {
  data: SalesData[]
  comparison?: boolean
}

export function SalesChart({ data, comparison = false }: SalesChartProps) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week")

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }))

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Vendas</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatPrice(totalRevenue)} em {data.length} dias
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("week")}
          >
            7d
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
          >
            30d
          </Button>
          <Button
            variant={period === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("year")}
          >
            12m
          </Button>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="h-[300px] w-full min-w-0 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [formatPrice(value as number), "Receita"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Total de Pedidos</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Ticket Medio</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{formatPrice(averageTicket)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
