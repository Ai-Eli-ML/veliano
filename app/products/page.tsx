import type { Metadata } from "next"
import { getProducts, getCategories } from "@/lib/products"
import ProductGrid from "@/components/products/product-grid"
import ProductFilters from "@/components/products/product-filters"
import ProductSort from "@/components/products/product-sort"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our collection of premium custom gold grillz and jewelry",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params
  const category = searchParams.category as string | undefined
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const sort = searchParams.sort as "price_asc" | "price_desc" | "newest" | "featured" | undefined
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search as string | undefined

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
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">All Products</h1>

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
        </div>
      </div>
    </div>
  )
}

