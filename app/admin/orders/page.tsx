"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { Eye, Download, Search, Filter } from "lucide-react"
import Link from "next/link"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Interface for order data that matches Supabase structure
interface Order {
  id: string
  customer_name: string
  customer_email: string
  total_price: number
  payment_status: "paid" | "pending" | "failed"
  fulfillment_status: "unfulfilled" | "fulfilled" | "partially_fulfilled" | "returned"
  created_at: string
  items_count: number
}

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchOrders = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   let query = supabase
    //     .from("orders")
    //     .select("*, order_items(count)")
    //     .order("created_at", { ascending: false })
    //   
    //   if (paymentFilter !== "all") {
    //     query = query.eq("payment_status", paymentFilter)
    //   }
    //   
    //   if (fulfillmentFilter !== "all") {
    //     query = query.eq("fulfillment_status", fulfillmentFilter)
    //   }
    //   
    //   if (searchQuery) {
    //     query = query.or(`id.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`)
    //   }
    //   
    //   const { data, error } = await query
    //   
    //   if (error) throw error
    //   
    //   return data.map(order => ({
    //     ...order,
    //     items_count: order.order_items[0].count
    //   }))
    // }
    
    // Simulate API call
    const fetchOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: "ORD-001",
          customer_name: "Emma Wilson",
          customer_email: "emma.wilson@example.com",
          total_price: 7500,
          payment_status: "paid",
          fulfillment_status: "unfulfilled",
          created_at: "2025-03-05T14:20:00Z",
          items_count: 3
        },
        {
          id: "ORD-002",
          customer_name: "Michael Brown",
          customer_email: "michael.brown@example.com",
          total_price: 2500,
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          created_at: "2025-03-01T09:15:00Z",
          items_count: 1
        },
        {
          id: "ORD-003",
          customer_name: "Sophia Garcia",
          customer_email: "sophia.garcia@example.com",
          total_price: 4200,
          payment_status: "pending",
          fulfillment_status: "unfulfilled",
          created_at: "2025-02-28T16:45:00Z",
          items_count: 2
        },
        {
          id: "ORD-004",
          customer_name: "William Johnson",
          customer_email: "william.johnson@example.com",
          total_price: 1200,
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          created_at: "2025-02-25T11:30:00Z",
          items_count: 1
        },
        {
          id: "ORD-005",
          customer_name: "Olivia Davis",
          customer_email: "olivia.davis@example.com",
          total_price: 3500,
          payment_status: "failed",
          fulfillment_status: "unfulfilled",
          created_at: "2025-02-20T13:10:00Z",
          items_count: 2
        }
      ]
      
      // Apply filters
      let filteredOrders = [...mockOrders]
      
      if (paymentFilter !== "all") {
        filteredOrders = filteredOrders.filter(
          order => order.payment_status === paymentFilter
        )
      }
      
      if (fulfillmentFilter !== "all") {
        filteredOrders = filteredOrders.filter(
          order => order.fulfillment_status === fulfillmentFilter
        )
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredOrders = filteredOrders.filter(
          order => 
            order.id.toLowerCase().includes(query) || 
            order.customer_name.toLowerCase().includes(query) ||
            order.customer_email.toLowerCase().includes(query)
        )
      }
      
      return filteredOrders
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
  }, [paymentFilter, fulfillmentFilter, searchQuery])
  
  // Define columns for orders table
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <Link 
          href={`/admin/orders/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.original.id}
        </Link>
      )
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.customer_name}</div>
          <div className="text-sm text-muted-foreground">{row.original.customer_email}</div>
        </div>
      )
    },
    {
      accessorKey: "total_price",
      header: "Total",
      cell: ({ row }) => formatPrice(row.original.total_price)
    },
    {
      accessorKey: "items_count",
      header: "Items",
      cell: ({ row }) => row.original.items_count
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.original.payment_status
        return (
          <Badge
            variant={
              status === "paid" ? "success" :
              status === "pending" ? "outline" : "destructive"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: "fulfillment_status",
      header: "Fulfillment",
      cell: ({ row }) => {
        const status = row.original.fulfillment_status
        return (
          <Badge
            variant={
              status === "fulfilled" ? "success" :
              status === "partially_fulfilled" ? "outline" :
              status === "unfulfilled" ? "secondary" : "destructive"
            }
          >
            {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        )
      }
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/orders/${row.original.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      )
    }
  ]
  
  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex items-center justify-between">
        <PageHeading 
          title="Orders" 
          description="Manage and process customer orders" 
        />
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={paymentFilter}
              onValueChange={setPaymentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={fulfillmentFilter}
              onValueChange={setFulfillmentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fulfillment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fulfillments</SelectItem>
                <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Loading orders...</div>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={orders} 
          />
        )}
      </div>
    </div>
  )
}
