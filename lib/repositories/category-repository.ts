import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { ProductCategory } from '@/types/product'
import { Database } from '@/types/supabase'

// Custom error handler
const handleSupabaseError = (error: any, message?: string) => {
  console.error(`Supabase error ${message ? `(${message})` : ''}:`, error)
}

export class CategoryRepository {
  // Get all categories
  static getCategories = async (): Promise<ProductCategory[]> => {
    try {
      const supabase = createServerActionClient<Database>({ cookies })
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        handleSupabaseError(error)
        return []
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
      const supabase = createServerActionClient<Database>({ cookies })
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found error
          return null
        }
        handleSupabaseError(error)
        return null
      }

      return data ? this.mapCategoryData(data) : null
    } catch (error) {
      handleSupabaseError(error as Error)
      return null
    }
  }

  // Helper to map database row to ProductCategory type
  private static mapCategoryData(category: any): ProductCategory {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url,
      parent_id: category.parent_id,
      created_at: category.created_at,
      updated_at: category.updated_at,
    }
  }
} 