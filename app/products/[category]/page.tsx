import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProducts, getCategories, getCategoryBySlug } from "@/lib/products"
import ProductGrid from "@/components/products/product-grid"
import ProductFilters from "@/components/products/product-filters"
import ProductSort from "@/components/products/product-sort"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    }
  }

  return {
    title: category.name,
    description: category.description || `Browse our collection of ${category.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  // Parse search params
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const sort = searchParams.sort as "price_asc" | "price_desc" | "newest" | "featured" | undefined
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search as string | undefined

  // Fetch products and categories
  const { products, total, totalPages } = await getProducts({
    category: params.category,
    minPrice,
    maxPrice,
    sort,
    page,
    search,
  })

  const categories = await getCategories()

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
      {category.description && <p className="mb-6 text-muted-foreground">{category.description}</p>}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
        {/* Filters Sidebar */}
        <div>
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ProductFilters categories={categories} currentCategory={category} />
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

