"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  imageSrc: string
  category: string
  url?: string
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  imageSrc,
  category,
  url,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const productUrl = url || `/products/${category}/${slug}`
  const discountPercentage = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      image: imageSrc,
    })

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    })
  }

  return (
    <div className="product-card group relative flex flex-col overflow-hidden rounded-lg border">
      {/* Product Image */}
      <Link href={productUrl} className="aspect-square overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg?height=400&width=400"}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Quick Add Button */}
      <div className="absolute bottom-[72px] left-0 right-0 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button size="sm" className="metallic-button" aria-label={`Add ${name} to cart`} onClick={handleQuickAdd}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Quick Add
        </Button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={productUrl} className="mb-1 line-clamp-1 font-medium hover:underline">
          {name}
        </Link>

        <div className="mt-auto flex items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold">{formatCurrency(price)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm text-gray-500 line-through">{formatCurrency(compareAtPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

