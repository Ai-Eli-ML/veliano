import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCartItems } from "@/app/actions/cart"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CartItemType } from "@/hooks/use-cart"

export const metadata: Metadata = {
  title: "Checkout | Veliano Jewelry",
  description: "Complete your purchase of luxury jewelry and custom grillz",
}

export default async function CheckoutPage() {
  const cartItems = await getCartItems()
  
  if (cartItems.length === 0) {
    redirect("/cart")
  }
  
  // Format cart items to match CartItemType
  const formattedItems: CartItemType[] = cartItems.map(item => ({
    id: item.id,
    productId: item.product_id,
    variantId: item.variant_id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || "/images/placeholder.jpg",
    options: item.options || []
  }))
  
  // Calculate order summary values
  const subtotal = formattedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const tax = Math.round(subtotal * 0.0825) // 8.25% tax rate
  const total = subtotal + shipping + tax
  
  return (
    <div className="container px-4 py-8 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        
        <div className="grid gap-8 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <CheckoutForm 
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
          
          <div className="lg:col-span-3">
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
              
              <div className="space-y-4">
                {formattedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-gray-100">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-full w-full object-cover" 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.options.map((option, i) => (
                            <p key={i}>{option.name}: {option.value}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-medium">
                      ${(item.price * item.quantity / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${(shipping / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(tax / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
