import { createClient } from "@/lib/supabase/client"
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { toast } from "sonner"

interface Referral {
  id: string
  order_id: string
  commission_amount: number
  status: "pending" | "paid" | "cancelled"
  created_at: string
  order: {
    total_amount: number
    status: string
  }
}

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
    phone: string | null
  }
  referrals: Referral[]
}

const AFFILIATE_STATUSES = ["active", "pending", "inactive"]
const REFERRAL_STATUSES = ["pending", "paid", "cancelled"]

export default function AffiliateDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAffiliate()
  }, [params.id])

  async function fetchAffiliate() {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          ),
          referrals (
            *,
            order:orders (
              total_amount,
              status
            )
          )
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error
      setAffiliate(data)
    } catch (error) {
      console.error("Error fetching affiliate:", error)
      toast.error("Error loading affiliate")
    } finally {
      setLoading(false)
    }
  }

  async function updateAffiliateStatus(newStatus: "active" | "pending" | "inactive") {
    if (!affiliate) return

    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ status: newStatus })
        .eq("id", affiliate.id)

      if (error) throw error
      
      setAffiliate({ ...affiliate, status: newStatus })
      toast.success("Affiliate status updated successfully")
    } catch (error) {
      console.error("Error updating affiliate status:", error)
      toast.error("Error updating affiliate status")
    }
  }

  async function updateReferralStatus(referralId: string, newStatus: "pending" | "paid" | "cancelled") {
    try {
      const { error } = await supabase
        .from("referrals")
        .update({ status: newStatus })
        .eq("id", referralId)

      if (error) throw error
      fetchAffiliate()
      toast.success("Referral status updated successfully")
    } catch (error) {
      console.error("Error updating referral status:", error)
      toast.error("Error updating referral status")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!affiliate) {
    return <div>Affiliate not found</div>
  }

  const pendingCommission = affiliate.referrals
    .filter(ref => ref.status === "pending")
    .reduce((sum, ref) => sum + ref.commission_amount, 0)

  const paidCommission = affiliate.referrals
    .filter(ref => ref.status === "paid")
    .reduce((sum, ref) => sum + ref.commission_amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Affiliate Details</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/affiliates")}
        >
          Back to Affiliates
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{affiliate.profiles.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{affiliate.profiles.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span>{affiliate.profiles.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Affiliate Code</span>
              <code className="rounded bg-muted px-2 py-1">
                {affiliate.code}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission Rate</span>
              <span>{(affiliate.commission_rate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Select
                value={affiliate.status}
                onValueChange={(value: "active" | "pending" | "inactive") => 
                  updateAffiliateStatus(value)
                }
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="font-medium">${affiliate.total_sales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Commission</span>
              <span className="font-medium">${affiliate.total_commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Commission</span>
              <span className="font-medium">${pendingCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid Commission</span>
              <span className="font-medium">${paidCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Referrals</span>
              <span className="font-medium">{affiliate.referrals.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Order Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliate.referrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No referrals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  affiliate.referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>{referral.order_id}</TableCell>
                      <TableCell>
                        {new Date(referral.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ${referral.order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${referral.commission_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            referral.order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {referral.order.status.charAt(0).toUpperCase() + 
                            referral.order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={referral.status}
                          onValueChange={(value: "pending" | "paid" | "cancelled") => 
                            updateReferralStatus(referral.id, value)
                          }
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {REFERRAL_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 