import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

// Re-export createClient to fix import issues elsewhere
export { createClient }

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Create a browser client for client-side usage
export const createBrowserSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Hook for using Supabase in components
export const useSupabase = () => {
  const [client] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    return () => {
      client.auth.getSession()
    }
  }, [client])

  return { supabase: client }
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: Error) => {
  console.error('Supabase Error:', error.message)
  // TODO: Add Sentry error tracking here
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