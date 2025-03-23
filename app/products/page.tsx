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
  
  // Compute options for repository
  const options: { 
    limit: number;
    offset: number;
    status: 'active'; 
    featured?: boolean;
    category_id?: string;
  } = {
    limit: 12,
    offset: (page - 1) * 12,
    status: 'active',
  }
  
  // Set featured flag for sorting
  if (sort === 'featured') {
    options.featured = true
  }
  
  // Fetch products
  const { products, total } = await ProductRepository.getProducts(options)
  
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
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>
          
          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                baseUrl="/products" 
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
