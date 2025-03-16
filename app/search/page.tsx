import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ProductGrid } from "@/components/products/product-grid"
import { Pagination } from "@/components/ui/pagination"

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
  }
}

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search for products in our catalog",
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || ""
  const page = searchParams?.page ? parseInt(searchParams.page) : 1
  const limit = 12

  try {
    const supabase = createServerSupabaseClient()
    
    // Get total count first
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .ilike("name", `%${query}%`)

    // Then get paginated results
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images(*),
        product_categories(category_id)
      `)
      .ilike("name", `%${query}%`)
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) throw error

    const totalPages = count ? Math.ceil(count / limit) : 0

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {count === 0
            ? `No results found for "${query}"`
            : `Search results for "${query}"`}
        </h1>
        
        <ProductGrid products={products || []} />
        
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={count || 0}
            />
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error searching products:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <p className="text-red-500">Error loading search results. Please try again later.</p>
      </div>
    )
  }
}

