"use client"

import { cn } from "@/lib/utils"
import { User, ShoppingBag, TrendingUp } from "lucide-react"

type TabType = "summary" | "orders" | "metrics"

interface CustomerTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  {
    id: "summary" as TabType,
    label: "Resumo",
    icon: User
  },
  {
    id: "orders" as TabType,
    label: "Pedidos",
    icon: ShoppingBag
  },
  {
    id: "metrics" as TabType,
    label: "Métricas",
    icon: TrendingUp
  }
]

export default function CustomerTabs({ activeTab, onTabChange }: CustomerTabsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-1">
      <nav className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all",
                isActive
                  ? "bg-[#003566] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
