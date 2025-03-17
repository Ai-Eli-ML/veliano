"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { Eye, Plus, Search } from "lucide-react"
import Link from "next/link"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Interface for affiliate data that matches Supabase structure
interface Affiliate {
  id: string
  name: string
  email: string
  status: "pending" | "approved" | "rejected"
  commission_rate: number
  total_earnings: number
  total_sales: number
  created_at: string
}

export default function AffiliatesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchAffiliates = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   let query = supabase
    //     .from("affiliates")
    //     .select("*")
    //     .order("created_at", { ascending: false })
    //   
    //   if (statusFilter !== "all") {
    //     query = query.eq("status", statusFilter)
    //   }
    //   
    //   if (searchQuery) {
    //     query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    //   }
    //   
    //   const { data, error } = await query
    //   
    //   if (error) throw error
    //   
    //   return data
    // }
    
    // Simulate API call
    const fetchAffiliates = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock affiliate data
      const mockAffiliates: Affiliate[] = [
        {
          id: "aff1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          status: "approved",
          commission_rate: 10,
          total_earnings: 2450,
          total_sales: 24500,
          created_at: "2025-01-15T10:30:00Z"
        },
        {
          id: "aff2",
          name: "Michael Chen",
          email: "michael@example.com",
          status: "pending",
          commission_rate: 8,
          total_earnings: 0,
          total_sales: 0,
          created_at: "2025-03-10T14:45:00Z"
        },
        {
          id: "aff3",
          name: "Jessica Williams",
          email: "jessica@example.com",
          status: "approved",
          commission_rate: 12,
          total_earnings: 3600,
          total_sales: 30000,
          created_at: "2024-12-05T09:15:00Z"
        },
        {
          id: "aff4",
          name: "David Brown",
          email: "david@example.com",
          status: "rejected",
          commission_rate: 0,
          total_earnings: 0,
          total_sales: 0,
          created_at: "2025-02-20T16:30:00Z"
        },
        {
          id: "aff5",
          name: "Emma Wilson",
          email: "emma@example.com",
          status: "approved",
          commission_rate: 10,
          total_earnings: 1200,
          total_sales: 12000,
          created_at: "2025-01-25T11:00:00Z"
        }
      ]
      
      // Apply filters
      let filteredAffiliates = mockAffiliates
      
      if (statusFilter !== "all") {
        filteredAffiliates = filteredAffiliates.filter(
          affiliate => affiliate.status === statusFilter
        )
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredAffiliates = filteredAffiliates.filter(
          affiliate => 
            affiliate.name.toLowerCase().includes(query) || 
            affiliate.email.toLowerCase().includes(query)
        )
      }
      
      return filteredAffiliates
    }
    
    fetchAffiliates()
      .then(data => {
        setAffiliates(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching affiliates:", error)
        setIsLoading(false)
      })
  }, [statusFilter, searchQuery])
  
  // Define columns for affiliates table
  const columns: ColumnDef<Affiliate>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      )
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === "approved" ? "success" :
              status === "pending" ? "outline" : "destructive"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: "commission_rate",
      header: "Commission",
      cell: ({ row }) => `${row.original.commission_rate}%`
    },
    {
      accessorKey: "total_earnings",
      header: "Earnings",
      cell: ({ row }) => formatPrice(row.original.total_earnings)
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/affiliates/${row.original.id}`}>
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
          title="Affiliate Management" 
          description="Manage affiliate partners and track performance" 
        />
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Affiliate
        </Button>
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search affiliates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Loading affiliates...</div>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={affiliates} 
          />
        )}
      </div>
    </div>
  )
}
