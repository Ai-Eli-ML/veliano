'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Order {
  id: string
  created_at: string
  total_price: number
  payment_status: string
  fulfillment_status: string
}

interface OrderHistoryProps {
  userId: string
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/orders`)
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading orders...</p>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No orders found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Order #{order.id.substring(0, 8)}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>
                  {order.payment_status}
                </Badge>
                <Badge
                  variant={
                    order.fulfillment_status === 'fulfilled'
                      ? 'default'
                      : order.fulfillment_status === 'processing'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {order.fulfillment_status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {format(new Date(order.created_at), 'PPP')}
              </div>
              <div className="font-medium">
                ${order.total_price.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 