import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// For server components
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}

export type ServerSupabaseClient = ReturnType<typeof createServerSupabaseClient> 