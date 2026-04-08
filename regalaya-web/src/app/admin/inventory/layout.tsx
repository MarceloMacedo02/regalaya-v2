"use client"

import { InventoryProvider } from "@/contexts/inventory-context"

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <InventoryProvider>{children}</InventoryProvider>
}
