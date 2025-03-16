
import { createClient } from "@/lib/supabase/client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Loader2, Package, Truck, AlertCircle } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useCart } from "@/hooks/use-cart"
import { ecommerceEvent } from "@/lib/analytics"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  total_price: number
  subtotal_price: number
  shipping_price: number
  tax_price: number
  items: OrderItem[]
  status: string
  fulfillment_status: string
  payment_status: string
  shipping_address: {
    name: string
    address: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

function OrderStatus({ status, className = "" }: { status: string; className?: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "fulfilled":
        return "text-green-600 dark:text-green-400"
      case "processing":
        return "text-blue-600 dark:text-blue-400"
      case "pending":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-muted-foreground"
    }
  }

  return <span className={`font-medium ${getStatusColor(status)} ${className}`}>{status}</span>
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<Order | null>(null)
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

        if (!data) {
          throw new Error("Order not found")
        }

        setOrder(data as Order)

        // Track purchase event
        ecommerceEvent.purchase({
          id: data.order_number,
          value: data.total_price,
          tax: data.tax_price,
          shipping: data.shipping_price,
          items: data.items.map((item: OrderItem) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: "Product",
            variant: "Default",
          })),
        })

        // Clear the cart
        clearCart()
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch order details")
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
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || "Order not found"}</AlertDescription>
            </Alert>
            <CardTitle className="text-center text-2xl">Unable to Load Order</CardTitle>
            <CardDescription className="text-center">
              We couldn't find your order details. Please contact customer support if this persists.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
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
            Thank you for your purchase. Your order #{order.order_number} has been received.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Status */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border p-4 text-center">
              <div className="mb-2 rounded-full bg-primary/10 p-2">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Order Placed</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg border p-4 text-center">
              <div className="mb-2 rounded-full bg-primary/10 p-2">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Status</h3>
              <OrderStatus status={order.status} className="text-sm" />
            </div>

            <div className="flex flex-col items-center rounded-lg border p-4 text-center">
              <div className="mb-2 rounded-full bg-primary/10 p-2">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Shipping</h3>
              <OrderStatus status={order.fulfillment_status} className="text-sm" />
            </div>
          </div>

          {/* Order Details */}
          <div className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                  </div>
                  <div>{formatCurrency(item.price)}</div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal_price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shipping_price === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(order.shipping_price)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.tax_price)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="mb-2 font-medium">Shipping Address</h3>
            <div className="rounded-lg border p-4">
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly at your registered email address.
              We will notify you when your order ships with tracking information.
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

