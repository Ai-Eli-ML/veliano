import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json(
    { 
      user: data.user,
      session: data.session 
    }, 
    {
      status: 200,
      headers: {
        'Location': requestUrl.origin,
      },
    },
  )
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/auth-code-error?error=${error.message}`,
      )
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

export async function DELETE() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  
  return NextResponse.json({}, { status: 200 })
} 