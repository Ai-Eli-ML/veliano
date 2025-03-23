"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Heart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import type { ProductWithRelations } from "@/types/product"

interface ProductCardProps {
  product: ProductWithRelations
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // Get the first image or use a placeholder
  const productImage = product.images && product.images.length > 0
    ? product.images[0].url
    : null
  
  // Calculate the correct product URL
  const productUrl = `/products/${product.category?.slug || "all"}/${product.slug}`
  
  // Handle quick add to cart
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    
    // Simulate adding to cart
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
    }, 600)
  }
  
  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <Link href={productUrl} className="relative">
        <div className="overflow-hidden">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            {productImage ? (
              <Image
                src={productImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </AspectRatio>
        </div>
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <Badge variant="secondary" className="text-xs">New</Badge>
          )}
          {product.featured && (
            <Badge variant="outline" className="bg-white bg-opacity-90 text-xs">Featured</Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4 flex-grow">
        <Link href={productUrl} className="block">
          <h3 className="font-medium text-base line-clamp-1 mb-1 hover:underline">
            {product.name}
          </h3>
          <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {product.description}
          </div>
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-semibold">
          {formatCurrency(product.price)}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="ml-2 text-sm line-through text-muted-foreground">
              {formatCurrency(product.compare_at_price)}
            </span>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleQuickAdd}
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Add to cart</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

