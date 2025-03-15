"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const applySchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Code can only contain letters, numbers, underscores, and hyphens",
    }),
  paymentMethod: z.enum(["paypal", "bank_transfer"]),
  paymentDetails: z.record(z.string()),
})

export async function applyForAffiliateProgram(formData: FormData) {
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
    const code = formData.get("code") as string
    const paymentMethod = formData.get("paymentMethod") as string

    // Get payment details based on payment method
    const paymentDetails: Record<string, string> = {}
    if (paymentMethod === "paypal") {
      paymentDetails.email = formData.get("paypalEmail") as string
    } else if (paymentMethod === "bank_transfer") {
      paymentDetails.accountName = formData.get("accountName") as string
      paymentDetails.accountNumber = formData.get("accountNumber") as string
      paymentDetails.routingNumber = formData.get("routingNumber") as string
      paymentDetails.bankName = formData.get("bankName") as string
    }

    const validatedData = applySchema.parse({
      code,
      paymentMethod,
      paymentDetails,
    })

    // Check if user already has an affiliate account
    const { data: existingAffiliate } = await supabase
      .from("affiliates")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (existingAffiliate) {
      return { success: false, error: "You already have an affiliate account" }
    }

    // Check if code is already taken
    const { data: existingCode } = await supabase
      .from("affiliates")
      .select("id")
      .eq("code", validatedData.code)
      .single()

    if (existingCode) {
      return { success: false, error: "This affiliate code is already taken" }
    }

    // Create affiliate account
    const { data, error } = await supabase
      .from("affiliates")
      .insert({
        user_id: session.user.id,
        code: validatedData.code,
        commission_rate: 10.0, // Default 10%
        status: "pending", // Requires admin approval
        payment_method: {
          type: validatedData.paymentMethod,
          details: validatedData.paymentDetails,
        },
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating affiliate account:", error)
      return { success: false, error: "Failed to create affiliate account" }
    }

    // Revalidate affiliate pages
    revalidatePath("/account/affiliate")

    return { success: true, data }
  } catch (error) {
    console.error("Error in applyForAffiliateProgram:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getAffiliateProfile() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to view your affiliate profile" }
  }

  try {
    // Get affiliate profile
    const { data, error } = await supabase.from("affiliates").select("*").eq("user_id", session.user.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No affiliate profile found
        return { success: true, data: null }
      }

      console.error("Error fetching affiliate profile:", error)
      return { success: false, error: "Failed to fetch affiliate profile" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getAffiliateProfile:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getAffiliateStats() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to view your affiliate stats" }
  }

  try {
    // Get affiliate profile
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (affiliateError) {
      if (affiliateError.code === "PGRST116") {
        // No affiliate profile found
        return { success: true, data: null }
      }

      console.error("Error fetching affiliate profile:", affiliateError)
      return { success: false, error: "Failed to fetch affiliate profile" }
    }

    // Get affiliate transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from("affiliate_transactions")
      .select("*")
      .eq("affiliate_id", affiliate.id)

    if (transactionsError) {
      console.error("Error fetching affiliate transactions:", transactionsError)
      return { success: false, error: "Failed to fetch affiliate transactions" }
    }

    // Get affiliate clicks - mock data for now since the table doesn't exist
    // const { count: clicks, error: clicksError } = await supabase
    //   .from("affiliate_clicks")
    //   .select("*", { count: "exact", head: true })
    //   .eq("affiliate_id", affiliate.id)

    // if (clicksError) {
    //   console.error("Error fetching affiliate clicks:", clicksError)
    // }
    
    // Mock clicks data
    const clicks = 150 // Mock value

    // Calculate stats
    const totalEarnings = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const pendingEarnings = transactions.filter((tx) => tx.status === "pending").reduce((sum, tx) => sum + tx.amount, 0)
    const paidEarnings = transactions.filter((tx) => tx.status === "paid").reduce((sum, tx) => sum + tx.amount, 0)

    const conversions = transactions.length
    const conversionRate = clicks ? (conversions / clicks) * 100 : 0

    return {
      success: true,
      data: {
        clicks: clicks || 0,
        conversions,
        conversionRate,
        totalEarnings,
        pendingEarnings,
        paidEarnings,
      },
    }
  } catch (error) {
    console.error("Error in getAffiliateStats:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

