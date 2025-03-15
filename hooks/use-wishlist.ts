"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type WishlistItem = {
  id: string
  productId: string
  name: string
  price: number
  image: string
  slug: string
  category: string
}

type WishlistStore = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isItemInWishlist: (productId: string) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.productId === item.productId)

        if (!existingItem) {
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId) => {
        const { items } = get()
        set({ items: items.filter((item) => item.productId !== productId) })
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      isItemInWishlist: (productId) => {
        const { items } = get()
        return items.some((item) => item.productId === productId)
      },
    }),
    {
      name: "wishlist-storage",
      skipHydration: true,
    },
  ),
)

