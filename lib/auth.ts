import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { type Session, User } from "@supabase/supabase-js"

export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function getUserSession(): Promise<Session | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.auth.getSession()
    return data?.session || null
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function requireUser() {
  const user = await getUser()
  if (!user) {
    return redirect("/account/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await getUser()
  if (!user) {
    return redirect("/account/login")
  }
  
  // For now, we'll use a query to a special admin table or just check user metadata
  // You'll need to adjust this based on your exact schema
  const supabase = await createServerSupabaseClient()
  
  // Option 1: Check if user has admin role in auth.users (if you're using Supabase Auth metadata)
  const { data: userWithMeta } = await supabase.auth.getUser()
  
  // Check if user has admin permissions via metadata or other means
  // Adjust this condition based on your specific implementation
  if (!userWithMeta?.user?.app_metadata?.is_admin) {
    return redirect("/")
  }
  
  return user
} 