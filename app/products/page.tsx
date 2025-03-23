import { Suspense } from "react"
import { ProductRepository } from "@/lib/repositories/product-repository"
import { Pagination } from "@/components/ui/pagination"
import ProductCard from "@/components/products/product-card"
import { ProductSort } from "@/components/products/product-sort"
import ProductsFilter from "@/components/products/products-filter"
import ProductGridSkeleton from "@/components/products/product-grid-skeleton"
import { ProductsHeader } from "@/components/product/products-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts, getCategories } from "@/lib/products"
import type { ProductWithRelations } from "@/types/product"

export const metadata = {
  title: 'Products | Veliano Jewelry',
  description: 'Explore our collection of custom grillz and luxury jewelry.',
}

interface ProductsPageProps {
  searchParams: {
    page?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    category?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse search params
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'newest'
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const category = searchParams.category
  
  // Set up options for fetching products
  const options = {
    limit: 12,
    offset: (page - 1) * 12,
    status: 'active' as const,
  }
  
  // Try to fetch products
  let products: ProductWithRelations[] = []
  let total = 0
  
  try {
    const result = await ProductRepository.getProducts(options)
    products = result.products
    total = result.total
  } catch (error) {
    console.error("Error fetching products:", error)
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(total / options.limit)
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-lg" />}>
            <ProductsFilter 
              minPrice={searchParams.minPrice} 
              maxPrice={searchParams.maxPrice} 
              selectedCategory={category} 
            />
          </Suspense>
        </div>
        
        {/* Products grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {products.length} of {total} products
            </p>
            <Suspense fallback={<div className="w-48 h-10 bg-muted animate-pulse rounded-md" />}>
              <ProductSort currentSort={sort} />
            </Suspense>
          </div>
          
          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="border p-4 rounded-lg">
                    <h2 className="font-bold">{product.name}</h2>
                    <p className="text-muted-foreground truncate">{product.description}</p>
                    <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </Suspense>
          
          {totalPages > 1 && (
            <div className="mt-10">
              <div className="flex justify-center">
                <span className="text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
