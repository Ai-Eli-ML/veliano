import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signIn(email: string, password: string) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', password)
  
  const response = await fetch('/api/auth/supabase', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  
  return response.json()
}

export async function signOut() {
  await fetch('/api/auth/supabase', {
    method: 'DELETE',
  })
  
  // Refresh the page to clear any client-side state
  window.location.href = '/'
} 