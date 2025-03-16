export const metadata = export const metadata = {
  title: "Order History",
  description: "View your order history and track your purchases",
}

"use client"


import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

  title: "Order History",
  description: "View your order history and track your purchases",
}

export default async function OrderHistoryPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/account/login?redirect=/account/orders")
  }

  // Fetch user's orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order History</h1>
        <Button asChild variant="outline">
          <Link href="/account">Back to Account</Link>
        </Button>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Order #{order.order_number}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
                </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <OrderStatusBadge status={order.status} />
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/account/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {order.fulfillment_status === "fulfilled" ? "Shipped" : "Processing"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.fulfillment_status === "fulfilled"
                          ? "Your order has been shipped"
                          : "Your order is being processed"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(order.total_price)}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.payment_status === "paid" ? "Paid" : "Payment pending"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-medium">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild className="metallic-button">
              <Link href="/products">Shop Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = "secondary"

  switch (status) {
    case "processing":
      variant = "secondary"
      break
    case "shipped":
      variant = "default"
      break
    case "delivered":
      variant = "default"
      break
    case "cancelled":
      variant = "destructive"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  )
}

