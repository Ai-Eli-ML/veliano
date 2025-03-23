"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  ChevronRight,
  Clock,
  DollarSign,
  FileEdit,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  RefreshCw,
  Send,
  ShoppingCart,
  Truck,
  User,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { formatDate, formatPrice } from "@/lib/utils"

// Types
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface CustomOrder {
  id: string
  order_number: string
  customer: Customer
  status: "pending" | "design" | "manufacturing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
  total_price: number
  impression_kit_status: "not_sent" | "sent" | "received"
  impression_kit_tracking?: string
  teeth_selection: string[]
  material: string
  design_details?: string
  estimated_completion_date: string | null
  notes?: string
  timeline: {
    date: string
    status: string
    note: string
  }[]
}

// Mock data for a single custom order
const mockOrder: CustomOrder = {
  id: "co_1",
  order_number: "CO-12345",
  customer: {
    id: "cust_123",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Apt 4B, New York, NY 10001"
  },
  status: "design",
  created_at: "2023-09-15T08:30:00Z",
  updated_at: "2023-09-16T14:20:00Z",
  total_price: 1200.00,
  impression_kit_status: "received",
  impression_kit_tracking: "USPS12345678901234",
  teeth_selection: ["top-6", "top-5", "top-4", "top-3", "top-2", "top-1", "bottom-1", "bottom-2", "bottom-3", "bottom-4", "bottom-5", "bottom-6"],
  material: "18K Gold",
  design_details: "Customer wants diamond accents on the front 4 teeth and a subtle cross pattern on the molars.",
  estimated_completion_date: "2023-10-15",
  notes: "Customer prefers video calls for design approvals. Available weekdays after 5pm EST.",
  timeline: [
    {
      date: "2023-09-15T08:30:00Z",
      status: "Order Created",
      note: "Custom order placed through website"
    },
    {
      date: "2023-09-15T10:15:00Z",
      status: "Impression Kit Sent",
      note: "Shipped via USPS with tracking USPS12345678901234"
    },
    {
      date: "2023-09-15T15:45:00Z",
      status: "Payment Confirmed",
      note: "Initial payment of $600.00 received"
    },
    {
      date: "2023-09-20T11:20:00Z",
      status: "Impression Kit Received",
      note: "Good quality impressions"
    },
    {
      date: "2023-09-23T09:30:00Z",
      status: "Design Started",
      note: "Initial 3D scan completed"
    }
  ]
}

