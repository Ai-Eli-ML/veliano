"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export function CartSummary() {
  const { items, totalItems, subtotal } = useCart()

  // Calculate shipping (free over $100)
  const shippingCost = subtotal() >= 100 ? 0 : 10

  // Estimate tax (for display purposes)
  const estimatedTax = subtotal() * 0.07

  // Calculate total
  const total = subtotal() + shippingCost + estimatedTax

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({totalItems()} items)</span>
          <span className="font-medium">{formatCurrency(subtotal())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="font-medium">{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Estimated Tax</span>
          <span className="font-medium">{formatCurrency(estimatedTax)}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Button asChild className="w-full metallic-button" disabled={items.length === 0}>
        <Link href="/checkout" className="flex items-center justify-center gap-2">
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Secure checkout powered by Stripe</p>
        <p className="mt-1">Free shipping on orders over $100</p>
      </div>
    </div>
  )
}

