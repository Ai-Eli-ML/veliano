
import type { Metadata } from "next"
import { WishlistContent } from "@/components/wishlist/wishlist-content"

  title: "Wishlist",
  description: "View and manage your saved items",
}

export default function WishlistPage() {
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">My Wishlist</h1>
      <WishlistContent />
    </div>
  )
}

