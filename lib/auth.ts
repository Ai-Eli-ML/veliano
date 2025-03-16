import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import type { Database } from "@/types/supabase"

export type AuthUser = Database["public"]["Tables"]["users"]["Row"]

export async function getAuthUser() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/account/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!profile) {
    redirect("/account/login")
  }

  return {
    user: session.user,
    profile,
  }
}

export async function requireAdmin() {
  const { user, profile } = await getAuthUser()

  if (!profile.is_admin) {
    redirect("/")
  }

  return {
    user,
    profile,
  }
} 