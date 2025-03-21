"use client"

import { Loader2 } from "lucide-react"

export default function CheckoutSuccessLoading() {
  return (
    <div className="container max-w-screen-xl py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <h2 className="mt-4 text-lg font-medium">Loading...</h2>
      </div>
    </div>
  )
}






