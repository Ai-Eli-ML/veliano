"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

function CartSummaryContent() {
  const { subtotal, totalItems } = useCart()
  const total = subtotal()
  const hasShipping = total < 100
  const shipping = hasShipping ? 10 : 0
  const tax = total * 0.08 // 8% tax rate
  const finalTotal = total + shipping + tax
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="font-medium">
            {hasShipping ? formatCurrency(shipping) : "Free"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      <Button asChild className="w-full metallic-button">
        <Link href="/checkout">Proceed to Checkout ({totalItems()} items)</Link>
      </Button>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Secure checkout powered by Stripe</p>
        <p className="mt-1">
          {hasShipping ? (
            <>Add ${formatCurrency(100 - total)} more for free shipping</>
          ) : (
            "Free shipping applied"
          )}
        </p>
      </div>
    </div>
  )
}

export function CartSummary() {
  return (
    <Suspense fallback={
      <div className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-5 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="h-10 w-full bg-muted rounded" />
      </div>
    }>
      <CartSummaryContent />
    </Suspense>
  )
}

