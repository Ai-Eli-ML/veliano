import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import type { cookies } from "next/headers"
import type { PostgrestSingleResponse } from "@supabase/supabase-js"

// Make sure environment variables are available and throw clear errors if they're not
console.log('Debug - Environment Variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Error handling wrapper for Supabase calls
export async function handleSupabaseError<T>(
  response: PostgrestSingleResponse<T> | Promise<PostgrestSingleResponse<T>>
): Promise<[T | null, Error | null]> {
  try {
    // Handle both direct response objects and promises
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
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
}

// For server components
export function createServerSupabaseClient() {
  // @ts-expect-error - This is actually safe to use in Server Components
  return createServerComponentClient<Database>({ cookies })
}

// For direct API access (e.g., in Server Actions)
export const supabaseAdmin = (() => {
  if (typeof window === 'undefined') {
    // Server-side only
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
    }
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  // Return null or a mock client for client-side
  return null
})()

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

