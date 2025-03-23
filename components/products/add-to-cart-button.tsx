"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import type { Product, ProductWithRelations } from "@/types/product"

interface AddToCartButtonProps {
  productId: string
  name: string
  price: number
  image: string
  variantId?: string
  size?: "default" | "sm" | "lg" | "icon"
  options?: Record<string, string>
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  variantId,
  size = "default",
  options
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()

  const handleClick = async () => {
    try {
      setIsLoading(true)
      
      const cartItem = {
        productId,
        name,
        price,
        quantity: 1,
        image,
        variantId,
        options
      }
      
      await addItem(cartItem)
      
      toast.success("Added to cart")
    } catch (error) {
      toast.error("Failed to add to cart")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      className="w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Adding..." : "Add to cart"}
    </Button>
  )
} 