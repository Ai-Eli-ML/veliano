import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSort } from "@/components/products/product-sort"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search for products in our catalog",
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, minPrice, maxPrice, sort, page = "1" } = searchParams

  if (!q) {
    notFound()
  }

  const supabase = createServerSupabaseClient()

  // Build the query
  let query = supabase
    .from("products")
    .select(
      `
      *,
      images:product_images(*),
      variants:product_variants(*),
      categories:product_categories(
        categories:categories(id, name, slug)
      )
    `,
      { count: "exact" },
    )
    .eq("is_published", true)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)

  // Apply filters
  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();

    if (categoryData) {
      const { data: categoryProducts } = await supabase
        .from("product_categories")
        .select("product_id")
        .eq("category_id", categoryData.id);

      if (categoryProducts && categoryProducts.length > 0) {
        query = query.in("id", categoryProducts.map(cp => cp.product_id));
      }
    }
  }

  if (minPrice) {
    query = query.gte("price", Number.parseFloat(minPrice))
  }

  if (maxPrice) {
    query = query.lte("price", Number.parseFloat(maxPrice))
  }

  // Apply sorting
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "featured":
      query = query.eq("featured", true).order("created_at", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  // Apply pagination
  const limit = 12
  const currentPage = Number.parseInt(page)
  const from = (currentPage - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  // Execute the query
  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching search results:", error)
    return (
      <div className="container py-10">
        <h1 className="mb-6 text-3xl font-bold">Search Results for "{q}"</h1>
        <p>An error occurred while fetching search results. Please try again.</p>
      </div>
    )
  }

  // Transform the data to match our Product type
  const products = data.map((product: any) => ({
    ...product,
    categories: product.categories.map((item: any) => item.categories),
  }))

  // Fetch categories for filters
  const { data: categories } = await supabase.from("categories").select("*").order("name", { ascending: true })

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Search Results for "{q}"</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
        {/* Filters Sidebar */}
        <div>
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ProductFilters categories={categories || []} />
          </Suspense>
        </div>

        {/* Products */}
        <div>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground">
              Showing {products.length} of {count || 0} results
            </p>
            <ProductSort />
          </div>

          <Suspense fallback={<Skeleton className="h-[800px] w-full" />}>
            <ProductGrid
              products={products}
              currentPage={currentPage}
              totalPages={count ? Math.ceil(count / limit) : 0}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

