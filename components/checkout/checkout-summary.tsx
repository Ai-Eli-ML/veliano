"use client"

import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export function CheckoutSummary() {
  const { items, totalItems, subtotal } = useCart()

  // Calculate shipping (free over $100)
  const shippingCost = subtotal() >= 100 ? 0 : 10

  // Estimate tax (for display purposes)
  const estimatedTax = subtotal() * 0.07

  // Calculate total
  const total = subtotal() + shippingCost + estimatedTax

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

      <Separator />

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

