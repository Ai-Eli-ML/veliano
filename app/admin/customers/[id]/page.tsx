"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeading } from "@/components/ui/page-heading"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Calendar, 
  CreditCard, 
  Edit, 
  Mail, 
  MapPin, 
  Package, 
  Phone, 
  ShoppingBag, 
  User 
} from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Types that match Supabase structure
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at: string
  total_spent: number
  orders_count: number
  last_order_date?: string
  shipping_address?: Address
  billing_address?: Address
  avatar_url?: string
}

interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface OrderSummary {
  id: string
  total_price: number
  payment_status: "paid" | "pending" | "failed"
  fulfillment_status: "unfulfilled" | "fulfilled" | "partially_fulfilled" | "returned"
  created_at: string
}

export default function CustomerDetailsPage() {
  const params = useParams()
  const customerId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<OrderSummary[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchCustomerData = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   // Get customer details
    //   const { data: customerData, error: customerError } = await supabase
    //     .from("customers")
    //     .select("*, shipping_addresses(*), billing_addresses(*)")
    //     .eq("id", customerId)
    //     .single()
    //   
    //   if (customerError) throw customerError
    //   if (!customerData) return null
    //   
    //   // Get customer orders
    //   const { data: ordersData, error: ordersError } = await supabase
    //     .from("orders")
    //     .select("id, total_price, payment_status, fulfillment_status, created_at")
    //     .eq("customer_id", customerId)
    //     .order("created_at", { ascending: false })
    //   
    //   if (ordersError) throw ordersError
    //   
    //   return {
    //     customer: {
    //       ...customerData,
    //       shipping_address: customerData.shipping_addresses,
    //       billing_address: customerData.billing_addresses
    //     },
    //     orders: ordersData || []
    //   }
    // }
    
    // Simulate API call
    const fetchCustomerData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock customer data
      const mockCustomer: Customer = {
        id: customerId,
        email: "emma.wilson@example.com",
        first_name: "Emma",
        last_name: "Wilson",
        phone: "+1 (555) 987-6543",
        created_at: "2024-11-15T10:30:00Z",
        total_spent: 4750,
        orders_count: 3,
        last_order_date: "2025-03-05T14:20:00Z",
        shipping_address: {
          line1: "123 Main Street",
          line2: "Apt 4B",
          city: "New York",
          state: "NY",
          postal_code: "10001",
          country: "United States"
        },
        billing_address: {
          line1: "123 Main Street",
          line2: "Apt 4B",
          city: "New York",
          state: "NY",
          postal_code: "10001",
          country: "United States"
        },
        avatar_url: "/images/avatars/emma.jpg"
      }
      
      // Mock orders
      const mockOrders: OrderSummary[] = [
        {
          id: "order123",
          total_price: 2500,
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          created_at: "2025-03-05T14:20:00Z"
        },
        {
          id: "order456",
          total_price: 1500,
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          created_at: "2025-02-10T11:15:00Z"
        },
        {
          id: "order789",
          total_price: 750,
          payment_status: "paid",
          fulfillment_status: "fulfilled",
          created_at: "2025-01-20T09:45:00Z"
        }
      ]
      
      return {
        customer: mockCustomer,
        orders: mockOrders
      }
    }
    
    fetchCustomerData()
      .then(data => {
        if (!data || !data.customer) {
          notFound()
        }
        setCustomer(data.customer)
        setOrders(data.orders)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching customer data:", error)
        setIsLoading(false)
      })
  }, [customerId])
  
  // Define columns for orders table
  const columns: ColumnDef<OrderSummary>[] = [
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
      accessorKey: "total_price",
      header: "Total",
      cell: ({ row }) => formatPrice(row.original.total_price)
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
            View
          </Link>
        </Button>
      )
    }
  ]
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="mt-8 grid gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!customer) {
    return notFound()
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex items-center justify-between">
        <PageHeading 
          title={`${customer.first_name} ${customer.last_name}`} 
          description={`Customer details and order history`} 
        />
        
        <Button size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Customer
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Customer Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
            <CardDescription>Contact information and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                {customer.avatar_url ? (
                  <AvatarImage src={customer.avatar_url} alt={`${customer.first_name} ${customer.last_name}`} />
                ) : null}
                <AvatarFallback>{customer.first_name.charAt(0)}{customer.last_name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-xl font-bold">{customer.first_name} {customer.last_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Customer since {formatDate(customer.created_at)}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
              
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span>{customer.orders_count} orders</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Total spent: {formatPrice(customer.total_spent)}</span>
              </div>
              
              {customer.last_order_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last order: {formatDate(customer.last_order_date)}</span>
            </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
            <CardDescription>Shipping and billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {customer.shipping_address && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">Shipping Address</h3>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p>{customer.shipping_address.line1}</p>
                    {customer.shipping_address.line2 && <p>{customer.shipping_address.line2}</p>}
                    <p>
                      {customer.shipping_address.city}, {customer.shipping_address.state} {customer.shipping_address.postal_code}
                    </p>
                    <p>{customer.shipping_address.country}</p>
                  </div>
                </div>
              )}
              
              {customer.billing_address && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">Billing Address</h3>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p>{customer.billing_address.line1}</p>
                    {customer.billing_address.line2 && <p>{customer.billing_address.line2}</p>}
                    <p>
                      {customer.billing_address.city}, {customer.billing_address.state} {customer.billing_address.postal_code}
                    </p>
                    <p>{customer.billing_address.country}</p>
            </div>
            </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Orders Tab */}
      <div className="mt-8">
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="notes">Customer Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-4">
            <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
                <CardDescription>
                  All orders placed by this customer
                </CardDescription>
          </CardHeader>
          <CardContent>
                {orders.length > 0 ? (
                  <DataTable columns={columns} data={orders} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This customer hasn't placed any orders yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes</CardTitle>
                <CardDescription>
                  Internal notes about this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No notes yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    There are no notes for this customer yet.
                  </p>
                  <Button className="mt-4">Add Note</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Recent customer activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">Activity Coming Soon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Customer activity tracking will be available soon.
                  </p>
                </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 

