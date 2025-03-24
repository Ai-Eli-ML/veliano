import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Get all reviews for the product
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(id, full_name, avatar_url)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      user_id: review.user_id,
      product_id: review.product_id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      user: {
        name: review.user?.full_name || 'Anonymous',
        avatar_url: review.user?.avatar_url
      }
    }))

    return NextResponse.json({ 
      success: true, 
      data: transformedReviews 
    })
  } catch (error) {
    console.error('Unexpected error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 