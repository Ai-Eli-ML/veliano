"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const applySchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500, "Bio cannot exceed 500 characters"),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
})

export async function applyForAmbassadorProgram(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to apply" }
  }

  try {
    // Parse and validate form data
    const bio = formData.get("bio") as string
    const instagram = formData.get("instagram") as string
    const tiktok = formData.get("tiktok") as string
    const youtube = formData.get("youtube") as string
    const twitter = formData.get("twitter") as string
    const facebook = formData.get("facebook") as string
    const website = formData.get("website") as string

    const validatedData = applySchema.parse({
      bio,
      instagram,
      tiktok,
      youtube,
      twitter,
      facebook,
      website,
    })

    // Check if user already has an ambassador account
    const { data: existingAmbassador } = await supabase
      .from("ambassadors")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (existingAmbassador) {
      return { success: false, error: "You already have an ambassador account" }
    }

    // Generate a unique discount code
    const username = session.user.email?.split("@")[0] || "user"
    const discountCode = `${username.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`

    // Create ambassador account
    const { data, error } = await supabase
      .from("ambassadors")
      .insert({
        user_id: session.user.id,
        bio: validatedData.bio,
        social_links: {
          instagram: validatedData.instagram,
          tiktok: validatedData.tiktok,
          youtube: validatedData.youtube,
          twitter: validatedData.twitter,
          facebook: validatedData.facebook,
          website: validatedData.website,
        },
        discount_code: discountCode,
        discount_percentage: 10, // Default 10% discount
        commission_rate: 15, // Default 15% commission
        status: "pending", // Requires admin approval
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating ambassador account:", error)
      return { success: false, error: "Failed to create ambassador account" }
    }

    // Revalidate ambassador pages
    revalidatePath("/account/ambassador")
    revalidatePath("/ambassador-program")

    return { success: true, data }
  } catch (error) {
    console.error("Error in applyForAmbassadorProgram:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getAmbassadorProfile() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to view your ambassador profile" }
  }

  try {
    // Get ambassador profile
    const { data, error } = await supabase.from("ambassadors").select("*").eq("user_id", session.user.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No ambassador profile found
        return { success: true, data: null }
      }

      console.error("Error fetching ambassador profile:", error)
      return { success: false, error: "Failed to fetch ambassador profile" }
    }

    // Transform the payment_method data to match the expected type
    const transformedData = {
      ...data,
      payment_method: data.payment_method ? {
        type: (data.payment_method as any).type || 'unknown',
        details: (data.payment_method as any).details || {}
      } : null
    }

    return { success: true, data: transformedData }
  } catch (error) {
    console.error("Error in getAmbassadorProfile:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getAmbassadorStats() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to view your ambassador stats" }
  }

  try {
    // Get ambassador profile
    const { data: ambassador, error: ambassadorError } = await supabase
      .from("ambassadors")
      .select("id, discount_code")
      .eq("user_id", session.user.id)
      .single()

    if (ambassadorError) {
      if (ambassadorError.code === "PGRST116") {
        // No ambassador profile found
        return { success: true, data: null }
      }

      console.error("Error fetching ambassador profile:", ambassadorError)
      return { success: false, error: "Failed to fetch ambassador profile" }
    }

    // Get orders with ambassador's discount code - mock data for now
    // const { data: orders, error: ordersError } = await supabase
    //   .from("orders")
    //   .select("total_price, created_at")
    //   .eq("discount_code", ambassador.discount_code)
    //   .order("created_at", { ascending: false })

    // if (ordersError) {
    //   console.error("Error fetching ambassador orders:", ordersError)
    //   return { success: false, error: "Failed to fetch ambassador orders" }
    // }

    // Mock orders data
    const orders = [
      { total_price: 250, created_at: new Date().toISOString() },
      { total_price: 350, created_at: new Date().toISOString() },
      { total_price: 150, created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
    ]

    // Mock ambassador data
    const commission_rate = 15 // Default commission rate

    // Mock tiers data
    const tiers = [
      {
        id: "1",
        name: "Bronze",
        minimum_sales: 0,
        commission_rate: 15,
        benefits: ["Basic commission rate", "Access to marketing materials"]
      },
      {
        id: "2",
        name: "Silver",
        minimum_sales: 1000,
        commission_rate: 20,
        benefits: ["Higher commission rate", "Priority support", "Featured on website"]
      },
      {
        id: "3",
        name: "Gold",
        minimum_sales: 5000,
        commission_rate: 25,
        benefits: ["Premium commission rate", "VIP support", "Featured on website", "Exclusive products"]
      }
    ]

    // Calculate stats
    const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0)
    const totalEarnings = totalSales * (commission_rate / 100)

    // Calculate monthly stats
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyOrders = orders.filter((order) => new Date(order.created_at) >= firstDayOfMonth)
    const monthlySales = monthlyOrders.reduce((sum, order) => sum + order.total_price, 0)
    const monthlyEarnings = monthlySales * (commission_rate / 100)

    // Determine current tier and next tier
    const currentTier = tiers.filter((tier) => tier.minimum_sales <= totalSales).pop() || tiers[0]
    const nextTierIndex = tiers.findIndex((tier) => tier.id === currentTier.id) + 1
    const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : undefined

    // Calculate progress to next tier
    let progressToNextTier = 100 // Default to 100% if at max tier
    if (nextTier) {
      const tierDifference = nextTier.minimum_sales - currentTier.minimum_sales
      const salesAboveCurrentTier = totalSales - currentTier.minimum_sales
      progressToNextTier = Math.min(100, Math.round((salesAboveCurrentTier / tierDifference) * 100))
    }

    return {
      success: true,
      data: {
        monthlySales,
        monthlyEarnings,
        totalSales,
        totalEarnings,
        currentTier,
        nextTier,
        progressToNextTier,
      },
    }
  } catch (error) {
    console.error("Error in getAmbassadorStats:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateAmbassadorProfile(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to update your profile" }
  }

  try {
    // Parse and validate form data
    const bio = formData.get("bio") as string
    const instagram = formData.get("instagram") as string
    const tiktok = formData.get("tiktok") as string
    const youtube = formData.get("youtube") as string
    const twitter = formData.get("twitter") as string
    const facebook = formData.get("facebook") as string
    const website = formData.get("website") as string

    const validatedData = applySchema.parse({
      bio,
      instagram,
      tiktok,
      youtube,
      twitter,
      facebook,
      website,
    })

    // Update ambassador profile
    const { data, error } = await supabase
      .from("ambassadors")
      .update({
        bio: validatedData.bio,
        social_links: {
          instagram: validatedData.instagram,
          tiktok: validatedData.tiktok,
          youtube: validatedData.youtube,
          twitter: validatedData.twitter,
          facebook: validatedData.facebook,
          website: validatedData.website,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating ambassador profile:", error)
      return { success: false, error: "Failed to update ambassador profile" }
    }

    // Revalidate ambassador pages
    revalidatePath("/account/ambassador")

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateAmbassadorProfile:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

