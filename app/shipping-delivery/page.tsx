import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ShippingTabs from '@/components/shipping/shipping-tabs'

export default function ShippingDeliveryPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shipping & Delivery</h1>
          <p className="text-muted-foreground">
            Information about our shipping methods, delivery times, and policies.
          </p>
        </div>

        <ShippingTabs />

        <Card>
          <CardHeader>
            <CardTitle>Shipping Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                Most orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Tracking Information</h3>
              <p className="text-sm text-muted-foreground">
                You will receive a shipping confirmation email with tracking information once your order has been shipped.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Delivery Delays</h3>
              <p className="text-sm text-muted-foreground">
                Delivery times may be affected by weather conditions, holidays, or other unforeseen circumstances. We are not responsible for shipping delays once the package has left our facility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}






