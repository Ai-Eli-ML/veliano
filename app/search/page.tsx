"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Pagination } from "@/components/ui/pagination"
import { ProductGrid } from "@/components/product/product-grid"
import { Skeleton } from "@/components/ui/skeleton"
import SearchResults from "@/components/search/search-results"
import { searchProducts } from '@/lib/actions/product-actions'
import ProductGridSkeleton from '@/components/products/product-grid-skeleton'
import SearchForm from '@/components/search/search-form'
import { ProductWithRelations } from '@/types/product'

export const metadata = {
  title: 'Search - Veliano Jewelry',
  description: 'Search for luxury jewelry and custom grillz in our collection'
}

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const searchQuery = searchParams.q || ''
  const page = Number(searchParams.page || '1')
  const limit = 16
  const offset = (page - 1) * limit

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Products</h1>
        <SearchForm defaultValue={searchQuery} />
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResultsContent
          query={searchQuery}
          page={page}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </main>
  )
}

async function SearchResultsContent({
  query,
  page,
  limit,
  offset
}: {
  query: string
  page: number
  limit: number
  offset: number
}) {
  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Enter a search term to find products</p>
      </div>
    )
  }

  const result = await searchProducts(query, { limit, offset })
  
  // Type guard to ensure we have products
  let products: ProductWithRelations[] = []
  if (result.success && result.products) {
    products = result.products
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-medium">
          {result.success ? (
            `Search results for "${query}" (${result.total} ${
              result.total === 1 ? 'product' : 'products'
            })`
          ) : (
            `Search results for "${query}"`
          )}
        </h2>
      </div>

      {result.success ? (
        <ProductGrid
          products={products}
          emptyMessage={`No products found matching "${query}"`}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Error searching for products</p>
          <p className="text-gray-500 mt-2">{result.error}</p>
        </div>
      )}

      {/* Pagination would go here */}
    </div>
  )
}
