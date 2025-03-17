#!/bin/bash

# Initialize log file
LOG_FILE="checkout-pages-fixes-log.txt"
echo "Starting checkout pages fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Fix checkout page
fix_checkout_page() {
  local checkout_page="./app/checkout/page.tsx"
  
  if [ -f "$checkout_page" ]; then
    log_message "Fixing $checkout_page"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper component
    cat > "$temp_file" << EOF
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
EOF
    
    # Replace the original file
    mv "$temp_file" "$checkout_page"
    log_message "Fixed $checkout_page"
  else
    log_message "Checkout page not found: $checkout_page"
  fi
}

# Fix checkout success page
fix_checkout_success_page() {
  local success_page="./app/checkout/success/page.tsx"
  
  if [ -f "$success_page" ]; then
    log_message "Fixing $success_page"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper component
    cat > "$temp_file" << EOF
"use client"

import { Button } from "@/components/ui/button"
import { PageHeading } from "@/components/ui/page-heading"
import { useCart } from "@/hooks/use-cart"
import { CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams?.get("orderId")
  
  useEffect(() => {
    // Clear the cart upon successful order
    clearCart()
  }, [clearCart])

  return (
    <div className="container max-w-screen-xl py-16">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
        
        <PageHeading
          title="Order Successful!"
          description={orderId ? \`Order #\${orderId} has been placed\` : "Your order has been placed"}
          className="mt-6"
        />
        
        <p className="mt-6 text-lg text-gray-600">
          Thank you for your purchase. We've sent you an email with the order details
          and tracking information. Your items will be shipped soon.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {orderId && (
            <Button asChild>
              <Link href={"/account/orders/" + orderId}>
                View Order
              </Link>
            </Button>
          )}
          
          <Button asChild variant="outline">
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$success_page"
    log_message "Fixed $success_page"
  else
    log_message "Checkout success page not found: $success_page"
  fi
}

# Run the fixes
log_message "Starting checkout pages fixes..."
fix_checkout_page
fix_checkout_success_page
log_message "Completed checkout pages fixes at $(date)" 