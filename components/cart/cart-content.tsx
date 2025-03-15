"use client"

import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/components/cart/cart-item"
import { CartEmpty } from "@/components/cart/cart-empty"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CartContent() {
  const { items, totalItems, subtotal } = useCart()

  if (items.length === 0) {
    return <CartEmpty />
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <Separator />

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Button variant="outline" asChild>
          <Link href="/products" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Subtotal ({totalItems()} items)</span>
            <span className="text-lg font-bold">${subtotal().toFixed(2)}</span>
          </div>
          <Button asChild className="mt-2 w-full metallic-button">
            <Link href="/checkout" className="flex items-center gap-2">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

