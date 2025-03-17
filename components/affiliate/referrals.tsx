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
import { Badge } from "@/components/ui/badge"

interface ReferralsProps {
  affiliate: any // TODO: Add proper type
}

export function Referrals({ affiliate }: ReferralsProps) {
  const referrals = [
    {
      id: "REF-001",
      customer: "John Doe",
      product: "Gold Grillz Set",
      amount: 299.99,
      commission: 29.99,
      status: "completed",
      date: "2024-03-15",
    },
    {
      id: "REF-002",
      customer: "Jane Smith",
      product: "Diamond Pendant",
      amount: 499.99,
      commission: 49.99,
      status: "pending",
      date: "2024-03-14",
    },
    // Add more sample data as needed
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.id}</TableCell>
                <TableCell>{referral.customer}</TableCell>
                <TableCell>{referral.product}</TableCell>
                <TableCell>${referral.amount.toFixed(2)}</TableCell>
                <TableCell>${referral.commission.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={referral.status === "completed" ? "default" : "secondary"}
                  >
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 