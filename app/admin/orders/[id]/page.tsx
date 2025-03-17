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
  ArrowLeft, 
  Calendar, 
  Check, 
  CreditCard, 
  Download, 
  Edit, 
  Mail, 
  MapPin, 
  Package, 
  Phone, 
  Printer, 
  RefreshCw, 
  Send, 
  Truck, 
  User 
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types that match Supabase structure
interface Order {
  id: string
  customer_id: string
  customer_email: string
  customer_name: string
  total_price: number
  subtotal_price: number
  shipping_price: number
  tax_price: number
  discount_price: number
  payment_status: "paid" | "pending" | "failed"
  fulfillment_status: "unfulfilled" | "fulfilled" | "partially_fulfilled" | "returned"
  payment_method: string
  shipping_method: string
  created_at: string
  updated_at: string
  notes?: string
  shipping_address: Address
  billing_address: Address
  items: OrderItem[]
}

interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  variant_id?: string
  variant_name?: string
  price: number
  quantity: number
  subtotal: number
  image?: string
  sku?: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>("")
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>("")

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchOrderData = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   const { data, error } = await supabase
    //     .from("orders")
    //     .select("*, order_items(*)")
    //     .eq("id", orderId)
    //     .single()
    //   
    //   if (error) throw error
    //   if (!data) return null
    //   
    //   return {
    //     ...data,
    //     items: data.order_items
    //   }
    // }
    
    // Simulate API call
    const fetchOrderData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock order data
      const mockOrder: Order = {
        id: orderId,
        customer_id: "cust123",
        customer_email: "emma.wilson@example.com",
        customer_name: "Emma Wilson",
        total_price: 7500,
        subtotal_price: 6800,
        shipping_price: 500,
        tax_price: 200,
        discount_price: 0,
        payment_status: "paid",
        fulfillment_status: "unfulfilled",
        payment_method: "credit_card",
        shipping_method: "standard",
        created_at: "2025-03-05T14:20:00Z",
        updated_at: "2025-03-05T14:25:00Z",
        notes: "Customer requested gift wrapping",
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
        items: [
          {
            id: "item1",
            product_id: "prod1",
            product_name: "Vintage Gold Bracelet",
            price: 2500,
            quantity: 1,
            subtotal: 2500,
            image: "/images/products/bracelet.jpg",
            sku: "JWL-BRC-001"
          },
          {
            id: "item2",
            product_id: "prod2",
            product_name: "Silver Pendant Necklace",
            price: 1800,
            quantity: 1,
            subtotal: 1800,
            image: "/images/products/necklace.jpg",
            sku: "JWL-NCK-002"
          },
          {
            id: "item3",
            product_id: "prod3",
            product_name: "Diamond Stud Earrings",
            variant_id: "var1",
            variant_name: "White Gold",
            price: 2500,
            quantity: 1,
            subtotal: 2500,
            image: "/images/products/earrings.jpg",
            sku: "JWL-EAR-003-WG"
          }
        ]
      }
      
      return mockOrder
    }
    
    fetchOrderData()
      .then(data => {
        if (!data) {
          notFound()
        }
        setOrder(data)
        setPaymentStatus(data.payment_status)
        setFulfillmentStatus(data.fulfillment_status)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching order data:", error)
        setIsLoading(false)
      })
  }, [orderId])
  
  const updateOrderStatus = () => {
    // In a real implementation, this would update the order in Supabase
    // const updateOrder = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   const { error } = await supabase
    //     .from("orders")
    //     .update({
    //       payment_status: paymentStatus,
    //       fulfillment_status: fulfillmentStatus,
    //       updated_at: new Date().toISOString()
    //     })
    //     .eq("id", orderId)
    //   
    //   if (error) throw error
    // }
    
    // For now, just update the local state
    if (order) {
      setOrder({
        ...order,
        payment_status: paymentStatus as any,
        fulfillment_status: fulfillmentStatus as any,
        updated_at: new Date().toISOString()
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted"></div>
        </div>
        
        <div className="mt-8 grid gap-8">
          <div className="h-64 w-full animate-pulse rounded-md bg-muted"></div>
          <div className="h-96 w-full animate-pulse rounded-md bg-muted"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return notFound()
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
      
      <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <PageHeading 
            title={`Order ${order.id}`} 
            description={`Placed on ${formatDate(order.created_at)}`} 
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Send className="mr-2 h-4 w-4" />
            Email Invoice
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Order Summary</CardTitle>
            <div className="flex gap-2">
              <Badge
                variant={
                  order.payment_status === "paid" ? "success" :
                  order.payment_status === "pending" ? "outline" : "destructive"
                }
              >
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </Badge>
              <Badge
                variant={
                  order.fulfillment_status === "fulfilled" ? "success" :
                  order.fulfillment_status === "partially_fulfilled" ? "outline" :
                  order.fulfillment_status === "unfulfilled" ? "secondary" : "destructive"
                }
              >
                {order.fulfillment_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="mb-4 font-medium">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        {item.variant_name && (
                          <p className="text-sm text-muted-foreground">Variant: {item.variant_name}</p>
                        )}
                        {item.sku && (
                          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price)}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Order Totals */}
              <div>
                <h3 className="mb-4 font-medium">Order Totals</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(order.shipping_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.tax_price)}</span>
                  </div>
                  {order.discount_price > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>-{formatPrice(order.discount_price)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment Information */}
              <div>
                <h3 className="mb-4 font-medium">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge
                      variant={
                        order.payment_status === "paid" ? "success" :
                        order.payment_status === "pending" ? "outline" : "destructive"
                      }
                    >
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Shipping Information */}
              <div>
                <h3 className="mb-4 font-medium">Shipping Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Method</span>
                    <span className="capitalize">{order.shipping_method.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
                    <span className="text-muted-foreground">Fulfillment Status</span>
                    <Badge
                      variant={
                        order.fulfillment_status === "fulfilled" ? "success" :
                        order.fulfillment_status === "partially_fulfilled" ? "outline" :
                        order.fulfillment_status === "unfulfilled" ? "secondary" : "destructive"
                      }
                    >
                      {order.fulfillment_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 font-medium">Order Notes</h3>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer and Actions */}
        <div className="space-y-8">
          {/* Customer Information */}
        <Card>
          <CardHeader>
              <CardTitle>Customer</CardTitle>
              <CardDescription>Customer information</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{order.customer_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{order.customer_name}</h3>
                  <Link 
                    href={`/admin/customers/${order.customer_id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Customer
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer_email}</span>
            </div>
            </div>
          </CardContent>
        </Card>

          {/* Addresses */}
        <Card>
          <CardHeader>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>Shipping and billing addresses</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Shipping Address</h3>
                <div className="space-y-1 text-sm">
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="mb-2 font-medium">Billing Address</h3>
                <div className="space-y-1 text-sm">
                  <p>{order.billing_address.line1}</p>
                  {order.billing_address.line2 && <p>{order.billing_address.line2}</p>}
                  <p>
                    {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                  </p>
                  <p>{order.billing_address.country}</p>
                </div>
              </div>
          </CardContent>
        </Card>

          {/* Update Order */}
        <Card>
          <CardHeader>
              <CardTitle>Update Order</CardTitle>
              <CardDescription>Change order status</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select
                  value={paymentStatus}
                  onValueChange={setPaymentStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fulfillment Status</label>
                <Select
                  value={fulfillmentStatus}
                  onValueChange={setFulfillmentStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fulfillment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                    <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Add Note</label>
                <Textarea placeholder="Add a note to this order" />
              </div>
              
              <Button className="w-full" onClick={updateOrderStatus}>
                <Check className="mr-2 h-4 w-4" />
                Update Order
              </Button>
          </CardContent>
        </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            <Card>
          <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>
                  History of events for this order
                </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Payment received</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at, true)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order created</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at, true)}</p>
                    </div>
                  </div>
                  
                  {order.fulfillment_status === "unfulfilled" && (
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                        <Truck className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Awaiting fulfillment</p>
                        <p className="text-sm text-muted-foreground">Order is being prepared for shipping</p>
                      </div>
                    </div>
                  )}
                  
                  {(order.fulfillment_status === "fulfilled" || order.fulfillment_status === "partially_fulfilled") && (
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Truck className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order shipped</p>
                        <p className="text-sm text-muted-foreground">Package is on its way</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>
                  Internal notes for this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.notes ? (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Note</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <p className="mt-2 text-sm">{order.notes}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/60" />
                      <h3 className="mt-4 text-lg font-medium">No notes yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        There are no notes for this order yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                  Shipping details and tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No shipping information</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This order hasn't been shipped yet.
                  </p>
                  <Button className="mt-4">Create Shipment</Button>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 


