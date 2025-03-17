import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const limit = Number.parseInt(searchParams.get("limit") || "6")

  if (!query) {
    return NextResponse.json({ products: [] })
  }

  const supabase = await createServerSupabaseClient()

  try {
    // First, get the category ID if a category is specified
    let categoryId: string | undefined
    if (category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single()
      categoryId = categoryData?.id
    }

    // Then, get the product IDs for the category if one was found
    let productIds: string[] = []
    if (categoryId) {
      const { data: productCategoryData } = await supabase
        .from("product_categories")
        .select("product_id")
        .eq("category_id", categoryId)
      productIds = productCategoryData?.map(pc => pc.product_id) || []
    }

    // Finally, query the products
    let productQuery = supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        categories:product_categories(
          categories:categories(id, name, slug)
        )
      `)
      .eq("is_published", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Apply category filter if we have product IDs
    if (categoryId && productIds.length > 0) {
      productQuery = productQuery.in("id", productIds)
    }

    // Apply limit
    productQuery = productQuery.limit(limit)

    const { data, error } = await productQuery

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ products: [] }, { status: 500 })
    }

    // Transform the data to match our Product type
    const products = data.map((product: any) => ({
      ...product,
      categories: product.categories.map((item: any) => item.categories),
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}

