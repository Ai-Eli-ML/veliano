import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { completeOrder } from "@/app/actions/payment"

export const metadata = {
  title: "Order Confirmed - Veliano Jewelry",
  description: "Your order has been confirmed and is being processed",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  if (searchParams.session_id) {
    await completeOrder(searchParams.session_id)
  }

  return (
    <div className="container max-w-lg py-20">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email with your order details.
          </p>
          <div className="pt-4">
            <Button asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
