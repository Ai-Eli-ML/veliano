import { createServerSupabaseClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import type { Product, ProductCategory, ProductFilterOptions } from "@/types/product"
import { unstable_noStore as noStore } from 'next/cache'

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient()

  try {
    // Fetch the product
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        categories:product_categories(
          categories:categories(id, name, slug)
        )
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    // Transform the data to match our Product type
    return {
      ...product,
      categories: product.categories.map((item: any) => item.categories),
    } as unknown as Product
  } catch (error) {
    console.error("Error in getProductBySlug:", error)
    return null
  }
}

// Fetch products with filtering options
export async function getProducts({
  category,
  minPrice,
  maxPrice,
  sort = "newest",
  page = 1,
  search,
  limit = 12,
}: GetProductsParams = {}) {
  noStore()
  const supabase = await createServerSupabaseClient()
  
  // Calculate offset
  const offset = (page - 1) * limit

  // Start building query
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_archived', false)

  // Apply filters
  if (category) {
    query = query.eq('categories.slug', category)
  }
  if (minPrice) {
    query = query.gte('price', minPrice)
  }
  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  // Apply sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'featured':
      query = query.eq('is_featured', true).order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: products, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }

  return {
    products: products as Product[],
    total: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

// Fetch featured products
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    // Return mock data if the database tables don't exist yet
    return getMockFeaturedProducts(limit)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return getMockFeaturedProducts(limit)
  }
}

// Mock function to provide sample featured products
function getMockFeaturedProducts(limit = 4): Product[] {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "10K Gold Single Tooth Grill",
      slug: "10k-gold-single-tooth-grill",
      description: "Premium 10K gold single tooth grill, custom fitted for comfort and style.",
      price: 199.99,
      compare_at_price: 249.99,
      sku: "GRILL-10K-SINGLE",
      inventory_quantity: 15,
      is_published: true,
      featured: true,
      has_variants: false,
      images: [
        {
          id: "img1",
          url: "/placeholder.svg?height=400&width=400",
          alt_text: "10K Gold Single Tooth Grill",
          position: 0,
        },
      ],
      variants: [],
      categories: [
        {
          id: "cat1",
          name: "Grillz",
          slug: "grillz",
        },
      ],
    },
    {
      id: "2",
      name: "14K Gold 6 Teeth Bottom Grill",
      slug: "14k-gold-6-teeth-bottom-grill",
      description: "Luxurious 14K gold bottom grill covering 6 teeth, custom made to your specifications.",
      price: 599.99,
      compare_at_price: 699.99,
      sku: "GRILL-14K-BOTTOM-6",
      inventory_quantity: 8,
      is_published: true,
      featured: true,
      has_variants: false,
      images: [
        {
          id: "img2",
          url: "/placeholder.svg?height=400&width=400",
          alt_text: "14K Gold 6 Teeth Bottom Grill",
          position: 0,
        },
      ],
      variants: [],
      categories: [
        {
          id: "cat1",
          name: "Grillz",
          slug: "grillz",
        },
      ],
    },
    {
      id: "3",
      name: "18K Gold Cuban Link Chain",
      slug: "18k-gold-cuban-link-chain",
      description: "Premium 18K gold Cuban link chain, perfect for any occasion.",
      price: 1299.99,
      compare_at_price: null,
      sku: "CHAIN-18K-CUBAN",
      inventory_quantity: 5,
      is_published: true,
      featured: true,
      has_variants: true,
      images: [
        {
          id: "img3",
          url: "/placeholder.svg?height=400&width=400",
          alt_text: "18K Gold Cuban Link Chain",
          position: 0,
        },
      ],
      variants: [
        {
          id: "var1",
          name: "18 inch",
          sku: "CHAIN-18K-CUBAN-18",
          price: 1299.99,
          compare_at_price: null,
          inventory_quantity: 2,
          option1_name: "Length",
          option1_value: "18 inch",
          option2_name: null,
          option2_value: null,
          option3_name: null,
          option3_value: null,
        },
        {
          id: "var2",
          name: "24 inch",
          sku: "CHAIN-18K-CUBAN-24",
          price: 1599.99,
          compare_at_price: null,
          inventory_quantity: 3,
          option1_name: "Length",
          option1_value: "24 inch",
          option2_name: null,
          option2_value: null,
          option3_name: null,
          option3_value: null,
        },
      ],
      categories: [
        {
          id: "cat2",
          name: "Jewelry",
          slug: "jewelry",
        },
      ],
    },
    {
      id: "4",
      name: "Diamond Pendant",
      slug: "diamond-pendant",
      description: "Stunning diamond pendant with 14K gold chain.",
      price: 899.99,
      compare_at_price: 999.99,
      sku: "PEND-DIAMOND",
      inventory_quantity: 7,
      is_published: true,
      featured: true,
      has_variants: false,
      images: [
        {
          id: "img4",
          url: "/placeholder.svg?height=400&width=400",
          alt_text: "Diamond Pendant",
          position: 0,
        },
      ],
      variants: [],
      categories: [
        {
          id: "cat2",
          name: "Jewelry",
          slug: "jewelry",
        },
      ],
    },
  ]

  return mockProducts.slice(0, limit)
}

// Fetch all categories
export async function getCategories(): Promise<ProductCategory[]> {
  noStore()
  const supabase = await createServerSupabaseClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }

  return categories as ProductCategory[]
}

