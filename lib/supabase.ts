import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import type { cookies } from "next/headers"

// Make sure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client components
export function createClientSupabaseClient() {
  // Using the type-safe approach with createClientComponentClient
  return createClientComponentClient<Database>()
}

// For server components
export function createServerSupabaseClient() {
  // @ts-expect-error - This is actually safe to use in Server Components
  return createServerComponentClient<Database>({ cookies })
}

// For direct API access (e.g., in Server Actions)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Types
export type SupabaseClient = ReturnType<typeof createClientSupabaseClient>

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  billing_address: any | null
  shipping_address: any | null
  stripe_customer_id: string | null
  is_admin: boolean | null
}

// Create a separate file for server components
// This function is moved to a separate file to avoid importing next/headers in client components
// You can import this function directly in server components or server actions

