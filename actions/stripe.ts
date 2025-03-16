"use server"

import { getStripe } from "@/lib/stripe"
import { z } from "zod"
import type Stripe from "stripe"

const lineItemSchema = z.object({
  price_data: z.object({
    currency: z.string(),
    product_data: z.object({
      name: z.string(),
      images: z.array(z.string()),
    }),
    unit_amount: z.number().int().positive(),
  }),
  quantity: z.number().int().positive(),
})

const checkoutSessionSchema = z.object({
  lineItems: z.array(lineItemSchema).min(1, "Cart must not be empty"),
  customerEmail: z.string().email().optional(),
  metadata: z.record(z.string()).optional(),
})

interface CreateCheckoutSessionProps {
  lineItems: any[]
  customerEmail?: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession({ lineItems, customerEmail, metadata = {} }: CreateCheckoutSessionProps) {
  try {
    // Validate input
    const validatedData = checkoutSessionSchema.parse({
      lineItems,
      customerEmail,
      metadata,
    })

    const stripe = getStripe()

    // Calculate order total
    const orderTotal = lineItems.reduce(
      (sum, item) => sum + (item.price_data.unit_amount * item.quantity),
      0
    )

    // Determine shipping options based on order total
    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: orderTotal >= 10000 ? 0 : 1000, // Free shipping over $100
            currency: "usd",
          },
          display_name: "Standard shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day" as const,
              value: 5,
            },
            maximum: {
              unit: "business_day" as const,
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
              unit: "business_day" as const,
              value: 1,
            },
            maximum: {
              unit: "business_day" as const,
              value: 2,
            },
          },
        },
      },
    ]

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: validatedData.lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: validatedData.customerEmail,
      metadata: {
        ...validatedData.metadata,
        orderTotal: orderTotal.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"],
      },
      shipping_options: shippingOptions,
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        shipping_address: {
          message: "Please enter your shipping address where you'd like to receive your order.",
        },
        submit: {
          message: "We'll email you instructions on how to track your order.",
        },
      },
    } as Stripe.Checkout.SessionCreateParams)

    if (!session?.url) {
      throw new Error("Failed to create checkout session")
    }

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    if (error instanceof z.ZodError) {
      return { error: "Invalid checkout data: " + error.errors[0].message }
    }
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "An unexpected error occurred" }
  }
}

