"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ecommerceEvent } from "@/lib/analytics"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category?: string
  variant?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart", [])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addItem = (item: CartItem) => {
    setItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((i: CartItem) => i.id === item.id)

      if (existingItem) {
        // Track add to cart event
        ecommerceEvent.addToCart(item, item.quantity)

        return prevItems.map((i: CartItem) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      }

      // Track add to cart event
      ecommerceEvent.addToCart(item, item.quantity)

      return [...prevItems, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems: CartItem[]) => {
      const itemToRemove = prevItems.find((i: CartItem) => i.id === id)

      if (itemToRemove) {
        // Track remove from cart event
        ecommerceEvent.removeFromCart(itemToRemove, itemToRemove.quantity)
      }

      return prevItems.filter((i: CartItem) => i.id !== id)
    })
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((i: CartItem) => i.id === id)

      if (existingItem) {
        if (quantity <= 0) {
          // Track remove from cart event
          ecommerceEvent.removeFromCart(existingItem, existingItem.quantity)

          return prevItems.filter((i: CartItem) => i.id !== id)
        }

        const quantityDiff = quantity - existingItem.quantity
        if (quantityDiff > 0) {
          // Track add to cart event for increased quantity
          ecommerceEvent.addToCart(existingItem, quantityDiff)
        } else if (quantityDiff < 0) {
          // Track remove from cart event for decreased quantity
          ecommerceEvent.removeFromCart(existingItem, -quantityDiff)
        }

        return prevItems.map((i: CartItem) => (i.id === id ? { ...i, quantity } : i))
      }

      return prevItems
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const subtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Only expose the context if mounted (to avoid hydration issues)
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
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

