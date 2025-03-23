import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCartItems } from "@/app/actions/cart"
import { CartContent } from "@/components/cart/cart-content"
import { CartEmpty } from "@/components/cart/cart-empty"
import { CartSummary } from "@/components/cart/cart-summary"

export const metadata: Metadata = {
  title: "Shopping Cart | Veliano Jewelry",
  description: "Review and manage the items in your cart before proceeding to checkout",
}

export default async function CartPage() {
  const cartItems = await getCartItems()
  
  if (cartItems.length === 0) {
    return <CartEmpty />
  }
  
  return (
    <div className="container px-4 py-8 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartContent items={cartItems} />
        </div>
        <div>
          <CartSummary items={cartItems} />
        </div>
      </div>
    </div>
  )
}






// Fixed: Removed 2 unused imports
