"use client"

import { useState } from "react"
import "@/app/admin/admin.css"
import { APP_NAME } from "@/lib/constants"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Menu, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-[100dvh] overflow-hidden admin-layout-wrapper">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={cn(
        "fixed lg:relative z-50 h-full transition-transform duration-200 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 content-elegant">
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="!p-2 text-gray-600">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#003566] to-[#00A8E8] flex items-center justify-center shadow">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-gray-800">{APP_NAME}</span>
          </div>
          <Button variant="ghost" size="icon" className="!p-2 text-gray-600">
            <ExternalLink className="h-5 w-5" />
          </Button>
        </div>
        
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 content-elegant">
          {children}
        </main>
      </div>
    </div>
  )
}