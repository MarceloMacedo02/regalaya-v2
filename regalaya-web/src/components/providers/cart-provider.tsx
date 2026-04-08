"use client"

import { ReactNode } from "react"
import { CartProvider } from "@/hooks/useCart"

export function CartProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
