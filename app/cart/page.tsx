
import type { Metadata } from "next"
import Link from "next/link"
import { CartContent } from "@/components/cart/cart-content"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"

  title: "Shopping Cart",
  description: "View and manage items in your shopping cart",
}

export default function CartPage() {
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartContent />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSummary() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-medium">$0.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="font-medium">Calculated at checkout</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span className="font-medium">Calculated at checkout</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>$0.00</span>
        </div>
      </div>

      <Button asChild className="w-full metallic-button">
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Secure checkout powered by Stripe</p>
        <p className="mt-1">Free shipping on orders over $100</p>
      </div>
    </div>
  )
}

