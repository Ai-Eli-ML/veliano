"use client"

import { Pagination } from "@/components/ui/pagination"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductsHeader } from "@/components/product/products-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { getProducts, getCategories } from "@/lib/products"

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  // Mock data for products
  const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
    id: `product-${i}`,
    name: `Product ${i + 1}`,
    price: 99.99 + i,
    category: 'jewelry',
    image: `https://source.unsplash.com/random/300x300?jewelry&${i}`,
    slug: `product-${i + 1}`,
    rating: 4.5,
    reviewCount: 12
  }))
  
  const currentPage = 1
  const totalPages = 3
  const totalItems = 24

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 lg:py-16">
      <ProductsHeader />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid 
          products={mockProducts} 
          currentPage={currentPage} 
          totalPages={totalPages} 
        />
      </Suspense>
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        totalItems={totalItems} 
      />
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
