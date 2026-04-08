import type { Metadata } from "next"
import { APP_NAME } from "@/lib/constants"
import "./admin.css"
import { AdminLayoutClient } from "./admin-layout-client"

export const metadata: Metadata = {
  title: {
    default: `Admin | ${APP_NAME}`,
    template: `%s | Admin | ${APP_NAME}`,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout-wrapper">
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </div>
  )
}
