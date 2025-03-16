import { createClient } from "@/lib/supabase/client"
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search } from "lucide-react"

interface Affiliate {
  id: string
  user_id: string
  code: string
  commission_rate: number
  status: "active" | "pending" | "inactive"
  total_sales: number
  total_commission: number
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

const AFFILIATE_STATUSES = ["all", "active", "pending", "inactive"]

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    fetchAffiliates()
  }, [statusFilter])

  async function fetchAffiliates() {
    try {
      const query = supabase
        .from("affiliates")
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query.eq("status", statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setAffiliates(data || [])
    } catch (error) {
      console.error("Error fetching affiliates:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateAffiliateStatus(affiliateId: string, newStatus: "active" | "pending" | "inactive") {
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ status: newStatus })
        .eq("id", affiliateId)

      if (error) throw error
      fetchAffiliates()
    } catch (error) {
      console.error("Error updating affiliate status:", error)
    }
  }

  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    affiliate.profiles.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    affiliate.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Affiliates</h1>
        <Button asChild>
          <Link href="/admin/affiliates/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Affiliate
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search affiliates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {AFFILIATE_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Total Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAffiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No affiliates found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>{affiliate.profiles.full_name}</TableCell>
                  <TableCell>{affiliate.profiles.email}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1">
                      {affiliate.code}
                    </code>
                  </TableCell>
                  <TableCell>{(affiliate.commission_rate * 100).toFixed(0)}%</TableCell>
                  <TableCell>${affiliate.total_sales.toFixed(2)}</TableCell>
                  <TableCell>${affiliate.total_commission.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={affiliate.status}
                      onValueChange={(value: "active" | "pending" | "inactive") => 
                        updateAffiliateStatus(affiliate.id, value)
                      }
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AFFILIATE_STATUSES.filter(status => status !== "all").map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/affiliates/${affiliate.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}