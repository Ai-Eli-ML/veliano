"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useCart } from "@/hooks/use-cart"
import { ecommerceEvent } from "@/lib/analytics"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError("No session ID provided")
        setLoading(false)
        return
      }

      try {
        const supabase = createClientSupabaseClient()

        // Get order details from Supabase
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            items:order_items(*)
          `)
          .eq("stripe_checkout_session_id", sessionId)
          .single()

        if (error) {
          throw error
        }

        setOrder(data)

        // Track purchase event
        if (data) {
          ecommerceEvent.purchase({
            id: data.order_number,
            value: data.total_price,
            tax: data.tax_price,
            shipping: data.shipping_price,
            items: data.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              category: "Product",
              variant: "Default",
            })),
          })
        }

        // Clear the cart
        clearCart()
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-10">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-4 text-lg">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-10">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Order Not Found</CardTitle>
            <CardDescription className="text-center">
              We couldn't find your order details. Please contact customer support.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your purchase. Your order has been received and is being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                  </div>
                  <div>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax_price.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 font-bold">
                <span>Total</span>
                <span>${order.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly. We will notify you when your order ships.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="outline" className="w-full">
            <Link href="/account/orders">View Order History</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/products">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

