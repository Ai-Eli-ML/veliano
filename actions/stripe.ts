"use server"

import { getStripe } from "@/lib/stripe"

interface CreateCheckoutSessionProps {
  lineItems: any[]
  customerEmail?: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession({ lineItems, customerEmail, metadata = {} }: CreateCheckoutSessionProps) {
  if (!lineItems.length) {
    return { error: "No items in cart" }
  }

  try {
    const stripe = getStripe()
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: customerEmail,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Express shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { error: "Failed to create checkout session" }
  }
}

