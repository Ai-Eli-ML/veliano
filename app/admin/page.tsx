"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate } from "@/lib/utils"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  ArrowUpRight, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  Eye, 
  Package, 
  RefreshCw, 
  ShoppingBag, 
  Users 
} from "lucide-react"
import Link from "next/link"

// Types for dashboard data
interface DashboardStats {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  totalCustomers: number
  salesGrowth: number
  ordersGrowth: number
  customersGrowth: number
}

interface RecentOrder {
  id: string
  customer_name: string
  total_price: number
  payment_status: "paid" | "pending" | "failed"
  created_at: string
  items_count: number
}

interface TopProduct {
  id: string
  name: string
  price: number
  quantity_sold: number
  revenue: number
  category: string
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("7d")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchDashboardData = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   // Get dashboard stats
    //   const { data: statsData, error: statsError } = await supabase
    //     .rpc('get_dashboard_stats', { timeframe: timeframe })
    //   
    //   if (statsError) throw statsError
    //   
    //   // Get recent orders
    //   const { data: ordersData, error: ordersError } = await supabase
    //     .from('orders')
    //     .select('id, customer_name, total_price, payment_status, created_at, order_items(count)')
    //     .order('created_at', { ascending: false })
    //     .limit(5)
    //   
    //   if (ordersError) throw ordersError
    //   
    //   // Get top products
    //   const { data: productsData, error: productsError } = await supabase
    //     .rpc('get_top_products', { timeframe: timeframe })
    //     .limit(5)
    //   
    //   if (productsError) throw productsError
    //   
    //   return {
    //     stats: statsData,
    //     recentOrders: ordersData.map(order => ({
    //       ...order,
    //       items_count: order.order_items[0].count
    //     })),
    //     topProducts: productsData
    //   }
    // }
    
    // Simulate API call
    const fetchDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock dashboard stats
      const mockStats: DashboardStats = {
        totalSales: timeframe === "7d" ? 24500 : timeframe === "30d" ? 98000 : 320000,
        totalOrders: timeframe === "7d" ? 18 : timeframe === "30d" ? 72 : 245,
        averageOrderValue: timeframe === "7d" ? 1361 : timeframe === "30d" ? 1361 : 1306,
        totalCustomers: timeframe === "7d" ? 15 : timeframe === "30d" ? 58 : 180,
        salesGrowth: timeframe === "7d" ? 12.5 : timeframe === "30d" ? 8.2 : 15.7,
        ordersGrowth: timeframe === "7d" ? 8.3 : timeframe === "30d" ? 5.1 : 12.3,
        customersGrowth: timeframe === "7d" ? 5.2 : timeframe === "30d" ? 7.8 : 18.5
      }
      
      // Mock recent orders
      const mockRecentOrders: RecentOrder[] = [
        {
          id: "ORD-001",
          customer_name: "Emma Wilson",
          total_price: 7500,
          payment_status: "paid",
          created_at: "2025-03-05T14:20:00Z",
          items_count: 3
        },
        {
          id: "ORD-002",
          customer_name: "Michael Brown",
          total_price: 2500,
          payment_status: "paid",
          created_at: "2025-03-01T09:15:00Z",
          items_count: 1
        },
        {
          id: "ORD-003",
          customer_name: "Sophia Garcia",
          total_price: 4200,
          payment_status: "pending",
          created_at: "2025-02-28T16:45:00Z",
          items_count: 2
        },
        {
          id: "ORD-004",
          customer_name: "William Johnson",
          total_price: 1200,
          payment_status: "paid",
          created_at: "2025-02-25T11:30:00Z",
          items_count: 1
        },
        {
          id: "ORD-005",
          customer_name: "Olivia Davis",
          total_price: 3500,
          payment_status: "failed",
          created_at: "2025-02-20T13:10:00Z",
          items_count: 2
        }
      ]
      
