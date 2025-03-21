import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { supabaseAdmin } from '../supabase'
import { Profile } from '@/types/supabase'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

// Create a Supabase client with admin privileges for server-side operations
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Helper function to handle Supabase admin errors
export const handleSupabaseAdminError = (error: Error) => {
  console.error('Supabase Admin Error:', error.message)
  // TODO: Add Sentry error tracking here
  throw error
}

// Type-safe query helper for admin operations
export const createSafeAdminQuery = <T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>
) => {
  return async (): Promise<T> => {
    const { data, error } = await queryFn()
    if (error) {
      handleSupabaseAdminError(error)
    }
    if (!data) {
      throw new Error('No data returned from admin query')
    }
    return data
  }
}

/**
 * Verifies if a user has admin privileges
 * Required for any admin-only operations
 */
export const verifyAdminAccess = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Admin verification failed:', error.message)
      return false
    }
    
    return !!data?.is_admin
  } catch (error) {
    console.error('Error in admin verification:', error)
    return false
  }
}

/**
 * Executes admin-only operations after verifying privileges
 * @throws Error if user lacks admin privileges
 */
export const adminAction = async <T>(
  userId: string, 
  action: () => Promise<T>
): Promise<T> => {
  const isAdmin = await verifyAdminAccess(userId)
  
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin privileges required')
  }
  
  return action()
}

// Secure admin query template
export const adminOnlyQuery = <T>(table: string, userId: string) => {
  return supabaseAdmin
    .from(table)
    .select('*')
    .eq('user_id', userId)
}

/**
 * Creates a secure admin-only query builder
 */
export const createAdminQuery = <T>(table: string) => {
  return supabaseAdmin
    .from(table)
    .select('*')
}

/**
 * Logs admin actions for audit purposes
 */
export const logAdminAction = async (
  userId: string,
  action: string,
  details: any
) => {
  try {
    await supabaseAdmin
      .from('admin_logs')
      .insert({
        user_id: userId,
        action,
        details,
      })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}