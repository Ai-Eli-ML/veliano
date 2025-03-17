"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { sendShippingConfirmationEmail } from "@/lib/email"
import { z } from "zod"

const updateOrderSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["processing", "shipped", "delivered", "cancelled"]),
  fulfillmentStatus: z.enum(["unfulfilled", "fulfilled", "partially_fulfilled"]),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
})

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  // Check if user is authenticated and is admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to perform this action" }
  }

  // Check if user is admin
  const { data: userProfile } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

  if (!userProfile?.is_admin) {
    return { success: false, error: "You don't have permission to perform this action" }
  }

  try {
    // Parse and validate form data
    const orderId = formData.get("orderId") as string
    const status = formData.get("status") as string
    const fulfillmentStatus = formData.get("fulfillmentStatus") as string
    const trackingNumber = formData.get("trackingNumber") as string
    const carrier = formData.get("carrier") as string

    const validatedData = updateOrderSchema.parse({
      orderId,
      status,
      fulfillmentStatus,
      trackingNumber,
      carrier,
    })

    // Get the order before updating
    const { data: oldOrder } = await supabase.from("orders").select("*").eq("id", validatedData.orderId).single()

    if (!oldOrder) {
      return { success: false, error: "Order not found" }
    }

    // Update order
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: validatedData.status,
        fulfillment_status: validatedData.fulfillmentStatus,
        tracking_number: validatedData.trackingNumber,
        carrier: validatedData.carrier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validatedData.orderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return { success: false, error: "Failed to update order" }
    }

    // Send shipping confirmation email if order was just marked as shipped
    if (
      oldOrder.fulfillment_status !== "fulfilled" &&
      validatedData.fulfillmentStatus === "fulfilled" &&
      validatedData.trackingNumber &&
      validatedData.carrier
    ) {
      await sendShippingConfirmationEmail(order, validatedData.trackingNumber, validatedData.carrier)
    }

    // Revalidate order pages
    revalidatePath(`/account/orders/${validatedData.orderId}`)
    revalidatePath("/account/orders")
    revalidatePath("/admin/orders")

    return { success: true, data: order }
  } catch (error) {
    console.error("Error in updateOrderStatus:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

