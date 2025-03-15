import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

export type CartItem = {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  quantity: number
  image: string
  options?: Record<string, string>
}

type CartStore = {
  items: CartItem[]
  cartId: string
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isItemInCart: (productId: string, variantId?: string) => boolean
  getItem: (productId: string, variantId?: string) => CartItem | undefined
  totalItems: () => number
  subtotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: uuidv4(),

      addItem: (item) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId,
        )

        if (existingItemIndex !== -1) {
          // Update quantity if item already exists
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += item.quantity
          set({ items: updatedItems })
        } else {
          // Add new item
          set({ items: [...items, { ...item, id: uuidv4() }] })
        }
      },

      removeItem: (id) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        const { items } = get()
        const updatedItems = items.map((item) => (item.id === id ? { ...item, quantity } : item))
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [], cartId: uuidv4() })
      },

      isItemInCart: (productId, variantId) => {
        const { items } = get()
        return items.some((item) => item.productId === productId && item.variantId === variantId)
      },

      getItem: (productId, variantId) => {
        const { items } = get()
        return items.find((item) => item.productId === productId && item.variantId === variantId)
      },

      totalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      subtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    },
  ),
)

