'use server'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for server components with proper cookie handling
 */
export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const resolvedCookieStore = await cookieStore
          return resolvedCookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: any) {
          try {
            const resolvedCookieStore = await cookieStore
            resolvedCookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies in middleware
          }
        },
        async remove(name: string, options: any) {
          try {
            const resolvedCookieStore = await cookieStore
            resolvedCookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies in middleware
          }
        },
      },
    }
  )
}

/**
 * Admin client for privileged database operations
 * Should only be used in server contexts that require admin access
 */
export async function createServerSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Consistent error handler for Supabase operations
 */
export async function handleSupabaseError(error: Error) {
  console.error('Supabase Error:', error.message)
  throw error
}