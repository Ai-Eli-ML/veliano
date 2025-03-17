"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
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
import { useState } from "react"

export function AffiliateTransactions() {
  const [timeframe, setTimeframe] = useState("all")
  
  // In a real app, this data would come from an API
  const transactions = [
    {
      id: "TX123456",
      date: "2023-11-15",
      customer: "John D.",
      amount: 12500,
      commission: 1250,
      status: "Paid",
    },
    {
      id: "TX123457",
      date: "2023-11-10",
      customer: "Sarah M.",
      amount: 8900,
      commission: 890,
      status: "Paid",
    },
    {
      id: "TX123458",
      date: "2023-11-05",
      customer: "Robert K.",
      amount: 15000,
      commission: 1500,
      status: "Paid",
    },
    {
      id: "TX123459",
      date: "2023-10-28",
      customer: "Emily L.",
      amount: 22000,
      commission: 2200,
      status: "Paid",
    },
    {
      id: "TX123460",
      date: "2023-10-15",
      customer: "Michael P.",
      amount: 9500,
      commission: 950,
      status: "Paid",
    },
    {
      id: "TX123461",
      date: "2023-12-01",
      customer: "Jessica T.",
      amount: 18000,
      commission: 1800,
      status: "Pending",
    },
    {
      id: "TX123462",
      date: "2023-12-03",
      customer: "David R.",
      amount: 7500,
      commission: 750,
      status: "Pending",
    },
  ]
  
  // Filter transactions based on timeframe
  const filteredTransactions = transactions.filter(transaction => {
    if (timeframe === "all") return true
    
    const txDate = new Date(transaction.date)
    const now = new Date()
    
    if (timeframe === "month") {
      return txDate.getMonth() === now.getMonth() && 
             txDate.getFullYear() === now.getFullYear()
    }
    
    if (timeframe === "quarter") {
      const txQuarter = Math.floor(txDate.getMonth() / 3)
      const nowQuarter = Math.floor(now.getMonth() / 3)
      return txQuarter === nowQuarter && 
             txDate.getFullYear() === now.getFullYear()
    }
    
    if (timeframe === "year") {
      return txDate.getFullYear() === now.getFullYear()
    }
    
    return true
  })
  
  // Calculate totals
  const totalCommission = filteredTransactions.reduce(
    (sum, tx) => sum + tx.commission, 
    0
  )
  
  const pendingCommission = filteredTransactions
    .filter(tx => tx.status === "Pending")
    .reduce((sum, tx) => sum + tx.commission, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-muted-foreground">
            View your commission history and pending payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Commission ({filteredTransactions.length} transactions)</CardDescription>
            <CardTitle className="text-3xl">{formatPrice(totalCommission)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total commission earned in selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Commission</CardDescription>
            <CardTitle className="text-3xl">{formatPrice(pendingCommission)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Commission that has not been paid out yet
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Detailed record of your affiliate commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Order Amount</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono">{tx.id}</TableCell>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>{tx.customer}</TableCell>
                  <TableCell className="text-right">{formatPrice(tx.amount)}</TableCell>
                  <TableCell className="text-right">{formatPrice(tx.commission)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      tx.status === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No transactions found for the selected period
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
