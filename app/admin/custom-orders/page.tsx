"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Eye, 
  Filter, 
  PlusCircle, 
  RefreshCw, 
  Search,
  Sparkles 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { formatDate, formatPrice } from "@/lib/utils"

// Types for custom orders
interface CustomOrder {
  id: string
  order_number: string
  customer_name: string
  status: "pending" | "design" | "manufacturing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
  total_price: number
  impression_kit_status: "not_sent" | "sent" | "received"
  teeth_selection: string[]
  material: string
  estimated_completion_date: string | null
}

// Mock data for custom orders
const mockCustomOrders: CustomOrder[] = [
  {
    id: "co_1",
    order_number: "CO-12345",
    customer_name: "James Wilson",
    status: "design",
    created_at: "2023-09-15T08:30:00Z",
    updated_at: "2023-09-16T14:20:00Z",
    total_price: 1200.00,
    impression_kit_status: "received",
    teeth_selection: ["top-6", "top-5", "top-4", "top-3", "top-2", "top-1", "bottom-1", "bottom-2", "bottom-3", "bottom-4", "bottom-5", "bottom-6"],
    material: "18K Gold",
    estimated_completion_date: "2023-10-15"
  },
  {
    id: "co_2",
    order_number: "CO-12346",
    customer_name: "Sophia Johnson",
    status: "pending",
    created_at: "2023-09-17T10:15:00Z",
    updated_at: "2023-09-17T10:15:00Z",
    total_price: 800.00,
    impression_kit_status: "sent",
    teeth_selection: ["top-5", "top-4", "top-3", "top-2", "top-1"],
    material: "White Gold",
    estimated_completion_date: null
  },
  {
    id: "co_3",
    order_number: "CO-12347",
    customer_name: "Michael Davis",
    status: "manufacturing",
    created_at: "2023-09-10T14:45:00Z",
    updated_at: "2023-09-14T09:20:00Z",
    total_price: 1500.00,
    impression_kit_status: "received",
    teeth_selection: ["bottom-6", "bottom-5", "bottom-4", "bottom-3", "bottom-2", "bottom-1"],
    material: "18K Gold with Diamonds",
    estimated_completion_date: "2023-10-05"
  },
  {
    id: "co_4",
    order_number: "CO-12348",
    customer_name: "Emma Martinez",
    status: "shipped",
    created_at: "2023-08-28T11:30:00Z",
    updated_at: "2023-09-15T16:40:00Z",
    total_price: 950.00,
    impression_kit_status: "received",
    teeth_selection: ["top-3", "top-2", "top-1", "bottom-1", "bottom-2", "bottom-3"],
    material: "14K Gold",
    estimated_completion_date: "2023-09-14"
  },
  {
    id: "co_5",
    order_number: "CO-12349",
    customer_name: "Oliver Taylor",
    status: "pending",
    created_at: "2023-09-18T09:20:00Z",
    updated_at: "2023-09-18T09:20:00Z",
    total_price: 1100.00,
    impression_kit_status: "not_sent",
    teeth_selection: ["top-4", "top-3", "top-2", "top-1"],
    material: "Platinum",
    estimated_completion_date: null
  }
]

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

export default function CustomOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [currentTab, setCurrentTab] = useState('all')
  
  // Filter orders based on search and filter criteria
  const filteredOrders = mockCustomOrders.filter(order => {
    // Search filter
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    // Tab filter
    const matchesTab = currentTab === 'all' || 
      (currentTab === 'pending-approval' && order.status === 'pending') ||
      (currentTab === 'in-progress' && ['design', 'manufacturing'].includes(order.status)) ||
      (currentTab === 'completed' && ['shipped', 'delivered'].includes(order.status))
    
    return matchesSearch && matchesStatus && matchesTab
  })
  
  const refreshData = () => {
    setIsLoading(true)
    // In a real implementation, this would fetch fresh data from the API
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Custom orders refreshed')
    }, 800)
  }
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)))
    } else {
      setSelectedOrders(new Set())
    }
  }
  
  const handleSelectOrder = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedOrders(newSelected)
  }
  
  const sendImpressionKit = (orderId: string) => {
    toast.success(`Impression kit marked as sent for order ${orderId}`)
    // In a real implementation, this would update the order in the database
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Orders</h1>
          <p className="text-muted-foreground">
            Manage custom grillz orders and impression kits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/custom-orders/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Custom Order
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Custom Orders Management</CardTitle>
            <CardDescription>
              View and manage all custom orders for your customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending-approval">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={filterStatus} 
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <TabsContent value={currentTab} className="m-0">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]">
                          <Checkbox 
                            checked={selectedOrders.size > 0 && selectedOrders.size === filteredOrders.length}
                            onCheckedChange={(checked) => handleSelectAll(!!checked)}
                          />
                        </TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Impression Kit</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                            No custom orders found
                            {searchQuery && " matching your search criteria"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedOrders.has(order.id)}
                                onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <Link href={`/admin/custom-orders/${order.id}`} className="text-blue-600 hover:underline">
                                {order.order_number}
                              </Link>
                            </TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getStatusBadgeColor(order.status)}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(order.created_at)}</TableCell>
                            <TableCell>
                              {getImpressionKitStatusBadge(order.impression_kit_status)}
                            </TableCell>
                            <TableCell>{formatPrice(order.total_price)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  asChild
                                >
                                  <Link href={`/admin/custom-orders/${order.id}`}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Link>
                                </Button>
                                {order.impression_kit_status === 'not_sent' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => sendImpressionKit(order.id)}
                                  >
                                    Send Kit
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Impression Kits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.impression_kit_status === 'not_sent').length}</p>
                  <p className="text-xs text-muted-foreground">To Send</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.impression_kit_status === 'sent').length}</p>
                  <p className="text-xs text-muted-foreground">Sent</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.impression_kit_status === 'received').length}</p>
                  <p className="text-xs text-muted-foreground">Received</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Production Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.status === 'pending').length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.status === 'design').length}</p>
                  <p className="text-xs text-muted-foreground">Design</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.status === 'manufacturing').length}</p>
                  <p className="text-xs text-muted-foreground">Manufacturing</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{mockCustomOrders.filter(o => o.status === 'shipped' || o.status === 'delivered').length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link href="/admin/custom-orders/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Order
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link href="/admin/custom-orders/kits">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Manage Impression Kits
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="justify-start" disabled={selectedOrders.size === 0}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Selected ({selectedOrders.size})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 