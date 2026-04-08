"use client"

import { useState, useEffect, useCallback } from "react"

interface WishlistProduct {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  images: string[]
  category?: string | { name?: string }
  tags: string[]
  sku?: string
  stock: number
  isActive: boolean
  [key: string]: unknown
}

interface UseWishlistResult {
  wishlist: WishlistProduct[]
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: WishlistProduct) => void
  clearWishlist: () => void
  moveToCart: (productId: string) => void
  wishlistCount: number
}

const STORAGE_KEY = "regalaya-wishlist"

export function useWishlist(): UseWishlistResult {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setWishlist(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
      } catch (error) {
        console.error("Error saving wishlist:", error)
      }
    }
  }, [wishlist, isLoaded])

  const addToWishlist = useCallback((product: WishlistProduct) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId))
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist]
  )

  const toggleWishlist = useCallback(
    (product: WishlistProduct) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist(product)
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  )

  const clearWishlist = useCallback(() => {
    setWishlist([])
  }, [])

  const moveToCart = useCallback((productId: string) => {
    removeFromWishlist(productId)
  }, [removeFromWishlist])

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    moveToCart,
    wishlistCount: wishlist.length,
  }
}
