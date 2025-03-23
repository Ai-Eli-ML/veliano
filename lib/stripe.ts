import Stripe from "stripe"

// Only initialize Stripe if we have the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Determine if we're in test mode
export const isStripeTestMode = process.env.NODE_ENV !== 'production' || 
  (stripeSecretKey && stripeSecretKey.startsWith('sk_test_'))

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16", // Use the latest stable API version
      appInfo: {
        name: "Veliano Jewelry",
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

// Helper to detect test cards for development purposes
export function isTestCard(cardNumber: string) {
  const testCards = [
    '4242424242424242', // Visa success
    '4000000000009995', // Visa insufficient funds
    '4000000000003220', // Visa 3D Secure auth
    '4000008400001629', // Visa requires authentication
  ]
  
  return testCards.some(card => cardNumber.includes(card))
}

// Get appropriate Stripe dashboard URL based on environment
export function getStripeDashboardUrl(resourceType: 'payment' | 'customer' | 'subscription', id: string) {
  const baseUrl = isStripeTestMode
    ? 'https://dashboard.stripe.com/test'
    : 'https://dashboard.stripe.com'
    
  switch (resourceType) {
    case 'payment':
      return `${baseUrl}/payments/${id}`
    case 'customer':
      return `${baseUrl}/customers/${id}`
    case 'subscription':
      return `${baseUrl}/subscriptions/${id}`
    default:
      return baseUrl
  }
}

