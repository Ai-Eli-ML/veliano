"use client"

import type React from "react"

import { useEffect } from "react"
import { useWishlist } from "@/hooks/use-wishlist"

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Hydrate the wishlist from localStorage on the client side
  useEffect(() => {
    useWishlist.persist.rehydrate()
  }, [])

  return <>{children}</>
}

