import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createServerSupabaseClient } from "@/lib/supabase"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(req: Request) {
  // Check if required environment variables are set
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable")
    return new NextResponse("Server misconfigured", { status: 500 })
  }

  const body = await req.text()
  const signature = headers().get("Stripe-Signature")

  if (!signature) {
    return new NextResponse("No signature found", { status: 400 })
  }

  let event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as any

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    try {
      const stripe = getStripe()
      // Retrieve the session with line items
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer"],
      })

      const lineItems = expandedSession.line_items
      const customerEmail = expandedSession.customer_details?.email
      const customerName = expandedSession.customer_details?.name
      const metadata = expandedSession.metadata

      // Create order in database
      try {
        const supabase = createServerSupabaseClient()

        // Generate order number (timestamp + random string)
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

        // Get or create user
        let userId = null
        if (customerEmail) {
          const { data: user } = await supabase.from("users").select("id").eq("email", customerEmail).single()

          if (user) {
            userId = user.id
          }
        }

        // Create order
        const { data: order, error: orderError } = await supabase.from("orders").insert({
          order_number: orderNumber,
          user_id: userId,
          email: customerEmail || "",
          total_price: session.amount_total / 100,
          subtotal_price: session.amount_subtotal / 100,
          shipping_price: (session.shipping_cost?.amount_total || 0) / 100,
          tax_price: (session.total_details?.amount_tax || 0) / 100,
          status: "processing",
          payment_status: session.payment_status,
          fulfillment_status: "unfulfilled",
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          shipping_address: session.shipping_details,
          billing_address: session.customer_details?.address,
          notes: metadata?.notes || null,
          currency: session.currency?.toUpperCase() || "USD"
        }).select().single()

        if (orderError) {
          console.error("Error creating order:", orderError)
          return new NextResponse("Error creating order", { status: 500 })
        }

        // Create order items
        if (lineItems?.data) {
          const orderItems = lineItems.data.map((item: any) => ({
            order_id: order.id,
            name: item.description || "Product",
            product_id: item.price?.product,
            variant_id: metadata?.variant_id || null,
            quantity: item.quantity,
            price: item.price?.unit_amount / 100,
            total_price: item.amount_total / 100,
            sku: metadata?.sku || null,
            properties: metadata?.properties || null
          }))

          const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

          if (itemsError) {
            console.error("Error creating order items:", itemsError)
            return new NextResponse("Error creating order items", { status: 500 })
          }
        }

        // Send order confirmation email
        if (customerEmail) {
          await sendOrderConfirmationEmail({
            to: customerEmail,
            orderNumber,
            customerName: customerName || "Customer",
            orderItems: lineItems?.data || [],
            total: session.amount_total / 100,
          })
        }
      } catch (error) {
        console.error("Error processing order:", error)
        return new NextResponse("Error processing order", { status: 500 })
      }
    } catch (error) {
      console.error("Error retrieving session:", error)
      return new NextResponse("Error retrieving session", { status: 500 })
    }
  }

  return new NextResponse(null, { status: 200 })
}

