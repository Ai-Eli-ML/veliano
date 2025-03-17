"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, Truck, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

// Interface for orders that matches Supabase structure
interface OrderSummary {
  id: string
  created_at: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items_count: number
  tracking_number?: string
}

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<OrderSummary[]>([])
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchOrders = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   const { data, error } = await supabase
    //     .from("orders")
    //     .select("id, created_at, status, total, items:order_items(count)")
    //     .order("created_at", { ascending: false })
    //   
    //   if (error) throw error
    //   
    //   // Process the data to get items_count
    //   return data.map(order => ({
    //     ...order,
    //     items_count: order.items[0].count
    //   }))
    // }
    
    // Simulate API call
    const fetchOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock orders data
      return [
        {
          id: "ORD12345",
          created_at: "2025-03-10T14:30:00Z",
          status: "delivered",
          total: 12890,
          items_count: 2,
          tracking_number: "TRK9876543210"
        },
        {
          id: "ORD12346",
          created_at: "2025-02-25T10:15:00Z",
          status: "shipped",
          total: 8495,
          items_count: 1,
          tracking_number: "TRK9876543211"
        },
        {
          id: "ORD12347",
          created_at: "2025-02-15T09:45:00Z",
          status: "processing",
          total: 15990,
          items_count: 3
        },
        {
          id: "ORD12348",
          created_at: "2025-01-30T16:20:00Z",
          status: "cancelled",
          total: 5495,
          items_count: 1
        },
        {
          id: "ORD12349",
          created_at: "2025-01-15T13:10:00Z",
          status: "delivered",
          total: 22990,
          items_count: 4,
          tracking_number: "TRK9876543215"
        }
      ] as OrderSummary[]
    }
    
    fetchOrders()
      .then(data => {
        setOrders(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching orders:", error)
        setIsLoading(false)
      })
  }, [])
  
  // Helper function to render order status with icon
  const renderOrderStatus = (status: OrderSummary["status"]) => {
    const statusConfig = {
      pending: { icon: <Clock className="h-4 w-4" />, label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      processing: { icon: <Package className="h-4 w-4" />, label: "Processing", color: "bg-blue-100 text-blue-800" },
      shipped: { icon: <Truck className="h-4 w-4" />, label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
      delivered: { icon: <CheckCircle className="h-4 w-4" />, label: "Delivered", color: "bg-green-100 text-green-800" },
      cancelled: { icon: <AlertCircle className="h-4 w-4" />, label: "Cancelled", color: "bg-red-100 text-red-800" },
    }
    
    const config = statusConfig[status]
    
    return (
      <Badge className={`flex items-center gap-1 px-2 py-1 ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </Badge>
    )
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="My Orders" description="View your order history" />
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-pulse">Loading your orders...</div>
        </div>
      </div>
    )
  }
  
  if (orders.length === 0) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="My Orders" description="View your order history" />
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">When you place orders, they will appear here.</p>
          <Button className="mt-4" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container max-w-screen-xl py-8">
      <PageHeading title="My Orders" description="View your order history" />
      
      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
                </div>
                {renderOrderStatus(order.status)}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">{order.items_count} {order.items_count === 1 ? 'item' : 'items'}</p>
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>
                
                {order.status === "shipped" && order.tracking_number && (
                  <div className="text-sm">
                    <p className="text-gray-500">Tracking Number:</p>
                    <p className="font-mono">{order.tracking_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
            
            <Separator />
            
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href={`/account/orders/${order.id}`}>
                  View Order Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