      // Mock top products
      const mockTopProducts: TopProduct[] = [
        {
          id: "prod1",
          name: "Vintage Gold Bracelet",
          price: 2500,
          quantity_sold: 12,
          revenue: 30000,
          category: "Jewelry"
        },
        {
          id: "prod2",
          name: "Diamond Stud Earrings",
          price: 5000,
          quantity_sold: 8,
          revenue: 40000,
          category: "Jewelry"
        },
        {
          id: "prod3",
          name: "Silver Pendant Necklace",
          price: 1800,
          quantity_sold: 15,
          revenue: 27000,
          category: "Jewelry"
        },
        {
          id: "prod4",
          name: "Pearl Drop Earrings",
          price: 1500,
          quantity_sold: 10,
          revenue: 15000,
          category: "Jewelry"
        },
        {
          id: "prod5",
          name: "Rose Gold Ring",
          price: 3200,
          quantity_sold: 6,
          revenue: 19200,
          category: "Jewelry"
        }
      ]
      
      return {
        stats: mockStats,
        recentOrders: mockRecentOrders,
        topProducts: mockTopProducts
      }
    }
    
    fetchDashboardData()
      .then(data => {
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
        setTopProducts(data.topProducts)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching dashboard data:", error)
        setIsLoading(false)
      })
  }, [timeframe])
  
  // Define columns for recent orders table
  const orderColumns: ColumnDef<RecentOrder>[] = [
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
    },
    {
      accessorKey: "total_price",
      header: "Total",
      cell: ({ row }) => formatPrice(row.original.total_price)
    },
    {
      accessorKey: "payment_status",
      header: "Status",
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
  
  // Define columns for top products table
  const productColumns: ColumnDef<TopProduct>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      )
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatPrice(row.original.price)
    },
    {
      accessorKey: "quantity_sold",
      header: "Quantity",
      cell: ({ row }) => row.original.quantity_sold
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => formatPrice(row.original.revenue)
    }
  ]
  
  const refreshData = () => {
    setIsLoading(true)
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }
  
  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex items-center justify-between">
        <PageHeading 
          title="Dashboard" 
          description="Overview of your store's performance" 
        />
        
        <div className="flex gap-2">
          <div className="flex items-center rounded-md border p-1">
            <Button 
              variant={timeframe === "7d" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeframe("7d")}
            >
              7D
            </Button>
            <Button 
              variant={timeframe === "30d" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeframe("30d")}
            >
              30D
            </Button>
            <Button 
              variant={timeframe === "year" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeframe("year")}
            >
              Year
            </Button>
          </div>
          
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-lg bg-muted"></div>
          ))}
        </div>
      ) : stats ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${stats.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.salesGrowth >= 0 ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="mr-1 h-3 w-3 rotate-180" />
                  )}
                  {Math.abs(stats.salesGrowth)}%
                </span>
                {' '}from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.ordersGrowth >= 0 ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="mr-1 h-3 w-3 rotate-180" />
                  )}
                  {Math.abs(stats.ordersGrowth)}%
                </span>
                {' '}from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${stats.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.customersGrowth >= 0 ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="mr-1 h-3 w-3 rotate-180" />
                  )}
                  {Math.abs(stats.customersGrowth)}%
                </span>
                {' '}from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                For {timeframe === "7d" ? "the past week" : timeframe === "30d" ? "the past month" : "this year"}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      <div className="mt-8">
        <Tabs defaultValue="recent_orders">
          <TabsList>
            <TabsTrigger value="recent_orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="top_products">Top Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent_orders" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders from your store
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/orders">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse">Loading orders...</div>
                  </div>
                ) : (
                  <DataTable 
                    columns={orderColumns} 
                    data={recentOrders} 
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="top_products" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Best selling products for the selected period
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/products">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse">Loading products...</div>
                  </div>
                ) : (
                  <DataTable 
                    columns={productColumns} 
                    data={topProducts} 
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                <Link href="/admin/orders">
                  <Package className="h-5 w-5" />
                  <div className="font-medium">Process Orders</div>
                  <div className="text-xs text-muted-foreground">Manage and fulfill customer orders</div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                <Link href="/admin/products">
                  <ShoppingBag className="h-5 w-5" />
                  <div className="font-medium">Manage Products</div>
                  <div className="text-xs text-muted-foreground">Add, edit, or remove products</div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                <Link href="/admin/customers">
                  <Users className="h-5 w-5" />
                  <div className="font-medium">View Customers</div>
                  <div className="text-xs text-muted-foreground">Manage customer accounts</div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                <Link href="/admin/monitoring">
                  <Calendar className="h-5 w-5" />
                  <div className="font-medium">System Status</div>
                  <div className="text-xs text-muted-foreground">Monitor system performance</div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
