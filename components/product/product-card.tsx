'use client'

import { Product } from "@/lib/products"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || '/placeholder.svg'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-all hover:scale-105"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-2 p-4">
        <Link href={`/products/${product.slug}`} className="line-clamp-1">
          <h3 className="font-semibold tracking-tight">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <p className="font-semibold">{formatPrice(product.price)}</p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${product.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 