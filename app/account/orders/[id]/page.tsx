"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

// This mock data structure will match what we expect from Supabase
// Making transition easier later
interface OrderItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
  options?: { name: string; value: string }[]
}

interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  user_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  subtotal: number
  tax: number
  shipping: number
  payment_method: string
  payment_status: "pending" | "paid" | "failed" | "refunded"
  shipping_address: Address
  billing_address: Address
  items: OrderItem[]
  created_at: string
  updated_at: string
  tracking_number?: string
  notes?: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params?.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchOrder = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   const { data, error } = await supabase
    //     .from("orders")
    //     .select("*, items:order_items(*)")
    //     .eq("id", orderId)
    //     .single()
    //   
    //   if (error) throw error
    //   return data
    // }
    
    // Simulate API call
    const fetchOrder = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock order data structured like our database model
      return {
        id: orderId,
        user_id: "user123",
        status: "shipped",
        total: 12890,
        subtotal: 11500,
        tax: 990,
        shipping: 400,
        payment_method: "credit_card",
        payment_status: "paid",
        shipping_address: {
          name: "John Doe",
          street: "123 Main St",
          city: "Boston",
          state: "MA",
          zipCode: "02108",
          country: "USA"
        },
        billing_address: {
          name: "John Doe",
          street: "123 Main St",
          city: "Boston",
          state: "MA",
          zipCode: "02108",
          country: "USA"
        },
        items: [
          {
            id: "item1",
            product_id: "prod1",
            name: "Vintage Gold Bracelet",
            price: 7500,
            quantity: 1,
            image: "/images/products/bracelet.jpg",
            options: [
              { name: "Size", value: "7 inch" },
              { name: "Color", value: "Yellow Gold" }
            ]
          },
          {
            id: "item2",
            product_id: "prod2",
            name: "Silver Pendant Necklace",
            price: 4000,
            quantity: 1,
            image: "/images/products/necklace.jpg",
            options: [
              { name: "Length", value: "18 inch" },
              { name: "Style", value: "Pendant" }
            ]
          }
        ],
        created_at: "2025-03-10T14:30:00Z",
        updated_at: "2025-03-11T09:15:00Z",
        tracking_number: "TRK9876543210",
        notes: "Please leave at front door"
      } as Order
    }
    
    fetchOrder()
      .then(data => {
        setOrder(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching order:", error)
        setIsLoading(false)
      })
  }, [orderId])
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="Order Details" description="Loading order information..." />
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-pulse">Loading order details...</div>
        </div>
      </div>
    )
  }
  
  if (!order) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="Order Not Found" description="We couldn&apos;t find the order you&apos;re looking for" />
        <div className="mt-8 text-center">
          <p className="mb-6 text-gray-600">The order may have been deleted or the ID is incorrect.</p>
          <Button asChild>
            <Link href="/account/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Orders
            </Link>
          </Button>
        </div>
      </div>
    )
  }
  
  // Helper function to render order status with icon
  const renderOrderStatus = (status: Order["status"]) => {
    const statusConfig = {
      pending: { icon: <AlertCircle className="h-5 w-5" />, label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      processing: { icon: <Package className="h-5 w-5" />, label: "Processing", color: "bg-blue-100 text-blue-800" },
      shipped: { icon: <Truck className="h-5 w-5" />, label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
      delivered: { icon: <CheckCircle className="h-5 w-5" />, label: "Delivered", color: "bg-green-100 text-green-800" },
      cancelled: { icon: <AlertCircle className="h-5 w-5" />, label: "Cancelled", color: "bg-red-100 text-red-800" },
    }
    
    const config = statusConfig[status]
    
    return (
      <Badge className={`flex items-center gap-1 px-2 py-1 ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </Badge>
    )
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link 
            href="/account/orders" 
            className="mb-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Orders
          </Link>
          <PageHeading title={`Order #${order.id}`} description={`Placed on ${formatDate(order.created_at)}`} />
        </div>
        <div className="flex items-center gap-2">
          {renderOrderStatus(order.status)}
          {order.status === "shipped" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`https://tracking.example.com/${order.tracking_number}`} target="_blank">
                Track Order
          </Link>
        </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in your order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <Link href={`/products/${item.product_id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        {item.options?.map((option, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {option.name}: {option.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Where your order was sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.shipping_address.name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Address used for billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.billing_address.name}</p>
                  <p>{order.billing_address.street}</p>
                  <p>
                    {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zipCode}
                  </p>
                  <p>{order.billing_address.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Order and payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Subtotal</p>
                    <p>{formatPrice(order.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Shipping</p>
                    <p>{formatPrice(order.shipping)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Tax</p>
                    <p>{formatPrice(order.tax)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <p>Total</p>
                  <p>{formatPrice(order.total)}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Payment Method</p>
                    <p className="capitalize">{order.payment_method.replace('_', ' ')}</p>
                </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Payment Status</p>
                    <Badge 
                      variant="outline" 
                      className={
                        order.payment_status === 'paid' ? 'text-green-600 border-green-600' : 
                        order.payment_status === 'refunded' ? 'text-yellow-600 border-yellow-600' :
                        order.payment_status === 'failed' ? 'text-red-600 border-red-600' :
                        'text-gray-600 border-gray-600'
                      }
                    >
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>We're here to assist you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              {(order.status === "pending" || order.status === "processing") && (
                <Button variant="outline" className="w-full">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              )}
              {order.status === "delivered" && (
                <Button variant="outline" className="w-full">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Return Items
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}