const getStatusBadgeColor = (status: CustomOrder['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'design':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'manufacturing':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getImpressionKitStatusBadge = (status: CustomOrder['impression_kit_status']) => {
  switch (status) {
    case 'not_sent':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Not Sent</Badge>
    case 'sent':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Sent</Badge>
    case 'received':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Received</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function CustomOrderDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<CustomOrder>(mockOrder)
  const [isLoading, setIsLoading] = useState(false)
  const [updateNote, setUpdateNote] = useState('')
  const [newStatus, setNewStatus] = useState<CustomOrder['status']>(order.status)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  
  // In a real app, this would fetch the order from the API
  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const response = await fetch(`/api/admin/custom-orders/${id}`)
  //       const data = await response.json()
  //       if (data) {
  //         setOrder(data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching order:', error)
  //     }
  //   }
  //   fetchOrder()
  // }, [id])
  
  const updateOrderStatus = () => {
    setIsLoading(true)
    
    // In a real implementation, this would update the order in the database
    setTimeout(() => {
      setOrder({
        ...order,
        status: newStatus,
        updated_at: new Date().toISOString(),
        timeline: [
          {
            date: new Date().toISOString(),
            status: `Status Changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
            note: updateNote || 'Status updated by admin'
          },
          ...order.timeline
        ]
      })
      
      setShowStatusDialog(false)
      setUpdateNote('')
      setIsLoading(false)
      toast.success(`Order status updated to ${newStatus}`)
    }, 600)
  }
  
  const sendImpressionKit = () => {
    setIsLoading(true)
    
    // In a real implementation, this would update the order in the database
    setTimeout(() => {
      const tracking = `USPS${Math.floor(Math.random() * 10000000000).toString().padStart(12, '0')}`
      
      setOrder({
        ...order,
        impression_kit_status: 'sent',
        impression_kit_tracking: tracking,
        updated_at: new Date().toISOString(),
        timeline: [
          {
            date: new Date().toISOString(),
            status: 'Impression Kit Sent',
            note: `Shipped via USPS with tracking ${tracking}`
          },
          ...order.timeline
        ]
      })
      
      setIsLoading(false)
      toast.success('Impression kit marked as sent')
    }, 600)
  }
  
  const markImpressionKitReceived = () => {
    setIsLoading(true)
    
    // In a real implementation, this would update the order in the database
    setTimeout(() => {
      setOrder({
        ...order,
        impression_kit_status: 'received',
        updated_at: new Date().toISOString(),
        timeline: [
          {
            date: new Date().toISOString(),
            status: 'Impression Kit Received',
            note: 'Received by manufacturer'
          },
          ...order.timeline
        ]
      })
      
      setIsLoading(false)
      toast.success('Impression kit marked as received')
    }, 600)
  }
  
  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div>
          <Link 
            href="/admin/custom-orders" 
            className="inline-flex items-center text-sm text-muted-foreground mb-2 hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Custom Orders
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Custom Order #{order.order_number}</h1>
          <p className="text-muted-foreground">Created on {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileEdit className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Change the status of this custom order and add a note to the timeline.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <Select 
                    defaultValue={order.status} 
                    onValueChange={(value) => setNewStatus(value as CustomOrder['status'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="note" className="text-sm font-medium">Timeline Note</label>
                  <Textarea
                    id="note"
                    placeholder="Add a note about this status change"
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowStatusDialog(false)}>Cancel</Button>
                <Button onClick={updateOrderStatus} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : "Update Status"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-6 mt-8 lg:grid-cols-3">
        {/* Customer Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">Customer ID: {order.customer.id}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm">{order.customer.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm">{order.customer.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm whitespace-pre-line">{order.customer.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Total</p>
                <p className="text-lg font-bold">{formatPrice(order.total_price)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Material</p>
                <p className="text-lg font-medium">{order.material}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Impression Kit</p>
                <div className="flex items-center gap-2">
                  {getImpressionKitStatusBadge(order.impression_kit_status)}
                  
                  {order.impression_kit_status === 'not_sent' && (
                    <Button size="sm" onClick={sendImpressionKit} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Mark Sent'}
                    </Button>
                  )}
                  
                  {order.impression_kit_status === 'sent' && !order.impression_kit_tracking && (
                    <Button size="sm" variant="outline" disabled>Add Tracking</Button>
                  )}
                  
                  {order.impression_kit_status === 'sent' && (
                    <Button size="sm" onClick={markImpressionKitReceived} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Mark Received'}
                    </Button>
                  )}
                </div>
                
                {order.impression_kit_tracking && (
                  <p className="text-sm mt-1">
                    Tracking: {order.impression_kit_tracking}
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Completion</p>
                <p className="text-lg font-medium">
                  {order.estimated_completion_date ? formatDate(order.estimated_completion_date) : 'Not set'}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Teeth Selection</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {order.teeth_selection.map((tooth) => (
                  <Badge key={tooth} variant="outline">{tooth}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Design Details</p>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm">{order.design_details || 'No design details provided'}</p>
                </CardContent>
              </Card>
            </div>
            
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm">{order.notes}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Timeline */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    {index < order.timeline.length - 1 && (
                      <div className="h-full w-0.5 bg-muted-foreground/20"></div>
                    )}
                  </div>
                  <div className="pb-6 pt-1">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-medium leading-none">{event.status}</h3>
                      <time className="text-sm text-muted-foreground">
                        {formatDate(event.date)}
                      </time>
                      <p className="text-sm mt-1">{event.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 