import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request) {
  try {
    const { userId, name, email } = await request.json()

    const { data, error } = await supabase
      .from('users')
      .update({ name, email, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        route: 'PUT /api/profile'
      }
    })

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 