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
import { Button } from "@/components/ui/button"

interface Payout {
  id: string
  amount: number
  status: "pending" | "paid" | "failed"
  created_at: string
  paid_at: string | null
  method: string
}

interface PayoutsProps {
  payouts: Payout[]
  onRequestPayout: () => void
  minimumPayoutAmount: number
  availableBalance: number
}

export function Payouts({
  payouts,
  onRequestPayout,
  minimumPayoutAmount,
  availableBalance,
}: PayoutsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">${availableBalance.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">
                Minimum payout amount: ${minimumPayoutAmount.toFixed(2)}
              </p>
            </div>
            <Button
              onClick={onRequestPayout}
              disabled={availableBalance < minimumPayoutAmount}
            >
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No payouts found.
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>${payout.amount.toFixed(2)}</TableCell>
                    <TableCell>{payout.status}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      {new Date(payout.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {payout.paid_at
                        ? new Date(payout.paid_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 