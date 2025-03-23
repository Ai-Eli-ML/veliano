"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { completeOrder } from "@/app/actions/payment"

export const metadata = {
  title: "Order Confirmed - Veliano Jewelry",
  description: "Your order has been confirmed and is being processed",
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const finalizeOrder = async () => {
      if (!sessionId) {
        setError("Missing session information")
        setLoading(false)
        return
      }

      try {
        // Complete the order
        const result = await completeOrder(sessionId)
        if (result.success) {
          setOrderId(result.orderId)
        } else {
          setError("Failed to process order")
        }
      } catch (err) {
        console.error("Error finalizing order:", err)
        setError("There was an error processing your order")
      } finally {
        setLoading(false)
      }
    }

    finalizeOrder()
  }, [sessionId])

  if (loading) {
    return (
      <div className="container max-w-md py-16 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold tracking-tight mb-2">Finalizing Your Order</h1>
        <p className="text-muted-foreground">
          Please wait while we process your payment and finalize your order...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md py-16 flex flex-col items-center text-center">
        <Card className="p-6 w-full">
          <div className="rounded-full bg-destructive/10 p-3 mb-4 mx-auto w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-destructive">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Order Processing Error</h1>
          <p className="text-muted-foreground mb-6">
            {error}. Please contact customer support for assistance.
          </p>
          <Button asChild className="w-full">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md py-16 flex flex-col items-center text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <CheckCircle className="h-10 w-10 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">Thank You for Your Order!</h1>
      <p className="text-muted-foreground mb-6">
        Your order has been confirmed and is being processed.
        You will receive an email confirmation shortly.
      </p>
      
      <div className="bg-muted p-4 rounded-lg mb-8 w-full">
        <div className="text-sm mb-2">Order Reference</div>
        <div className="font-medium">{orderId ? orderId.substring(0, 8).toUpperCase() : `VJ-${Math.floor(100000 + Math.random() * 900000)}`}</div>
      </div>
      
      <div className="space-y-3 w-full">
        <Button asChild className="w-full">
          <Link href="/account/orders">
            View Your Orders
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  )
}
