"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import type { AmbassadorProfile } from "@/types/ambassador"
import type { Order } from "@/types/order"

interface AmbassadorSalesProps {
  ambassador: AmbassadorProfile
}

export function AmbassadorSales({ ambassador }: AmbassadorSalesProps) {
  const supabase = createClientComponentClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (!ambassador.discount_code) {
          setOrders([])
          return
        }

        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("referral_code", ambassador.discount_code)
          .order("created_at", { ascending: false })

        if (ordersError) {
          throw ordersError
        }

        setOrders(orders || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [ambassador.discount_code, supabase])

  useEffect(() => {
    // Prepare chart data
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        sales: 0,
        earnings: 0,
      }
    }).reverse()

    // Group orders by month
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at)
      const monthYear = `${orderDate.toLocaleString("default", { month: "short" })} ${orderDate.getFullYear()}`

      const monthData = last6Months.find((m) => `${m.month} ${m.year}` === monthYear)
      if (monthData) {
        monthData.sales += order.total
        monthData.earnings += order.total * (ambassador.commission_rate / 100)
      }
    })

    setChartData(last6Months)
  }, [orders, ambassador.commission_rate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={(data) => `${data.month} ${data.year}`} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" name="Sales" />
                <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No sales yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.email.split("@")[0].substring(0, 2)}***@{order.email.split("@")[1]}
                    </TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      {formatCurrency(order.total * (ambassador.commission_rate / 100))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

