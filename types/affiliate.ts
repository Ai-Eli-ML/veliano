import { Json } from './supabase';

export type AffiliateProfile = {
  id: string
  user_id: string
  code: string
  commission_rate: number
  status: "active" | "pending" | "inactive"
  total_earnings: number
  total_paid: number
  payment_method: {
    type: string;
    details?: Record<string, string | number | boolean>;
  } | null;
  created_at: string
  updated_at: string
}

export type AffiliateTransaction = {
  id: string
  affiliateId: string
  orderId: string | null
  amount: number
  status: "pending" | "paid" | "cancelled"
  payoutId: string | null
  createdAt: string
}

export type AffiliateStats = {
  clicks: number
  conversions: number
  conversionRate: number
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
}

