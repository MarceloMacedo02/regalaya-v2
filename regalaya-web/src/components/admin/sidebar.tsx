"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"
import { X } from "lucide-react"
import {
  LayoutDashboard, Package, PackageCheck, ShoppingCart, Users,
  Tag, Image, Settings, ChevronDown, LogOut, Shield, BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Estoque", href: "/admin/inventory", icon: PackageCheck, badge: 3,
    submenu: [
      { label: "Visão Geral", href: "/admin/inventory" },
      { label: "Produtos", href: "/admin/inventory/products" },
      { label: "Fornecedores", href: "/admin/inventory/third-party" },
      { label: "Alertas", href: "/admin/inventory/alerts" },
      { label: "Movimentações", href: "/admin/inventory/movements" },
      { label: "Relatórios", href: "/admin/inventory/reports" },
    ]
  },
  { label: "Produtos", href: "/admin/products", icon: Package },
  { label: "Pedidos", href: "/admin/orders", icon: ShoppingCart, badge: 5 },
  { label: "Clientes", href: "/admin/customers", icon: Users },
  { label: "Categorias", href: "/admin/categories", icon: Tag },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Usuários", href: "/admin/users", icon: Shield },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleMenu = (href: string) => {
    setExpandedMenu(expandedMenu === href ? null : href)
  }

  return (
    <aside className="flex flex-col h-full sidebar-elegant" style={{ width: '250px' }}>
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#003566] to-[#00A8E8] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold tracking-wide">{APP_NAME}</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="lg:hidden ml-auto text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const hasSubmenu = !!item.submenu
          const isSubmenuExpanded = expandedMenu === item.href

          return (
            <div key={item.href}>
              <button
                onClick={() => hasSubmenu ? toggleMenu(item.href) : (window.location.href = item.href)}
                className={cn(
                  "sidebar-item flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                  isActive && !hasSubmenu
                    ? "active"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && !hasSubmenu ? "text-white" : "text-gray-500")} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="h-5 min-w-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#00A8E8] to-[#003566] text-[10px] text-white font-bold">
                    {item.badge}
                  </span>
                )}
                {hasSubmenu && (
                  <ChevronDown className={cn("h-4 w-4 text-gray-500", isSubmenuExpanded && "rotate-180")} />
                )}
              </button>

              {hasSubmenu && isSubmenuExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700 pl-3">
                  {item.submenu?.map((subItem) => {
                    const isSubActive = pathname === subItem.href
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isSubActive
                            ? "text-[#00A8E8] bg-gray-800"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  )
}