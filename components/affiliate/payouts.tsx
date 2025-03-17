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

interface PayoutsProps {
  affiliate: any // TODO: Add proper type
}

export function Payouts({ affiliate }: PayoutsProps) {
  const payouts = [
    {
      id: "PAY-001",
      amount: 299.99,
      method: "PayPal",
      status: "completed",
      date: "2024-03-01",
    },
    {
      id: "PAY-002",
      amount: 499.99,
      method: "Bank Transfer",
      status: "pending",
      date: "2024-03-15",
    },
    // Add more sample data as needed
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>{payout.id}</TableCell>
                <TableCell>${payout.amount.toFixed(2)}</TableCell>
                <TableCell>{payout.method}</TableCell>
                <TableCell>
                  <Badge
                    variant={payout.status === "completed" ? "default" : "secondary"}
                  >
                    {payout.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 