"use client"

import type { Metadata } from "next"
import { getProducts, getCategories } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import ProductFilters from "@/components/products/product-filters"
import ProductSort from "@/components/products/product-sort"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductsHeader } from "@/components/product/products-header"
import { Pagination } from "@/components/ui/pagination"

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our collection of premium custom gold grillz and jewelry",
}

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: {
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: "price_asc" | "price_desc" | "newest" | "featured"
    page?: string
    search?: string
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Parse search params safely
  const category = searchParams?.category
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined
  const sort = searchParams?.sort as "price_asc" | "price_desc" | "newest" | "featured" | undefined
  const page = searchParams?.page ? Number(searchParams.page) : 1
  const search = searchParams?.search

  try {
    // Fetch products and categories
    const { products, total, totalPages } = await getProducts({
      category,
      minPrice,
      maxPrice,
      sort,
      page,
      search,
    })

    const categories = await getCategories()

    return (
      <div className="container mx-auto px-4 py-8">
        <ProductsHeader />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
          {/* Filters Sidebar */}
          <div>
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
              <ProductFilters categories={categories} />
            </Suspense>
          </div>

          {/* Products */}
          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-muted-foreground">
                Showing {products.length} of {total} products
              </p>
              <ProductSort />
            </div>

            <Suspense fallback={<Skeleton className="h-[800px] w-full" />}>
              <ProductGrid products={products} currentPage={page} totalPages={totalPages} />
            </Suspense>

            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    )
  }
}

