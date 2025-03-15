'use client'

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import type { PostgrestSingleResponse } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Error handling wrapper for Supabase calls
export async function handleSupabaseError<T>(
  response: PostgrestSingleResponse<T> | Promise<PostgrestSingleResponse<T>>
): Promise<[T | null, Error | null]> {
  try {
    const result = await (response instanceof Promise ? response : Promise.resolve(response))
    
    if (result.error) {
      return [null, new Error(result.error.message)]
    }
    
    return [result.data as T, null]
  } catch (error: unknown) {
    console.error('Supabase error:', error)
    return [null, error instanceof Error ? error : new Error(String(error))]
  }
}

// For client components
export function createClientSupabaseClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

// Types
export type SupabaseClient = ReturnType<typeof createClientSupabaseClient>

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  billing_address: Record<string, unknown> | null
  shipping_address: Record<string, unknown> | null
  stripe_customer_id: string | null
  is_admin: boolean | null
}

// Create a separate file for server components
// This function is moved to a separate file to avoid importing next/headers in client components
// You can import this function directly in server components or server actions

