
import { redirect, notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CreditCard, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Json } from "@/types/supabase"

interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface DatabaseOrder {
  id: string
  user_id: string | null
  status: string
  total_price: number
  subtotal_price: number
  shipping_price: number | null
  tax_price: number | null
  discount_price: number | null
  email: string
  phone: string | null
  shipping_address: Json
  billing_address: Json
  currency: string | null
  created_at: string
  updated_at: string
  order_number: string
  payment_status: string
  fulfillment_status: string
}

interface Order extends Omit<DatabaseOrder, 'shipping_address' | 'billing_address'> {
  shipping_address: ShippingAddress | null
  billing_address: ShippingAddress | null
}

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/account/login?redirect=/account/orders")
  }

  // Fetch order details
  const { data: dbOrder, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (error || !dbOrder) {
    notFound()
  }

  // Transform the order data
  const order: Order = {
    ...dbOrder,
    shipping_address: dbOrder.shipping_address as ShippingAddress | null,
    billing_address: dbOrder.billing_address as ShippingAddress | null
  }

  // Fetch order items
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)

  if (itemsError) {
    console.error("Error fetching order items:", itemsError)
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <p className="text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <div className="mb-2 rounded-full bg-primary/10 p-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>

                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <div className="mb-2 rounded-full bg-primary/10 p-2">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "processing" ? "In progress" : "Completed"}
                    </p>
                  </div>

                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <div className="mb-2 rounded-full bg-primary/10 p-2">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Shipping</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.fulfillment_status === "fulfilled" ? "Shipped" : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Estimated Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.fulfillment_status === "fulfilled"
                          ? "Your order is on its way"
                          : "Your order is being processed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems && orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.total_price)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal_price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{!order.shipping_price || order.shipping_price === 0 ? "Free" : formatCurrency(order.shipping_price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax_price || 0)}</span>
                  </div>
                  {order.discount_price && order.discount_price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount_price)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_price)}</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{order.payment_status === "paid" ? "Paid" : "Payment pending"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.shipping_address ? (
                  <div>
                    <h4 className="mb-2 font-medium">Shipping Address</h4>
                    <address className="not-italic text-sm text-muted-foreground">
                      {order.shipping_address.name}
                      <br />
                      {order.shipping_address.line1}
                      {order.shipping_address.line2 && (
                        <>
                          <br />
                          {order.shipping_address.line2}
                        </>
                      )}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                      <br />
                      {order.shipping_address.country}
                    </address>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No shipping information available.</p>
                )}

                <div>
                  <h4 className="mb-2 font-medium">Contact Information</h4>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                  {order.phone && <p className="text-sm text-muted-foreground">{order.phone}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you have any questions or concerns about your order, please contact our customer support team.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