// Fetch a category by slug
export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching category:", error)
      // Return mock category if real one not found
      const mockCategories = getMockCategories()
      const mockCategory = mockCategories.find((cat) => cat.slug === slug)
      return mockCategory || null
    }

    return data as ProductCategory
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error)
    return null
  }
}

// Fetch related products
export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient()

    // First get the product IDs in the category
    const { data: productIds } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", categoryId)

    if (!productIds) {
      return getMockRelatedProducts(productId, limit)
    }

    // Get products in the same category, excluding the current product
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        price,
        compare_at_price,
        sku,
        inventory_quantity,
        is_published,
        featured,
        has_variants,
        images:product_images(
          id,
          url,
          alt_text,
          position
        ),
        variants:product_variants(
          id,
          name,
          sku,
          price,
          compare_at_price,
          inventory_quantity,
          option1_name,
          option1_value,
          option2_name,
          option2_value,
          option3_name,
          option3_value
        ),
        categories:product_categories(
          categories:categories(
            id,
            name,
            slug
          )
        )
      `)
      .eq("is_published", true)
      .neq("id", productId)
      .in("id", productIds.map(p => p.product_id))
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching related products:", error)
      return getMockRelatedProducts(productId, limit)
    }

    // Transform the data to match our Product type
    return data.map((product: any) => {
      const transformedProduct: Product = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compare_at_price: product.compare_at_price,
        sku: product.sku,
        inventory_quantity: product.inventory_quantity,
        is_published: product.is_published,
        featured: product.featured,
        has_variants: product.has_variants,
        images: product.images,
        variants: product.variants,
        categories: product.categories.map((pc: any) => pc.categories)
      }
      return transformedProduct
    })
  } catch (error) {
    console.error("Error in getRelatedProducts:", error)
    return getMockRelatedProducts(productId, limit)
  }
}

// Mock function to provide sample related products
function getMockRelatedProducts(currentProductId: string, limit = 4): Product[] {
  // Filter out the current product from our mock products
  const mockProducts = getMockFeaturedProducts(8).filter((product) => product.id !== currentProductId)
  return mockProducts.slice(0, limit)
}

// Admin function to create a product
export async function createProduct(product: Partial<Product>) {
  try {
    const supabase = supabaseAdmin

    // Ensure required fields are present
    if (!product.name || !product.slug || !product.price) {
      throw new Error("Name, slug, and price are required fields")
    }

    // Insert the product with required fields
    const productData = {
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description ?? null,
      compare_at_price: product.compare_at_price ?? null,
      sku: product.sku ?? null,
      inventory_quantity: product.inventory_quantity ?? null,
      is_published: product.is_published ?? false,
      featured: product.featured ?? false,
      has_variants: product.has_variants ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert the product
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      throw error
    }

    // Insert images if provided
    if (product.images && product.images.length > 0) {
      const { error: imagesError } = await supabase.from("product_images").insert(
        product.images.map((image, index) => ({
          product_id: data.id,
          url: image.url,
          alt_text: image.alt_text ?? null,
          position: image.position ?? index
        }))
      )

      if (imagesError) {
        console.error("Error creating product images:", imagesError)
        throw imagesError
      }
    }

    // Insert variants if provided
    if (product.variants && product.variants.length > 0) {
      const { error: variantsError } = await supabase.from("product_variants").insert(
        product.variants.map(variant => ({
          product_id: data.id,
          name: variant.name,
          sku: variant.sku ?? null,
          price: variant.price ?? null,
          compare_at_price: variant.compare_at_price ?? null,
          inventory_quantity: variant.inventory_quantity ?? null,
          option1_name: variant.option1_name ?? null,
          option1_value: variant.option1_value ?? null,
          option2_name: variant.option2_name ?? null,
          option2_value: variant.option2_value ?? null,
          option3_name: variant.option3_name ?? null,
          option3_value: variant.option3_value ?? null
        }))
      )

      if (variantsError) {
        console.error("Error creating product variants:", variantsError)
        throw variantsError
      }
    }

    // Insert categories if provided
    if (product.categories && product.categories.length > 0) {
      const { error: categoriesError } = await supabase.from("product_categories").insert(
        product.categories.map(category => ({
          product_id: data.id,
          category_id: category.id
        }))
      )

      if (categoriesError) {
        console.error("Error creating product categories:", categoriesError)
        throw categoriesError
      }
    }

    return data
  } catch (error) {
    console.error("Error in createProduct:", error)
    throw error
  }
}

// Admin function to update a product
export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const supabase = supabaseAdmin

    // Update the product
    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compare_at_price: product.compare_at_price,
        sku: product.sku,
        inventory_quantity: product.inventory_quantity,
        is_published: product.is_published,
        featured: product.featured,
        has_variants: product.has_variants,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error in updateProduct:", error)
    throw error
  }
}

// Admin function to delete a product
export async function deleteProduct(id: string) {
  try {
    const supabase = supabaseAdmin

    // Delete the product
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error("Error in deleteProduct:", error)
    throw error
  }
}

// Update getProduct function
export async function getProduct(slug: string) {
  const { data: product, error } = await createServerSupabaseClient()
    .from("products")
    .select(`
      *,
      product_images(*),
      product_categories(category_id)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  // Transform the data to match our Product type
  return {
    ...product,
    categories: product.categories.map((item: any) => item.categories),
  } as unknown as Product
}

