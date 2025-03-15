import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

