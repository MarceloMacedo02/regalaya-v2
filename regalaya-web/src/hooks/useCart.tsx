"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { CART_STORAGE_KEY } from "@/lib/constants"
import { cartService, type Cart, type CartItem } from "@/services/cart.service"
import { getAuthToken } from "@/lib/api"

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  cart: Cart | null
  itemCount: number
  subtotal: number
  couponCode: string | null
  couponDiscount: number
  giftMessage: string | null
  senderName: string | null
  recipientName: string | null
  giftContext: string | null
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addItem: (item: { productId: string; name: string; price: number; quantity: number; image?: string }) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  updateGiftMessage: (message: string) => Promise<void>
  updateGiftInfo: (message: string | null, sender?: string | null, recipient?: string | null, context?: string | null) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function localCartToItems(local: { productId: string; name: string; price: number; quantity: number; image?: string }[]): CartItem[] {
  return local.map((item, idx) => ({
    productId: item.productId,
    productName: item.name,
    productImage: item.image || "",
    unitPrice: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken())
  }, [])

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    try {
      const data = await cartService.getCart()
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const syncLocalToApi = async (localItems: CartItem[]) => {
    if (!isAuthenticated) return

    try {
      await cartService.clearCart()
      for (const item of localItems) {
        await cartService.addToCart({ productId: item.productId, quantity: item.quantity })
      }
      await refreshCart()
    } catch {
      // Keep local if API fails
    }
  }

  const addItem = async (item: { productId: string; name: string; price: number; quantity: number; image?: string; giftMessage?: string }) => {
    if (isAuthenticated) {
      try {
        const updated = await cartService.addToCart({ productId: item.productId, quantity: item.quantity, giftMessage: item.giftMessage })
        setCart(updated)
        return
      } catch {
        // fall through to local
      }
    }

    // Local fallback
    setCart(prev => {
      const items: CartItem[] = prev?.items || []
      const existing = items.find(i => i.productId === item.productId)
      let newItems: CartItem[]
      if (existing) {
        newItems = items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: i.unitPrice * (i.quantity + item.quantity) }
            : i
        )
      } else {
        newItems = [...items, {
          productId: item.productId,
          productName: item.name,
          productImage: item.image || "",
          unitPrice: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          giftMessage: item.giftMessage
        }]
      }
      const subtotal = newItems.reduce((sum, i) => sum + i.subtotal, 0)
      const totalQuantity = newItems.reduce((sum, i) => sum + i.quantity, 0)
      const newCart: Cart = {
        userId: prev?.userId || "",
        items: newItems,
        itemCount: newItems.length,
        totalQuantity,
        subtotal,
        shipping: prev?.shipping || 0,
        discount: prev?.discount || 0,
        total: subtotal - (prev?.discount || 0),
        couponCode: prev?.couponCode || null,
        couponDiscount: prev?.couponDiscount || 0,
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart.items.map(i => ({
        productId: i.productId, name: i.productName, price: i.unitPrice, quantity: i.quantity, image: i.productImage
      }))))
      return newCart
    })
  }

  const removeItem = async (productId: string) => {
    if (isAuthenticated) {
      try {
        const updated = await cartService.removeItem(productId)
        setCart(updated)
        return
      } catch {}
    }

    setCart(prev => {
      if (!prev) return prev
      const newItems = prev.items.filter(i => i.productId !== productId)
      const subtotal = newItems.reduce((sum, i) => sum + i.subtotal, 0)
      const totalQuantity = newItems.reduce((sum, i) => sum + i.quantity, 0)
      const newCart: Cart = {
        ...prev, items: newItems, itemCount: newItems.length,
        totalQuantity, subtotal, total: subtotal - prev.couponDiscount,
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems.map(i => ({
        productId: i.productId, name: i.productName, price: i.unitPrice, quantity: i.quantity, image: i.productImage
      }))))
      return newCart
    })
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    if (isAuthenticated) {
      try {
        const updated = await cartService.updateItem(productId, { quantity })
        setCart(updated)
        return
      } catch {}
    }

    setCart(prev => {
      if (!prev) return prev
      const newItems = prev.items.map(i =>
        i.productId === productId
          ? { ...i, quantity, subtotal: i.unitPrice * quantity }
          : i
      )
      const subtotal = newItems.reduce((sum, i) => sum + i.subtotal, 0)
      const totalQuantity = newItems.reduce((sum, i) => sum + i.quantity, 0)
      const newCart: Cart = {
        ...prev, items: newItems, totalQuantity, subtotal,
        total: subtotal - prev.couponDiscount,
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems.map(i => ({
        productId: i.productId, name: i.productName, price: i.unitPrice, quantity: i.quantity, image: i.productImage
      }))))
      return newCart
    })
  }

  const updateGiftMessage = async (giftMessage: string | null) => {
    await updateGiftInfo(giftMessage, cart?.senderName, cart?.recipientName, cart?.giftContext)
  }

  const updateGiftInfo = async (giftMessage: string | null, senderName?: string | null, recipientName?: string | null, giftContext?: string | null) => {
    if (isAuthenticated) {
      try {
        const updated = await cartService.updateGiftMessage(giftMessage, senderName, recipientName, giftContext)
        setCart(updated)
        return
      } catch {}
    }

    setCart(prev => {
      if (!prev) return prev
      return { ...prev, giftMessage, senderName: senderName || null, recipientName: recipientName || null, giftContext: giftContext || null }
    })
  }

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart()
        setCart({ userId: cart?.userId || "", items: [], itemCount: 0, totalQuantity: 0, subtotal: 0, shipping: 0, discount: 0, total: 0, couponCode: null, couponDiscount: 0, giftMessage: null, senderName: null, recipientName: null, giftContext: null })
        return
      } catch {}
    }
    localStorage.removeItem(CART_STORAGE_KEY)
    setCart(prev => prev ? { ...prev, items: [], itemCount: 0, totalQuantity: 0, subtotal: 0, discount: 0, total: 0, couponCode: null, couponDiscount: 0 } : null)
  }

  const applyCoupon = async (code: string) => {
    if (!isAuthenticated) return
    try {
      const updated = await cartService.applyCoupon(code)
      setCart(updated)
    } catch (err) {
      throw err
    }
  }

  const removeCoupon = async () => {
    if (!isAuthenticated) return
    try {
      const updated = await cartService.removeCoupon()
      setCart(updated)
    } catch {}
  }

  const items = cart?.items || []
  const itemCount = cart?.totalQuantity || 0
  const subtotal = cart?.subtotal || 0
  const couponCode = cart?.couponCode || null
  const couponDiscount = cart?.couponDiscount || 0
  const giftMessage = cart?.giftMessage || null
  const senderName = cart?.senderName || null
  const recipientName = cart?.recipientName || null
  const giftContext = cart?.giftContext || null

  return (
    <CartContext.Provider value={{
      items, isLoading, cart, itemCount, subtotal, couponCode, couponDiscount, giftMessage, senderName, recipientName, giftContext,
      isCartOpen, setIsCartOpen,
      addItem, removeItem, updateQuantity, updateGiftMessage, updateGiftInfo, clearCart, applyCoupon, removeCoupon, refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
