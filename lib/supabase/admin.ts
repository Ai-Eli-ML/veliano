import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

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