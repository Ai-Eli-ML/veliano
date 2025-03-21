// Centralized Supabase exports for the entire application
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Re-export the createClient from the original package
export { createClient }

// Client-side Supabase instance
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Admin Supabase instance (for server-side operations requiring elevated privileges)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper for Supabase client creation in component-level imports
export const createClientSupabaseClient = () => {
  return supabase
}

// Shared error handler for consistent error handling
export const handleSupabaseError = (error: Error) => {
  console.error('Supabase Error:', error.message)
  // TODO: Add error tracking here
  throw error
}

// Type-safe query helper
export const createSafeQuery = <T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>
) => {
  return async (): Promise<T> => {
    const { data, error } = await queryFn()
    if (error) {
      handleSupabaseError(error)
    }
    if (!data) {
      throw new Error('No data returned from query')
    }
    return data
  }
}
