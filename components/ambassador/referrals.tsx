"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

interface ReferralsProps {
  referrals: Referral[]
}

export function Referrals({ referrals }: ReferralsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Commission Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No referrals found.
                </TableCell>
              </TableRow>
            ) : (
              referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.order_id}</TableCell>
                  <TableCell>${referral.order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>${referral.commission_amount.toFixed(2)}</TableCell>
                  <TableCell>{referral.order.status}</TableCell>
                  <TableCell>{referral.status}</TableCell>
                  <TableCell>
                    {new Date(referral.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 