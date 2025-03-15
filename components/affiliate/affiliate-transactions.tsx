"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface AffiliateTransactionsProps {
  affiliateId: string
}

export function AffiliateTransactions({ affiliateId }: AffiliateTransactionsProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = createClientSupabaseClient()

        const { data, error } = await supabase
          .from("affiliate_transactions")
          .select(`
            *,
            orders:orders(order_number, total_price)
          `)
          .eq("affiliate_id", affiliateId)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setTransactions(data || [])
      } catch (err) {
        console.error("Error fetching affiliate transactions:", err)
        setError("Failed to load transactions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [affiliateId])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Your affiliate transaction history</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground">Start sharing your affiliate links to earn commissions</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Your affiliate transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {formatDate(transaction.created_at, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {transaction.orders ? (
                    <div>
                      <div className="font-medium">#{transaction.orders.order_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(transaction.orders.total_price)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Manual adjustment</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "paid"
                        ? "default"
                        : transaction.status === "pending"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

