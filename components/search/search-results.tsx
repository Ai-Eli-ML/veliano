"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Pagination } from "@/components/ui/pagination"
import { ProductGrid } from "@/components/product/product-grid"
import { Skeleton } from "@/components/ui/skeleton"

// Export as both default and named export
export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = useState(true)
  
  // Mock data for search results
  const mockProducts = Array.from({ length: 4 }).map((_, i) => ({
    id: `search-${i}`,
    name: `${query} Product ${i + 1}`,
    price: 129.99 + i,
    category: 'jewelry',
    image: `https://source.unsplash.com/random/300x300?jewelry&${i}`,
    slug: `${query.toLowerCase().replace(/\s+/g, '-')}-product-${i + 1}`,
    rating: 4.5,
    reviewCount: 8
  }))
  
  const currentPage = 1
  const totalPages = 1
  const totalItems = mockProducts.length

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [query])

  return (
    <>
      <div className="flex flex-col gap-4 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {query ? `Search results for "${query}"` : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {isLoading 
            ? "Searching..." 
            : mockProducts.length 
              ? `Found ${mockProducts.length} results` 
              : "No products found"}
        </p>
      </div>
      
      {isLoading ? (
        <SearchSkeleton />
      ) : (
        <>
          <ProductGrid 
            products={mockProducts} 
            currentPage={currentPage} 
            totalPages={totalPages} 
          />
          {mockProducts.length > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              totalItems={totalItems} 
            />
          )}
        </>
      )}
    </>
  )
}

// Also export as default
export default SearchResults;

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

