"use client"

import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { PageHeading } from "@/components/ui/page-heading"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutPage() {
  const { items, isLoading } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (!isLoading && (!items || items.length === 0)) {
      router.push("/cart")
    }
  }, [items, isLoading, router])

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading 
          title="Checkout" 
          description="Complete your purchase"
        />
        <div className="mt-8 flex justify-center">
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <PageHeading 
        title="Checkout" 
        description="Complete your purchase"
      />
      
      <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm user={user} />
        </div>
        <div className="lg:col-span-2">
          <CheckoutSummary items={items} />
        </div>
      </div>
    </div>
  )
}
