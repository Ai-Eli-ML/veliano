"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function getUserMembership() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to view your membership" }
  }

  try {
    // Get user's total spend
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("total_price")
      .eq("user_id", session.user.id)
      .eq("status", "completed")

    if (ordersError) {
      console.error("Error fetching user orders:", ordersError)
      return { success: false, error: "Failed to fetch user orders" }
    }

    const totalSpend = orders.reduce((sum, order) => sum + order.total_price, 0)

    // Get membership tiers - mock data for now
    // const { data: tiers, error: tiersError } = await supabase
    //   .from("membership_tiers")
    //   .select("*")
    //   .order("minimum_spend", { ascending: true })

    // if (tiersError) {
    //   console.error("Error fetching membership tiers:", tiersError)
    //   return { success: false, error: "Failed to fetch membership tiers" }
    // }

    // Mock tiers data
    const tiers = [
      {
        id: "1",
        name: "Standard",
        minimum_spend: 0,
        discount_percentage: 0,
        benefits: ["Free shipping on orders over $100"]
      },
      {
        id: "2",
        name: "Silver",
        minimum_spend: 500,
        discount_percentage: 5,
        benefits: ["Free shipping on all orders", "5% discount on all products", "Early access to new products"]
      },
      {
        id: "3",
        name: "Gold",
        minimum_spend: 1000,
        discount_percentage: 10,
        benefits: ["Free shipping on all orders", "10% discount on all products", "Early access to new products", "Exclusive products"]
      },
      {
        id: "4",
        name: "Platinum",
        minimum_spend: 2500,
        discount_percentage: 15,
        benefits: ["Free shipping on all orders", "15% discount on all products", "Early access to new products", "Exclusive products", "Personal shopper"]
      }
    ]

    // Determine current tier
    const currentTier = tiers.filter((tier) => tier.minimum_spend <= totalSpend).pop() || tiers[0]
    const nextTierIndex = tiers.findIndex((tier) => tier.id === currentTier.id) + 1
    const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null

    // Calculate progress to next tier
    let progressToNextTier = 100 // Default to 100% if at max tier
    if (nextTier) {
      const tierDifference = nextTier.minimum_spend - currentTier.minimum_spend
      const spendAboveCurrentTier = totalSpend - currentTier.minimum_spend
      progressToNextTier = Math.min(100, Math.round((spendAboveCurrentTier / tierDifference) * 100))
    }

    // Check if user has a membership record - mock data for now
    // const { data: membership, error: membershipError } = await supabase
    //   .from("user_memberships")
    //   .select("*")
    //   .eq("user_id", session.user.id)
    //   .single()

    // if (membershipError && membershipError.code !== "PGRST116") {
    //   console.error("Error fetching user membership:", membershipError)
    //   return { success: false, error: "Failed to fetch user membership" }
    // }

    // Create or update user membership if tier has changed
    // if (!membership || membership.tier_id !== currentTier.id) {
    //   const { error: updateError } = await supabase
    //     .from("user_memberships")
    //     .upsert({
    //       user_id: session.user.id,
    //       tier_id: currentTier.id,
    //       joined_at: membership ? membership.joined_at : new Date().toISOString(),
    //       updated_at: new Date().toISOString(),
    //     })

    //   if (updateError) {
    //     console.error("Error updating user membership:", updateError)
    //     return { success: false, error: "Failed to update user membership" }
    //   }
    // }

    // Mock membership data
    const membership = {
      user_id: session.user.id,
      tier_id: currentTier.id,
      joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      updated_at: new Date().toISOString(),
    }

    // Calculate days as member
    const daysAsMember = Math.floor(
      (new Date().getTime() - new Date(membership.joined_at).getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      success: true,
      data: {
        userId: session.user.id,
        tierId: currentTier.id,
        tier: currentTier,
        currentSpend: totalSpend,
        nextTier,
        progressToNextTier,
        joinedAt: membership.joined_at,
        updatedAt: membership.updated_at,
        daysAsMember,
      },
    }
  } catch (error) {
    console.error("Error in getUserMembership:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

