"use client"

import Image from "next/image"
import Link from "next/link"
import { useWishlist, type WishlistItem as WishlistItemType } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Trash2, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WishlistItemProps {
  item: WishlistItemType
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { removeItem } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleRemove = () => {
    removeItem(item.productId)
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist",
    })
  }

  const handleAddToCart = () => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border">
      {/* Product Image */}
      <Link href={`/products/${item.category}/${item.slug}`} className="aspect-square overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg?height=400&width=400"}
          alt={item.name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm transition-opacity hover:bg-white"
        aria-label="Remove from wishlist"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/products/${item.category}/${item.slug}`}
          className="mb-1 line-clamp-1 font-medium hover:underline"
        >
          {item.name}
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold">{formatCurrency(item.price)}</span>
          <Button size="sm" onClick={handleAddToCart} className="metallic-button">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

