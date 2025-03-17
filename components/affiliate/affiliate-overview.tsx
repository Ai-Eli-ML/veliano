"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

export function AffiliateOverview() {
  // In a real app, this data would come from an API
  const stats = {
    totalEarnings: 125000, // $1,250.00
    pendingPayment: 45000, // $450.00
    clickCount: 1243,
    conversionRate: 3.2,
    activeReferrals: 28,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-3xl">{formatPrice(stats.totalEarnings)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings from your affiliate links
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payment</CardDescription>
            <CardTitle className="text-3xl">{formatPrice(stats.pendingPayment)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Amount available for your next payout
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Referrals</CardDescription>
            <CardTitle className="text-3xl">{stats.activeReferrals}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Customers who signed up with your code
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Your affiliate link performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Clicks</p>
                  <p className="text-xs text-muted-foreground">
                    Number of clicks on your affiliate links
                  </p>
                </div>
                <p className="text-2xl font-bold">{stats.clickCount}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground">
                    Percentage of clicks that resulted in a purchase
                  </p>
                </div>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>Your current commission rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Standard Products</p>
                  <p className="text-xs text-muted-foreground">
                    Commission on regular product sales
                  </p>
                </div>
                <p className="text-2xl font-bold">10%</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Premium Products</p>
                  <p className="text-xs text-muted-foreground">
                    Commission on premium product sales
                  </p>
                </div>
                <p className="text-2xl font-bold">15%</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Subscriptions</p>
                  <p className="text-xs text-muted-foreground">
                    Commission on subscription sign-ups
                  </p>
                </div>
                <p className="text-2xl font-bold">20%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 