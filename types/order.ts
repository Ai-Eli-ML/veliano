export type Order = {
  id: string
  created_at: string
  total: number
  email: string
  referral_code?: string
  status: string
  shipping_address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  billing_address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: {
    product_id: string
    quantity: number
    price: number
  }[]
} 