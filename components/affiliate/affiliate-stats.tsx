import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { AffiliateStats as AffiliateStatsType } from "@/types/affiliate"

interface AffiliateStatsProps {
  stats: AffiliateStatsType
}

export function AffiliateStats({ stats }: AffiliateStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
          <p className="text-xs text-muted-foreground">Lifetime earnings from referrals</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.pendingEarnings)}</div>
          <p className="text-xs text-muted-foreground">Available for payout</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversions}</div>
          <p className="text-xs text-muted-foreground">Total referred orders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Clicks that convert to sales</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>Your affiliate earnings over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Earnings chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

