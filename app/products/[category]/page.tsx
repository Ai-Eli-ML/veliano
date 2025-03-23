import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { getProducts, getCategories, getCategoryBySlug } from "@/lib/products"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { ProductRepository } from "@/lib/repositories/product-repository"
import { CategoryRepository } from "@/lib/repositories/category-repository"
import { Pagination } from "@/components/ui/pagination"
import ProductCard from "@/components/products/product-card"
import { ProductSort } from "@/components/products/product-sort"
import ProductsFilter from "@/components/products/products-filter"
import ProductGridSkeleton from "@/components/products/product-grid-skeleton"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    page?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await CategoryRepository.getBySlug(params.category)
  
  if (!category) {
    return {
      title: 'Category Not Found - Veliano Jewelry',
      description: 'The requested category could not be found.'
    }
  }

  return {
    title: `${category.name} - Veliano Jewelry`,
    description: category.description || `Browse our collection of ${category.name}`
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Try to get the category
  const category = await CategoryRepository.getBySlug(params.category)
  
  // If category doesn't exist, 404
  if (!category) {
    notFound()
  }
  
  // Parse search params
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'newest'
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  
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
    category_id: category.id,
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
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mb-6">{category.description}</p>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-lg" />}>
            <ProductsFilter 
              minPrice={searchParams.minPrice}
              maxPrice={searchParams.maxPrice}
              selectedCategory={params.category}
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
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any products in this category matching your criteria.
                </p>
              </div>
            )}
          </Suspense>
          
          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                baseUrl={`/products/${params.category}`} 
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}






