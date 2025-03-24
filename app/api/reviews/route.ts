import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema for validating review submissions
const reviewSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters')
})

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Get current user
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'You must be logged in to submit a review' },
      { status: 401 }
    )
  }
  
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = reviewSchema.safeParse(body)
    if (!validationResult.success) {
      const error = validationResult.error.format()
      return NextResponse.json(
        { success: false, error: 'Invalid review data', details: error },
        { status: 400 }
      )
    }
    
    const { product_id, rating, comment } = validationResult.data
    
    // Check if user has already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', product_id)
      .eq('user_id', session.user.id)
      .single()
    
    if (existingReview) {
      // Update existing review
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ 
          rating, 
          comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
      
      if (updateError) {
        console.error('Error updating review:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to update review' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Review updated successfully', 
        data: { id: existingReview.id }
      })
    } else {
      // Create new review
      const { data: newReview, error: insertError } = await supabase
        .from('reviews')
        .insert({
          product_id,
          user_id: session.user.id,
          rating,
          comment,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single()
      
      if (insertError) {
        console.error('Error creating review:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to create review' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Review submitted successfully', 
        data: { id: newReview.id }
      })
    }
  } catch (error) {
    console.error('Unexpected error creating/updating review:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 