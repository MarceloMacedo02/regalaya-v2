"use client"

import { createContext, useContext, ReactNode } from "react"
import { useWishlist } from "@/hooks/useWishlist"

interface WishlistProduct {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  images: string[]
  category?: string | { name?: string }
  tags?: string[]
  sku?: string
  stock: number
  isActive: boolean
  [key: string]: unknown
}

interface WishlistContextType {
  wishlist: WishlistProduct[]
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: WishlistProduct) => void
  clearWishlist: () => void
  moveToCart: (productId: string) => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlistHook = useWishlist()

  return (
    <WishlistContext.Provider value={wishlistHook}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlistContext() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlistContext must be used within a WishlistProvider")
  }
  return context
}
