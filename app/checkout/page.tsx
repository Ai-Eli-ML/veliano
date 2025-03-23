"use client"

import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { PageHeading } from "@/components/ui/page-heading"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getCartItems } from "@/app/actions/cart"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart/cart-item"
import { CartEmpty } from "@/components/cart/cart-empty"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"

export const metadata = {
  title: "Checkout - Veliano Jewelry",
  description: "Complete your purchase of custom grillz and jewelry",
}

export default async function CheckoutPage() {
  const cartItems = await getCartItems()

  // If cart is empty, redirect to home
  if (!cartItems || cartItems.length === 0) {
    redirect("/")
  }

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping for now
  const tax = subtotal * 0.0825 // 8.25% tax rate (example)
  const total = subtotal + shipping + tax

  return (
    <div className="container max-w-6xl py-8 lg:py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded overflow-hidden bg-slate-100">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <CheckoutForm subtotal={subtotal} tax={tax} shipping={shipping} total={total} />
        </div>
      </div>
    </div>
  )
}
