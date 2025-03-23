import { Suspense } from "react"
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  const results = query ? await searchProducts(query, page) : null

  return (
    <div className="container py-10">
      <div className="mb-8">
        <SearchForm initialQuery={query} />
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        {query ? (
          results && results.products.length > 0 ? (
            <>
              <ProductGrid products={results.products} />
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(results.total / 12)}
                  baseUrl={`/search?q=${encodeURIComponent(query)}`}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              No products found for "{query}"
            </p>
          )
        ) : (
          <p className="text-center text-muted-foreground">
            Enter a search term to find products
          </p>
        )}
      </Suspense>
    </div>
  )
}
