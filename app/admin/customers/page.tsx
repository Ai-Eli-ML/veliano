"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { formatPrice, formatDate } from "@/lib/utils"
import { Eye, Plus, Search, Download } from "lucide-react"
import Link from "next/link"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Interface for customer data that matches Supabase structure
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  total_spent: number
  orders_count: number
  last_order_date?: string
  avatar_url?: string
}

export default function CustomersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sortBy, setSortBy] = useState<string>("recent")
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchCustomers = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   let query = supabase
    //     .from("customers")
    //     .select("*")
    //   
    //   if (sortBy === "recent") {
    //     query = query.order("created_at", { ascending: false })
    //   } else if (sortBy === "highest_spent") {
    //     query = query.order("total_spent", { ascending: false })
    //   } else if (sortBy === "most_orders") {
    //     query = query.order("orders_count", { ascending: false })
    //   }
    //   
    //   if (searchQuery) {
    //     query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    //   }
    //   
    //   const { data, error } = await query
    //   
    //   if (error) throw error
    //   
    //   return data
    // }
    
    // Simulate API call
    const fetchCustomers = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock customer data
      const mockCustomers: Customer[] = [
        {
          id: "cust1",
          email: "emma.wilson@example.com",
          first_name: "Emma",
          last_name: "Wilson",
          created_at: "2024-11-15T10:30:00Z",
          total_spent: 4750,
          orders_count: 3,
          last_order_date: "2025-03-05T14:20:00Z",
          avatar_url: "/images/avatars/emma.jpg"
        },
        {
          id: "cust2",
          email: "michael.brown@example.com",
          first_name: "Michael",
          last_name: "Brown",
          created_at: "2025-01-20T09:15:00Z",
          total_spent: 2500,
          orders_count: 1,
          last_order_date: "2025-01-20T09:15:00Z",
          avatar_url: "/images/avatars/michael.jpg"
        },
        {
          id: "cust3",
          email: "sophia.garcia@example.com",
          first_name: "Sophia",
          last_name: "Garcia",
          created_at: "2024-12-05T16:45:00Z",
          total_spent: 8200,
          orders_count: 5,
          last_order_date: "2025-02-28T11:30:00Z",
          avatar_url: "/images/avatars/sophia.jpg"
        },
        {
          id: "cust4",
          email: "william.johnson@example.com",
          first_name: "William",
          last_name: "Johnson",
          created_at: "2025-02-10T14:00:00Z",
          total_spent: 1200,
          orders_count: 1,
          last_order_date: "2025-02-10T14:00:00Z",
          avatar_url: "/images/avatars/william.jpg"
        },
        {
          id: "cust5",
          email: "olivia.davis@example.com",
          first_name: "Olivia",
          last_name: "Davis",
          created_at: "2024-10-25T08:30:00Z",
          total_spent: 6500,
          orders_count: 4,
          last_order_date: "2025-03-01T15:45:00Z",
          avatar_url: "/images/avatars/olivia.jpg"
        }
      ]
      
      // Apply filters and sorting
      let filteredCustomers = [...mockCustomers]
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredCustomers = filteredCustomers.filter(
          customer => 
            customer.first_name.toLowerCase().includes(query) || 
            customer.last_name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query)
        )
      }
      
      // Sort customers
      if (sortBy === "recent") {
        filteredCustomers.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      } else if (sortBy === "highest_spent") {
        filteredCustomers.sort((a, b) => b.total_spent - a.total_spent)
      } else if (sortBy === "most_orders") {
        filteredCustomers.sort((a, b) => b.orders_count - a.orders_count)
      }
      
      return filteredCustomers
    }
    
    fetchCustomers()
      .then(data => {
        setCustomers(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching customers:", error)
        setIsLoading(false)
      })
  }, [sortBy, searchQuery])
  
  // Define columns for customers table
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {row.original.avatar_url ? (
              <AvatarImage src={row.original.avatar_url} alt={`${row.original.first_name} ${row.original.last_name}`} />
            ) : null}
            <AvatarFallback>{row.original.first_name.charAt(0)}{row.original.last_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.first_name} {row.original.last_name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "orders_count",
      header: "Orders",
      cell: ({ row }) => row.original.orders_count
    },
    {
      accessorKey: "total_spent",
      header: "Total Spent",
      cell: ({ row }) => formatPrice(row.original.total_spent)
    },
    {
      accessorKey: "last_order_date",
      header: "Last Order",
      cell: ({ row }) => row.original.last_order_date ? formatDate(row.original.last_order_date) : "—"
    },
    {
      accessorKey: "created_at",
      header: "Customer Since",
      cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/customers/${row.original.id}`}>
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
          title="Customers" 
          description="Manage your customer base" 
        />
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest_spent">Highest Spent</SelectItem>
              <SelectItem value="most_orders">Most Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Loading customers...</div>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={customers} 
            searchKey="email"
          />
        )}
      </div>
    </div>
  )
}
