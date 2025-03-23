import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { userId, street, city, state, zipCode } = await request.json()

    if (!userId || !street || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        street,
        city,
        state,
        zip_code: zipCode,
        is_default: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        route: 'POST /api/profile/address'
      }
    })

    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { addressId, userId } = await request.json()

    if (!addressId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Start a transaction to update addresses
    const { error } = await supabase.rpc('set_default_address', {
      p_address_id: addressId,
      p_user_id: userId
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        route: 'PUT /api/profile/address'
      }
    })

    return NextResponse.json(
      { error: 'Failed to update default address' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        route: 'GET /api/profile/address'
      }
    })

    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
} 