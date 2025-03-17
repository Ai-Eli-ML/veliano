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

export default function CustomOrderDetailPage({ params }: { params: { id: string } }) {
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
  //       const response = await fetch(`/api/admin/custom-orders/${params.id}`)
  //       const data = await response.json()
  //       if (data) {
  //         setOrder(data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching order:', error)
  //     }
  //   }
  //   fetchOrder()
  // }, [params.id])
  
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
            note: 'Marked as received by admin'
          },
          ...order.timeline
        ]
      })
      
      setIsLoading(false)
      toast.success('Impression kit marked as received')
    }, 600)
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href="/admin/custom-orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Custom Orders
          </Link>
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Order {order.order_number}
            </h1>
            <Badge 
              variant="outline" 
              className={getStatusBadgeColor(order.status)}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created on {formatDate(order.created_at)}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Last updated {formatDate(order.updated_at)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => setShowStatusDialog(true)}
          >
            <RefreshCw className="h-4 w-4" />
            Update Status
          </Button>
          <Button asChild>
            <Link href={`/admin/custom-orders/${params.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Order
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Custom grillz order information and specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Material</h3>
                  <p className="font-medium">{order.material}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                  <p className="font-medium">{formatPrice(order.total_price)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Impression Kit</h3>
                  <div className="flex items-center gap-2">
                    {getImpressionKitStatusBadge(order.impression_kit_status)}
                    {order.impression_kit_status === 'not_sent' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={sendImpressionKit}
                        disabled={isLoading}
                      >
                        <Send className="mr-1 h-3 w-3" />
                        Send Kit
                      </Button>
                    )}
                    {order.impression_kit_status === 'sent' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={markImpressionKitReceived}
                        disabled={isLoading}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Mark Received
                      </Button>
                    )}
                  </div>
                  {order.impression_kit_tracking && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tracking: {order.impression_kit_tracking}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Completion</h3>
                  <p className="font-medium">
                    {order.estimated_completion_date 
                      ? formatDate(order.estimated_completion_date) 
                      : 'Not estimated yet'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Teeth Selection</h3>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const toothId = `top-${6-i}`
                    const isSelected = order.teeth_selection.includes(toothId)
                    return (
                      <div 
                        key={`top-${i}`} 
                        className={`h-8 border rounded-sm flex items-center justify-center ${
                          isSelected ? 'bg-primary/10 border-primary' : 'bg-muted'
                        }`}
                        title={toothId}
                      >
                        {i+1}
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-12 gap-1 mt-1">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const toothId = `bottom-${i+1}`
                    const isSelected = order.teeth_selection.includes(toothId)
                    return (
                      <div 
                        key={`bottom-${i}`} 
                        className={`h-8 border rounded-sm flex items-center justify-center ${
                          isSelected ? 'bg-primary/10 border-primary' : 'bg-muted'
                        }`}
                        title={toothId}
                      >
                        {i+1}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {order.design_details && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Design Details</h3>
                  <p>{order.design_details}</p>
                </div>
              )}
              
              {order.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</h3>
                  <p>{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>
                History of activities and status changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {event.status.includes('Created') && <ShoppingCart className="h-5 w-5 text-primary" />}
                        {event.status.includes('Kit Sent') && <Send className="h-5 w-5 text-primary" />}
                        {event.status.includes('Kit Received') && <Package className="h-5 w-5 text-primary" />}
                        {event.status.includes('Payment') && <DollarSign className="h-5 w-5 text-primary" />}
                        {event.status.includes('Design') && <Pencil className="h-5 w-5 text-primary" />}
                        {event.status.includes('Manufacturing') && <Truck className="h-5 w-5 text-primary" />}
                        {event.status.includes('Changed') && <RefreshCw className="h-5 w-5 text-primary" />}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium">
                          {event.status}
                        </p>
                        <time className="text-sm text-muted-foreground">
                          {formatDate(event.date)}
                        </time>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/custom-orders/${params.id}/timeline`}>
                  <Clock className="mr-2 h-4 w-4" />
                  View Full Timeline
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <Link 
                    href={`/admin/customers/${order.customer.id}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    View Customer Profile
                  </Link>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{order.customer.email}</p>
                </div>
                <div className="flex">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{order.customer.phone}</p>
                </div>
                <div className="flex">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{order.customer.address}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="mr-1 h-3.5 w-3.5" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="mr-1 h-3.5 w-3.5" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/admin/custom-orders/${params.id}/design`}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Manage Design
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/admin/messages/new?to=${order.customer.id}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>
              
              {order.status === 'manufacturing' && (
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Ship Order
                </Button>
              )}
              
              {order.status !== 'cancelled' && (
                <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this custom order and add a note about the update.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newStatus}
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
            
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Update Note
              </label>
              <Textarea
                id="note"
                placeholder="Add details about this status change"
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={updateOrderStatus}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 