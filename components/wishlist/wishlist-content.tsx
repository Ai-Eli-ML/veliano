"use client"

import { useWishlist } from "@/hooks/use-wishlist"
import { WishlistItem } from "@/components/wishlist/wishlist-item"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"

export function WishlistContent() {
  const { items, clearWishlist } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mb-2 text-xl font-medium">Your wishlist is empty</h2>
        <p className="mb-6 text-center text-muted-foreground">
          Looks like you haven&apos;t added anything to your wishlist yet.
        </p>
        <Button asChild className="metallic-button">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Start Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <p className="text-muted-foreground">{items.length} items in your wishlist</p>
        <Button variant="outline" size="sm" onClick={clearWishlist}>
          Clear Wishlist
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <WishlistItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

