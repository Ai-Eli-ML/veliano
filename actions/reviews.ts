"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000),
})

export async function submitReview(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to submit a review" }
  }

  try {
    // Parse and validate form data
    const productId = formData.get("productId") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    const validatedData = reviewSchema.parse({
      productId,
      rating,
      title,
      content,
    })

    // Check if user has already reviewed this product - mock data for now
    // const { data: existingReview } = await supabase
    //   .from("product_reviews")
    //   .select("id")
    //   .eq("product_id", productId)
    //   .eq("user_id", session.user.id)

    // if (existingReview) {
    //   return { success: false, error: "You have already reviewed this product" }
    // }

    // Mock check for existing review - assume no review exists
    const existingReview = null

    // Check if user has purchased the product
    const { data: orders } = await supabase
      .from("orders")
      .select(`
        id,
        order_items(product_id)
      `)
      .eq("user_id", session.user.id)
      .eq("payment_status", "paid")

    const isVerifiedPurchase =
      orders?.some((order) => order.order_items.some((item: any) => item.product_id === productId)) || false

    // Get user profile
    const { data: userProfile } = await supabase
      .from("users")
      .select("full_name, avatar_url")
      .eq("id", session.user.id)
      .single()

    // Insert review - mock data for now
    // const { data, error } = await supabase
    //   .from("product_reviews")
    //   .insert({
    //     product_id: productId,
    //     user_id: session.user.id,
    //     rating,
    //     title,
    //     content,
    //     helpful_count: 0,
    //     verified_purchase: isVerifiedPurchase,
    //   })
    //   .select()
    //   .single()

    // if (error) {
    //   console.error("Error submitting review:", error)
    //   return { success: false, error: "Failed to submit review" }
    // }

    // Mock review data
    const data = {
      id: "mock-review-id",
      product_id: productId,
      user_id: session.user.id,
      rating,
      title,
      content,
      helpful_count: 0,
      verified_purchase: isVerifiedPurchase,
      created_at: new Date().toISOString(),
    }

    // Update product rating - commented out for now
    // await updateProductRating(productId)

    // Revalidate product page
    revalidatePath(`/products/[category]/${productId}`)

    return { success: true, data }
  } catch (error) {
    console.error("Error in submitReview:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function markReviewHelpful(reviewId: string) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to mark a review as helpful" }
  }

  try {
    // Check if user has already marked this review as helpful - mock data for now
    // const { data: existingMark } = await supabase
    //   .from("review_helpful_marks")
    //   .select("id")
    //   .eq("review_id", reviewId)
    //   .eq("user_id", session.user.id)
    //   .single()

    // Mock check for existing mark - assume no mark exists
    const existingMark = null

    if (existingMark) {
      // Remove the mark
      // await supabase.from("review_helpful_marks").delete().eq("id", existingMark.id)

      // Decrement helpful count
      // await supabase.rpc("decrement_review_helpful_count", { review_id: reviewId })

      return { success: true, action: "removed" }
    } else {
      // Add the mark
      // await supabase.from("review_helpful_marks").insert({
      //   review_id: reviewId,
      //   user_id: session.user.id,
      // })

      // Increment helpful count
      // await supabase.rpc("increment_review_helpful_count", { review_id: reviewId })

      return { success: true, action: "added" }
    }
  } catch (error) {
    console.error("Error in markReviewHelpful:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteReview(reviewId: string) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to delete a review" }
  }

  try {
    // Get the review to check ownership and product ID - mock data for now
    // const { data: review, error: reviewError } = await supabase
    //   .from("product_reviews")
    //   .select("user_id, product_id")
    //   .eq("id", reviewId)
    //   .single()

    // if (reviewError) {
    //   console.error("Error fetching review:", reviewError)
    //   return { success: false, error: "Failed to fetch review" }
    // }

    // Mock review data
    const review = {
      user_id: session.user.id, // Assume the review belongs to the current user
      product_id: "mock-product-id",
    }

    const { data: userProfile } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (review.user_id !== session.user.id && !userProfile?.is_admin) {
      return { success: false, error: "You don't have permission to delete this review" }
    }

    // Delete the review
    // const { error } = await supabase.from("product_reviews").delete().eq("id", reviewId)

    // if (error) {
    //   console.error("Error deleting review:", error)
    //   return { success: false, error: "Failed to delete review" }
    // }

    // Update product rating - commented out for now
    // await updateProductRating(review.product_id)

    // Revalidate product page
    revalidatePath(`/products/[category]/${review.product_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in deleteReview:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Helper function to update product rating - commented out for now
// async function updateProductRating(productId: string) {
//   try {
//     // Calculate average rating - mock data for now
//     // const { data, error } = await supabase.from("product_reviews").select("rating").eq("product_id", productId)

//     // if (error || !data || data.length === 0) {
//     //   return
//     // }

//     // const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
//     // const averageRating = totalRating / data.length

//     // Mock rating data
//     const averageRating = 4.5
//     const reviewCount = 12

//     // Update product metadata with rating info
//     await supabaseAdmin
//       .from("products")
//       .update({
//         metadata: {
//           average_rating: averageRating,
//           review_count: reviewCount,
//         },
//       })
//       .eq("id", productId)
//   } catch (error) {
//     console.error("Error updating product rating:", error)
//   }
// }

export async function getProductReviews(productId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Get reviews - mock data for now
    // const { data, error } = await supabase
    //   .from("product_reviews")
    //   .select("*")
    //   .eq("product_id", productId)
    //   .order("created_at", { ascending: false })

    // if (error) {
    //   console.error("Error fetching product reviews:", error)
    //   return { success: false, error: "Failed to fetch product reviews" }
    // }

    // Mock reviews data
    const data = [
      {
        id: "1",
        product_id: productId,
        user_id: "user1",
        rating: 5,
        title: "Amazing product!",
        content: "This is the best product I've ever purchased. Highly recommended!",
        helpful_count: 12,
        verified_purchase: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          full_name: "John Doe",
          avatar_url: null,
        },
      },
      {
        id: "2",
        product_id: productId,
        user_id: "user2",
        rating: 4,
        title: "Great quality",
        content: "Very good quality and fast shipping. Would buy again.",
        helpful_count: 5,
        verified_purchase: true,
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          full_name: "Jane Smith",
          avatar_url: null,
        },
      },
      {
        id: "3",
        product_id: productId,
        user_id: "user3",
        rating: 3,
        title: "Good but could be better",
        content: "The product is good but there's room for improvement.",
        helpful_count: 2,
        verified_purchase: false,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          full_name: "Mike Johnson",
          avatar_url: null,
        },
      },
    ]

    // Calculate review stats
    const stats = calculateReviewStats(data)

    return { success: true, data, stats }
  } catch (error) {
    console.error("Error in getProductReviews:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

function calculateReviewStats(reviews: any[]) {
  if (reviews.length === 0) {
    return getDefaultReviewStats()
  }

  const totalReviews = reviews.length
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / totalReviews

  // Count reviews by rating
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  reviews.forEach((review) => {
    ratingCounts[review.rating as keyof typeof ratingCounts]++
  })

  return {
    averageRating,
    totalReviews,
    ratingCounts,
  }
}

function getDefaultReviewStats() {
  return {
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  }
}

