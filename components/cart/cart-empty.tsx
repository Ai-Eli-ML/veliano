"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CartEmpty() {
  return (
    <div className="container flex flex-col items-center justify-center py-16 space-y-6 text-center">
      <div className="rounded-full bg-muted p-6">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
      </div>
      <Button size="lg" asChild>
        <Link href="/products">
          Continue Shopping
        </Link>
      </Button>
    </div>
  )
}

