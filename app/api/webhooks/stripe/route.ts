import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getStripe } from "@/lib/stripe"
import type Stripe from "stripe"

const stripe = getStripe()

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    if (!signature || !webhookSecret) {
      return new NextResponse("Webhook signature or secret missing", { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      const error = err as Error
      console.error(`Webhook signature verification failed: ${error.message}`)
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status in Supabase
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing",
            stripe_payment_intent_id: session.payment_intent as string,
            metadata: {
              ...session.metadata,
              payment_status: "paid",
              stripe_customer_id: session.customer,
              stripe_payment_method: session.payment_method_types?.[0],
            },
          })
          .eq("stripe_checkout_session_id", session.id)

        if (error) {
          console.error("Error updating order:", error)
          return new NextResponse("Error updating order", { status: 500 })
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update order status in Supabase
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            status: "failed",
            metadata: {
              payment_status: "failed",
              failure_message: paymentIntent.last_payment_error?.message,
            },
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        if (error) {
          console.error("Error updating order:", error)
          return new NextResponse("Error updating order", { status: 500 })
        }

        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge

        // Update order status in Supabase
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "refunded",
            status: "refunded",
            metadata: {
              payment_status: "refunded",
              refund_reason: charge.refunds?.data[0]?.reason,
            },
          })
          .eq("stripe_payment_intent_id", charge.payment_intent as string)

        if (error) {
          console.error("Error updating order:", error)
          return new NextResponse("Error updating order", { status: 500 })
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new NextResponse("Webhook processed successfully", { status: 200 })
  } catch (err) {
    const error = err as Error
    console.error("Webhook error:", error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }
}

// Stripe requires the raw body to construct the event
export const config = {
  api: {
    bodyParser: false,
  },
}

