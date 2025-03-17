"use client"

import { CartItem } from "@/types/cart"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CheckoutSummaryProps {
  items: CartItem[]
}

export function CheckoutSummary({ items }: CheckoutSummaryProps) {
  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  
  // Calculate tax (assume 8.5%)
  const taxRate = 0.085
  const tax = subtotal * taxRate
  
  // Calculate shipping (free over $100)
  const shippingThreshold = 10000 // $100.00
  const standardShipping = 995 // $9.95
  const shipping = subtotal >= shippingThreshold ? 0 : standardShipping
  
  // Calculate total
  const total = subtotal + tax + shipping

  return (
    <div className="rounded-lg border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Order Summary</h3>
        <p className="text-sm text-gray-500">{items.length} items in your cart</p>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                {item.options?.map((option, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {option.name}: {option.value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p>Subtotal</p>
          <p>{formatPrice(subtotal)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Shipping</p>
          <p>{shipping === 0 ? "Free" : formatPrice(shipping)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Tax (8.5%)</p>
          <p>{formatPrice(tax)}</p>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-medium">
        <p>Total</p>
        <p>{formatPrice(total)}</p>
      </div>
    </div>
  )
}

