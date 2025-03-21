"use client"

import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-screen-xl py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Order Successful!</h1>
          <p className="text-lg text-muted-foreground">Your order has been placed</p>
        </div>
        
        <p className="mt-6 text-lg text-gray-600">
          Thank you for your purchase. We've sent you an email with the order details
          and tracking information. Your items will be shipped soon.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
