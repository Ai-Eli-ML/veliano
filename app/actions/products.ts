'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export async function createProduct(data: ProductInsert) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: product, error } = await supabase
      .from('products')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { data: product, error: null }
  } catch (error) {
    console.error('Error creating product:', error)
    return { data: null, error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, data: ProductUpdate) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: product, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { data: product, error: null }
  } catch (error) {
    console.error('Error updating product:', error)
    return { data: null, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { error: null }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Failed to delete product' }
  }
}

export async function getProduct(id: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: product, error } = await supabase
      .from('products')
      .select()
      .eq('id', id)
      .single()

    if (error) throw error
    return { data: product, error: null }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { data: null, error: 'Failed to fetch product' }
  }
}

export async function listProducts(options?: {
  category?: string
  is_custom_order?: boolean
  search?: string
  limit?: number
  offset?: number
  order_by?: {
    column: keyof Product
    direction: 'asc' | 'desc'
  }
}) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    let query = supabase
      .from('products')
      .select()

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    if (typeof options?.is_custom_order === 'boolean') {
      query = query.eq('is_custom_order', options.is_custom_order)
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options?.order_by) {
      query = query.order(options.order_by.column, {
        ascending: options.order_by.direction === 'asc'
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error listing products:', error)
    return { data: [], error: 'Failed to list products' }
  }
} 