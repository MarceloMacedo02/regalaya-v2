"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { usePathname } from "next/navigation"

interface AdminThemeContextType {
  isAdmin: boolean
  isDashboard: boolean
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  isAdmin: false,
  isDashboard: false,
})

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isAdmin = pathname?.startsWith("/admin") || false
  const isDashboard = pathname === "/admin/dashboard"

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AdminThemeContext.Provider value={{ isAdmin, isDashboard }}>
      <div className={isAdmin ? "admin-theme" : ""}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}