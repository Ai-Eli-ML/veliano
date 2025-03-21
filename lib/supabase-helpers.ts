import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { supabaseAdmin } from './supabase'

// Create a client for use in helper functions
const client = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Handle Supabase errors consistently
export const handleSupabaseError = (error: Error) => {
  console.error('Supabase Error:', error.message)
  throw error
}

// User helpers
export async function getCurrentUser() {
  const { data: { session } } = await client.auth.getSession()
  
  if (!session) {
    return null
  }
  
  const userId = session.user?.id
  
  if (!userId) {
    return null
  }
  
  const { data: profile, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return { 
    ...session.user,
    profile,
    // For backward compatibility
    isAdmin: false // Set based on your admin determination logic
  }
}

// Check if current user is an admin
export async function isCurrentUserAdmin() {
  const user = await getCurrentUser()
  // Add your admin checking logic here
  return false // Default to false until admin logic is implemented
}

// Product helpers
export async function getProductById(productId: string) {
  const response = await client
    .from('products')
    .select('*, product_variants(*), product_images(*), product_categories(*)')
    .eq('id', productId)
    .single()
  
  if (response.error) {
    handleSupabaseError(response.error)
  }
  
  return response.data
}

export async function getProductsByCategory(categoryId: string) {
  const response = await client
    .from('product_categories')
    .select('products(*)')
    .eq('id', categoryId)
  
  if (response.error) {
    handleSupabaseError(response.error)
  }
  
  return response.data?.flatMap(item => {
    return item.products || []
  }) || []
}

// Cart helpers
export async function getUserCart() {
  const { data: { session } } = await client.auth.getSession()
  
  if (!session) {
    return null
  }
  
  const userId = session.user?.id
  
  if (!userId) {
    return null
  }
  
  const response = await client
    .from('carts')
    .select('*, cart_items(*)')
    .eq('user_id', userId)
    .single()
  
  if (response.error) {
    handleSupabaseError(response.error)
  }
  
  return response.data
}

// Order helpers
export async function getUserOrders() {
  const { data: { session } } = await client.auth.getSession()
  
  if (!session) {
    return []
  }
  
  const userId = session.user?.id
  
  if (!userId) {
    return []
  }
  
  const response = await client
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (response.error) {
    handleSupabaseError(response.error)
  }
  
  return response.data || []
}

// Admin helpers
export async function getAdminStats() {
  const isAdmin = await isCurrentUserAdmin()
  
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  const response = await supabaseAdmin.rpc('get_admin_stats')
  
  if (response.error) {
    handleSupabaseError(response.error)
  }
  
  return response.data
}

export async function getAdminOrders(
  page = 1, 
  pageSize = 10,
  status?: string
) {
  const isAdmin = await isCurrentUserAdmin()
  
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  let query = supabaseAdmin
    .from('orders')
    .select(`*, profiles(id, email, full_name), order_items(*, products(*))`, { 
      count: 'exact' 
    })
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const response = await query
  
  if (response.error) {
    handleSupabaseError(response.error)
  }
  
  return {
    data: response.data || [],
    count: response.count || 0
  }
} 