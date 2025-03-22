"use client"

import { Pagination } from "@/components/ui/pagination"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductsHeader } from "@/components/product/products-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { getProducts, getCategories } from "@/lib/products"
import { ProductRepository } from '@/lib/repositories/product-repository'
import ProductGridSkeleton from '@/components/products/product-grid-skeleton'
import ProductsFilter from '@/components/products/products-filter'

export const metadata = {
  title: 'Products - Veliano Jewelry',
  description: 'Browse our collection of luxury jewelry and custom grillz'
}

interface ProductsPageProps {
  searchParams: {
    category?: string
    page?: string
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured'
    minPrice?: string
    maxPrice?: string
    search?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page || '1')
  const limit = 16
  const offset = (page - 1) * limit

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Collection</h1>
        <p className="text-gray-600">Discover our exclusive selection of custom grillz and luxury jewelry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <aside>
          <ProductsFilter />
        </aside>
        
        <div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsContent 
              page={page} 
              limit={limit} 
              offset={offset}
              searchParams={searchParams} 
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function ProductsContent({ 
  page, 
  limit, 
  offset,
  searchParams 
}: { 
  page: number;
  limit: number;
  offset: number;
  searchParams: ProductsPageProps['searchParams'];
}) {
  // Convert category slug to ID if needed
  let categoryId;
  if (searchParams.category) {
    // In a real app, you would fetch the category ID by slug
    // For now, we'll assume we have the ID
    categoryId = searchParams.category;
  }

  // Fetch products with filters
  const result = await ProductRepository.getProducts({
    category_id: categoryId,
    featured: searchParams.sort === 'featured' ? true : undefined,
    status: 'active',
    limit,
    offset,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Showing {result.products.length} of {result.total} products
        </p>
        
        {/* Sort dropdown would go here */}
      </div>
      
      <ProductGrid 
        products={result.products} 
        emptyMessage="No products found. Try adjusting your filters." 
      />
      
      {/* Pagination component would go here */}
    </>
  );
}
