'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function getProducts() {
  const supabase = createServerActionClient<Database>({ cookies })
  const { data, error } = await supabase.from('products').select()
  
  if (error) {
    console.error('Error fetching products:', error)
    return { data: null, error: error.message }
  }
  
  return { data, error: null }
}

export async function createProduct(product: Database['public']['Tables']['products']['Insert']) {
  const supabase = createServerActionClient<Database>({ cookies })
  
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select('*')
    .single()
  
  if (error) {
    console.error('Error creating product:', error)
    return { data: null, error: error.message }
  }
  
  revalidatePath('/products')
  return { data, error: null }
} 