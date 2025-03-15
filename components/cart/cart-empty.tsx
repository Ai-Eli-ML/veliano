import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10">
      <div className="mb-4 rounded-full bg-primary/10 p-3">
        <ShoppingBag className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
      <p className="mb-6 text-center text-muted-foreground">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
      <Button asChild className="metallic-button">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  )
}

