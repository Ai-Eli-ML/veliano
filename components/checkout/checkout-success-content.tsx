"use client"

import { Button } from "@/components/ui/button"
import { PageHeading } from "@/components/ui/page-heading"
import { useCart } from "@/hooks/use-cart"
import { CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutSuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams?.get("orderId")
  
  useEffect(() => {
    // Clear the cart upon successful order
    clearCart()
  }, [clearCart])

  return (
    <div className="mx-auto max-w-2xl text-center">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
      
      <PageHeading
        title="Order Successful!"
        description={orderId ? `Order #${orderId} has been placed` : "Your order has been placed"}
        className="mt-6"
      />
      
      <p className="mt-6 text-lg text-gray-600">
        Thank you for your purchase. We've sent you an email with the order details
        and tracking information. Your items will be shipped soon.
      </p>
      
      <div className="mt-10 flex items-center justify-center gap-x-6">
        {orderId && (
          <Button asChild>
            <Link href={"/account/orders/" + orderId}>
              View Order
            </Link>
          </Button>
        )}
        
        <Button asChild variant="outline">
          <Link href="/">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  )
} 