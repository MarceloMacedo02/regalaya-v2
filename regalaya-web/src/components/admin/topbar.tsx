"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, User, Settings, LogOut, ChevronRight, Home, ExternalLink } from "lucide-react"

const breadcrumbMap: Record<string, string> = {
  admin: "Admin", dashboard: "Dashboard", products: "Produtos", orders: "Pedidos",
  customers: "Clientes", categories: "Categorias", banners: "Banners", settings: "Configurações",
}

export function AdminTopbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => { logout(); router.push("/login") }

  const generateBreadcrumbs = () => {
    if (!pathname) return []
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = []
    let currentPath = ""
    for (const segment of segments) {
      currentPath += `/${segment}`
      breadcrumbs.push({ label: breadcrumbMap[segment] || segment, href: currentPath, isLast: currentPath === pathname })
    }
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  const notificationCount = 3

  return (
    <header className="flex h-14 items-center justify-between topbar-elegant px-6">
      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/admin" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((crumb) => (
            <div key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-gray-300" />
              {crumb.isLast ? (
                <span className="font-semibold text-gray-700">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="px-1.5 py-0.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              className="w-56 bg-gray-50 border-gray-200 rounded-lg pl-9 text-sm focus:border-[#003566] focus:ring-0"
            />
          </div>
        </div>

        <Link href="/">
          <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-[#003566] hover:text-white hover:border-[#003566] transition-all">
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Ver Loja
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#003566] text-[10px] text-white font-bold">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-white border-gray-100 rounded-xl shadow-lg">
            <DropdownMenuLabel className="text-gray-800 font-semibold">Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-gray-700 text-sm">Novo pedido #1234</span>
                <span className="text-xs text-gray-400">Há 5 minutos</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-gray-700 text-sm">Produto sem estoque</span>
                <span className="text-xs text-gray-400">Há 1 hora</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem className="justify-center text-sm text-[#003566] cursor-pointer font-semibold rounded-lg py-2">
              Ver todas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:bg-gray-100">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-gradient-to-br from-[#003566] to-[#00A8E8] text-white text-sm font-semibold">AD</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium text-sm">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-100 rounded-xl shadow-lg">
            <DropdownMenuLabel className="text-gray-800 font-semibold">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem className="cursor-pointer text-gray-600 font-medium rounded-lg py-2">
              <User className="mr-2 h-4 w-4" />Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-gray-600 font-medium rounded-lg py-2">
              <Settings className="mr-2 h-4 w-4" />Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 font-medium rounded-lg py-2">
              <LogOut className="mr-2 h-4 w-4" />Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}