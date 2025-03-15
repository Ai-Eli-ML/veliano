import { createClientSupabaseClient, supabaseAdmin, handleSupabaseError } from './supabase'
import { getCachedUser } from './supabase-utils'
import { Database } from '@/types/supabase'

type Cart = Database['public']['Tables']['carts']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row']

// User helpers
export async function getCurrentUser() {
  const supabase = createClientSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }
  
  return getCachedUser(session.user.id)
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentUser()
  return !!user?.is_admin
}

// Product helpers
export async function getProductById(productId: string) {
  const supabase = createClientSupabaseClient()
  const response = await supabase
    .from('products')
    .select(`*, product_variants(*), product_images(*), product_categories(category_id)`)
    .eq('id', productId)
    .single()
  
  if (response.error) {
    console.error('Error fetching product:', response.error)
    return null
  }
  
  return response.data
}

export async function getProductsByCategory(categoryId: string) {
  const supabase = createClientSupabaseClient()
  const response = await supabase
    .from('product_categories')
    .select(`products(*)`)
    .eq('category_id', categoryId)
  
  if (response.error) {
    console.error('Error fetching products by category:', response.error)
    return []
  }
  
  return response.data?.flatMap(item => {
    // Use optional chaining to safely access potentially undefined properties
    const products = item?.products || []
    return Array.isArray(products) ? products : [products]
  }) || []
}

// Cart helpers
export async function getUserCart() {
  const supabase = createClientSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }
  
  // First, check if user has a cart
  const cartResponse = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('status', 'active')
    .single()
  
  if (cartResponse.error) {
    // Create a new cart if one doesn't exist
    if (cartResponse.error.message.includes('No rows found')) {
      const newCartResponse = await supabase
        .from('carts')
        .insert({ user_id: session.user.id, status: 'active' })
        .select()
        .single()
      
      if (newCartResponse.error) {
        console.error('Error creating cart:', newCartResponse.error)
        return null
      }
      
      return {
        cart: newCartResponse.data,
        items: []
      }
    }
    
    console.error('Error fetching cart:', cartResponse.error)
    return null
  }
  
  // Get cart items
  const itemsResponse = await supabase
    .from('cart_items')
    .select(`*, products(*)`)
    .eq('cart_id', cartResponse.data.id)
  
  if (itemsResponse.error) {
    console.error('Error fetching cart items:', itemsResponse.error)
    return {
      cart: cartResponse.data,
      items: []
    }
  }
  
  return {
    cart: cartResponse.data,
    items: itemsResponse.data || []
  }
}

// Order helpers
export async function getUserOrders() {
  const supabase = createClientSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return []
  }
  
  const response = await supabase
    .from('orders')
    .select(`*, order_items(*, products(*))`)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  
  if (response.error) {
    console.error('Error fetching orders:', response.error)
    return []
  }
  
  return response.data || []
}

// Admin helpers
export async function getAdminStats() {
  const isAdmin = await isCurrentUserAdmin()
  
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  // Since we don't know the exact RPC method, we're using any type here
  const response = await (supabaseAdmin as any).rpc('get_admin_stats')
  
  if (response.error) {
    console.error('Error fetching admin stats:', response.error)
    return null
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
    .select(`*, users(id, email, full_name), order_items(*, products(*))`, { 
      count: 'exact' 
    })
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const response = await query
  
  if (response.error) {
    console.error('Error fetching admin orders:', response.error)
    return { data: [], count: 0 }
  }
  
  return {
    data: response.data || [],
    count: response.count || 0
  }
} 