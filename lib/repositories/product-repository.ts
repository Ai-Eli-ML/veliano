import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { handleSupabaseError } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { Product, ProductCategory, ProductImage, ProductVariant } from '@/types/product'

type Tables = Database['public']['Tables']
type ProductRow = Tables['products']['Row']
type ProductInsert = Tables['products']['Insert']
type ProductUpdate = Tables['products']['Update']

export class ProductRepository {
  // Get a single product by slug
  static getBySlug = async (slug: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, display_order),
          variants:product_variants(*),
          categories:product_categories!inner(
            category:categories(*)
          )
        `)
        .eq('is_available', true)
        .eq('slug', slug)
        .single()

      if (error) {
        handleSupabaseError(error)
      }

      return data ? this.mapProductData(data) : null
    } catch (error) {
      handleSupabaseError(error as Error)
      return null
    }
  }

  // Get products with filtering and pagination
  static getProducts = async ({
    categorySlug,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12,
    search
  }: {
    categorySlug?: string
    minPrice?: number
    maxPrice?: number
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured'
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    products: Product[]
    total: number
    totalPages: number
  }> => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, display_order),
          variants:product_variants(*),
          categories:product_categories!inner(
            category:categories(*)
          )
        `, { count: 'exact' })
        .eq('is_available', true)

      // Apply filters
      if (categorySlug) {
        query = query.eq('categories.category.slug', categorySlug)
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
          query = query.eq('is_featured', true)
          break
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        handleSupabaseError(error)
      }

      return {
        products: data?.map(this.mapProductData) ?? [],
        total: count ?? 0,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    } catch (error) {
      handleSupabaseError(error as Error)
      return {
        products: [],
        total: 0,
        totalPages: 0
      }
    }
  }

  // Get featured products
  static getFeaturedProducts = async (limit = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, display_order),
          variants:product_variants(*),
          categories:product_categories!inner(
            category:categories(*)
          )
        `)
        .eq('is_available', true)
        .eq('is_featured', true)
        .limit(limit)

      if (error) {
        handleSupabaseError(error)
      }

      return data?.map(this.mapProductData) ?? []
    } catch (error) {
      handleSupabaseError(error as Error)
      return []
    }
  }

  // Admin: Create a new product
  static createProduct = async (product: ProductInsert): Promise<Product> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) {
        handleSupabaseError(error)
      }

      if (!data) {
        throw new Error('Failed to create product')
      }

      return this.mapProductData(data)
    } catch (error) {
      handleSupabaseError(error as Error)
      throw error
    }
  }

  // Admin: Update a product
  static updateProduct = async (id: string, updates: ProductUpdate): Promise<Product> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        handleSupabaseError(error)
      }

      if (!data) {
        throw new Error(`Failed to update product: ${id}`)
      }

      return this.mapProductData(data)
    } catch (error) {
      handleSupabaseError(error as Error)
      throw error
    }
  }

  // Helper: Map database product to Product type
  private static mapProductData(data: ProductRow & {
    images?: { id: string; url: string; alt_text: string | null; display_order: number }[];
    variants?: ProductVariant[];
    categories?: { category: ProductCategory }[];
  }): Product {
    if (!data) {
      throw new Error('Cannot map null product data')
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? '',
      price: data.price,
      compare_at_price: data.compare_at_price ?? null,
      sku: data.sku ?? '',
      inventory_quantity: data.stock_quantity ?? 0,
      is_available: data.is_available,
      is_featured: data.is_featured ?? false,
      category_id: data.category_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      images: data.images?.map((img) => ({
        id: img.id,
        url: img.url,
        alt_text: img.alt_text ?? '',
        display_order: img.display_order,
        created_at: data.created_at,
        updated_at: data.updated_at
      })) ?? [],
      variants: data.variants ?? [],
      categories: data.categories?.map((cat) => cat.category) ?? []
    }
  }
} 