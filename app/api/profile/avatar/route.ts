import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const avatar = formData.get('avatar') as File
    const userId = formData.get('userId') as string

    if (!avatar || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const filename = `${userId}-${Date.now()}-${avatar.name}`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filename, avatar, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filename)

    // Update user profile with avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ avatarUrl: publicUrl })
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        route: 'POST /api/profile/avatar'
      }
    })

    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
} 