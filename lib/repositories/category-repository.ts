import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createSafeQuery, handleSupabaseError } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { Product, ProductCategory } from '@/types/product'

type Tables = Database['public']['Tables']
type CategoryRow = Tables['categories']['Row']
type CategoryInsert = Tables['categories']['Insert']
type CategoryUpdate = Tables['categories']['Update']

export class CategoryRepository {
  // Get all categories
  static getCategories = async (): Promise<ProductCategory[]> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        handleSupabaseError(error)
      }

      return (data ?? []).map(this.mapCategoryData)
    } catch (error) {
      handleSupabaseError(error as Error)
      return []
    }
  }

  // Get a category by slug
  static getBySlug = async (slug: string): Promise<ProductCategory | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        handleSupabaseError(error)
      }

      return data ? this.mapCategoryData(data) : null
    } catch (error) {
      handleSupabaseError(error as Error)
      return null
    }
  }

  // Get categories with their products
  static getCategoriesWithProducts = async (): Promise<(ProductCategory & { products: Product[] })[]> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products:product_categories!inner(
            product:products(*)
          )
        `)
        .order('name')

      if (error) {
        handleSupabaseError(error)
      }

      return (data ?? []).map(category => ({
        ...this.mapCategoryData(category),
        products: category.products.map((p: any) => p.product)
      }))
    } catch (error) {
      handleSupabaseError(error as Error)
      return []
    }
  }

  // Admin: Create a new category
  static createCategory = async (category: CategoryInsert): Promise<ProductCategory> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert(category)
        .select()
        .single()

      if (error) {
        handleSupabaseError(error)
      }

      if (!data) {
        throw new Error('Failed to create category')
      }

      return this.mapCategoryData(data)
    } catch (error) {
      handleSupabaseError(error as Error)
      throw error
    }
  }

  // Admin: Update a category
  static updateCategory = async (id: string, updates: CategoryUpdate): Promise<ProductCategory> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        handleSupabaseError(error)
      }

      if (!data) {
        throw new Error(`Failed to update category: ${id}`)
      }

      return this.mapCategoryData(data)
    } catch (error) {
      handleSupabaseError(error as Error)
      throw error
    }
  }

  // Helper: Map database category to ProductCategory type
  private static mapCategoryData(data: CategoryRow): ProductCategory {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      image_url: null, // These fields will be added to the database schema later
      parent_id: null
    }
  }
} 