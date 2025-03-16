"use client"

import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function CheckoutSummaryContent() {
  const { items, totalItems, subtotal } = useCart()

  // Calculate shipping (free over $100)
  const total = subtotal()
  const shippingCost = total >= 100 ? 0 : 10

  // Estimate tax (for display purposes)
  const estimatedTax = total * 0.08

  // Calculate total
  const finalTotal = total + shippingCost + estimatedTax

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
              <Image
                src={item.image || "/placeholder.svg?height=64&width=64"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity} × {formatCurrency(item.price)}
              </p>
            </div>
            <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({totalItems()} items)</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Estimated Tax (8%)</span>
          <span className="font-medium">{formatCurrency(estimatedTax)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{formatCurrency(finalTotal)}</span>
      </div>

      {total < 100 && (
        <p className="text-sm text-muted-foreground text-center">
          Add {formatCurrency(100 - total)} more to qualify for free shipping
        </p>
      )}
    </div>
  )
}

export function CheckoutSummary() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-16 w-16 animate-pulse bg-muted rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse bg-muted rounded" />
                <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
              </div>
              <div className="h-4 w-16 animate-pulse bg-muted rounded" />
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-4 w-16 animate-pulse bg-muted rounded" />
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex justify-between">
          <div className="h-5 w-16 animate-pulse bg-muted rounded" />
          <div className="h-5 w-24 animate-pulse bg-muted rounded" />
        </div>
      </div>
    }>
      <CheckoutSummaryContent />
    </Suspense>
  )
}

