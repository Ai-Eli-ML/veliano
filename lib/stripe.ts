import Stripe from "stripe"

// Only initialize Stripe if we have the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia", // Use the latest API version
      appInfo: {
        name: "Custom Gold Grillz",
        version: "1.0.0",
      },
    })
  : null

// Helper function to get the Stripe instance
export function getStripe() {
  if (!stripe) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable")
  }
  return stripe
}

