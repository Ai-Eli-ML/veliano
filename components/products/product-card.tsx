"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { ProductWithRelations } from '@/types/product'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: ProductWithRelations
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const thumbnailImage = product.images?.find(img => img.is_thumbnail) || product.images?.[0]
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: thumbnailImage?.url || "/placeholder.svg?height=400&width=400",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-square relative mb-3">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{product.name}</h3>
        
        <div className="flex gap-2">
          {product.is_custom_order && (
            <Badge variant="secondary">Custom Order</Badge>
          )}
          {product.requires_impression_kit && (
            <Badge variant="outline">Requires Impression</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">
            {formatPrice(product.price)}
          </p>
          {product.base_production_time && (
            <p className="text-sm text-gray-500">
              ~{product.base_production_time} days
            </p>
          )}
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="absolute bottom-[72px] left-0 right-0 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button size="sm" className="metallic-button" aria-label={`Add ${product.name} to cart`} onClick={handleQuickAdd}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Quick Add
        </Button>
      </div>
    </div>
  )
}

