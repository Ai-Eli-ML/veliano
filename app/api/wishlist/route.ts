import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const wishlistItemSchema = z.object({
  product_id: z.string().uuid(),
})

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
  
  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      id,
      product_id,
      created_at,
      products (
        id,
        name,
        slug,
        description,
        price,
        compare_at_price,
        images,
        category_id
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
  
  return NextResponse.json({ items: data })
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
  
  try {
    const body = await request.json()
    const validation = wishlistItemSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.format() },
        { status: 400 }
      )
    }
    
    const { product_id } = validation.data
    
    // Check if item is already in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .match({ user_id: session.user.id, product_id })
      .single()
    
    if (existingItem) {
      return NextResponse.json(
        { message: 'Item already in wishlist' },
        { status: 200 }
      )
    }
    
    // Add to wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: session.user.id,
        product_id,
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error adding to wishlist:', error)
      return NextResponse.json(
        { error: 'Failed to add item to wishlist' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Item added to wishlist', id: data.id })
  } catch (error) {
    console.error('Error processing wishlist request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
  
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Remove from wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .match({ 
        user_id: session.user.id, 
        product_id: productId 
      })
    
    if (error) {
      console.error('Error removing from wishlist:', error)
      return NextResponse.json(
        { error: 'Failed to remove item from wishlist' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Error processing wishlist request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 