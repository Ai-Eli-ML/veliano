import { cache } from 'react'
import { z } from 'zod'
import { PostgrestSingleResponse, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { createClientSupabaseClient, supabaseAdmin, handleSupabaseError } from './supabase'
import { Database } from '@/types/supabase'

// Caching layer for frequently accessed data
export const getCachedUser = cache(async (userId: string) => {
  const supabase = createClientSupabaseClient()
  const response = await supabase.from('users').select('*').eq('id', userId).single()
  const [data, error] = await handleSupabaseError(
    Promise.resolve(response) as Promise<PostgrestSingleResponse<any>>
  )
  
  if (error) {
    console.error('Error fetching cached user:', error)
    return null
  }
  
  return data
})

export const getCachedCategories = cache(async () => {
  const supabase = createClientSupabaseClient()
  const response = await supabase.from('categories').select('*').order('name')
  const [data, error] = await handleSupabaseError(
    Promise.resolve(response) as Promise<PostgrestSingleResponse<any>>
  )
  
  if (error) {
    console.error('Error fetching cached categories:', error)
    return []
  }
  
  return data || []
})

// Data validation schemas
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  avatar_url: z.string().url().nullable(),
  billing_address: z.any().nullable(),
  shipping_address: z.any().nullable(),
})

export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is too short').max(255, 'Product name is too long'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  status: z.enum(['draft', 'active', 'archived']),
  inventory: z.number().int().nonnegative('Inventory cannot be negative'),
  category_id: z.string().uuid('Invalid category ID'),
})

// Validation helper functions
export async function validateAndUpdateProfile(userId: string, data: unknown) {
  try {
    const validated = userProfileSchema.parse(data)
    const response = await supabaseAdmin
      .from('users')
      .update(validated)
      .eq('id', userId)
      .select()
      .single()
    
    const [result, error] = await handleSupabaseError(
      Promise.resolve(response) as Promise<PostgrestSingleResponse<any>>
    )
    
    return { success: !error, data: result, error }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        data: null, 
        error: { message: 'Validation error', details: error.errors } 
      }
    }
    return { 
      success: false, 
      data: null, 
      error: { message: 'Unknown error', details: String(error) } 
    }
  }
}

// Real-time subscription helper
export function createRealtimeSubscription(
  table: string,
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  const supabase = createClientSupabaseClient()
  
  // Using any for payload type to avoid constraints errors
  return supabase
    .channel('table_db_changes')
    .on(
      'postgres_changes' as any, // Type assertion to bypass strict type checking
      { event, schema: 'public', table },
      callback
    )
    .subscribe()
} 