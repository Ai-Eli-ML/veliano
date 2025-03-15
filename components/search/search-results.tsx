"use client"

import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types/product"

interface SearchResultsProps {
  results: Product[]
  onResultClick: (url: string) => void
}

export function SearchResults({ results, onResultClick }: SearchResultsProps) {
  if (results.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {results.map((product) => {
        // Get the primary category for the product URL
        const primaryCategory = product.categories && product.categories.length > 0 ? product.categories[0] : null

        const productUrl = primaryCategory
          ? `/products/${primaryCategory.slug}/${product.slug}`
          : `/products/uncategorized/${product.slug}`

        // Get the primary image
        const primaryImage =
          product.images && product.images.length > 0
            ? product.images.sort((a, b) => (a.position || 0) - (b.position || 0))[0].url
            : "/placeholder.svg?height=80&width=80"

        return (
          <div
            key={product.id}
            className="flex cursor-pointer items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            onClick={() => onResultClick(productUrl)}
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
              <Image src={primaryImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium line-clamp-1">{product.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">{primaryCategory?.name || "Uncategorized"}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(product.price)}</div>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <div className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.compare_at_price)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

