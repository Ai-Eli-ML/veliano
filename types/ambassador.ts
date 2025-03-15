import { Json } from './supabase';

export type AmbassadorProfile = {
  id: string
  user_id: string
  status: string
  bio: string | null
  social_media: Json | null
  discount_code?: string
  commission_rate: number
  total_earnings: number | null
  total_paid: number | null
  payment_method: {
    type: string;
    details?: Record<string, string | number | boolean>;
  } | null
  created_at: string
  updated_at: string
}

export type AmbassadorTier = {
  id: string
  name: string
  minimum_sales: number
  commission_rate: number
  benefits: string[]
}

export type AmbassadorStats = {
  monthly_sales: number
  monthly_earnings: number
  total_sales: number
  total_earnings: number
  current_tier: AmbassadorTier
  next_tier?: AmbassadorTier
  progress_to_next_tier: number
}

