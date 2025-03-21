import { Database } from '@/types/supabase'

export type DbProfile = Database['public']['Tables']['profiles']['Row']

export interface Address {
  id?: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  is_primary?: boolean
}

export interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string | null
  address?: string | null
  bio?: string | null
  website?: string | null
  avatar_url?: string | null
  is_admin?: boolean
  shipping_addresses?: Address[]
  preferences?: UserPreferences
  created_at?: string
  updated_at?: string
}

export interface UserPreferences {
  marketingEmails: boolean
  orderUpdates: boolean
  newProductAlerts: boolean
  saleAlerts: boolean
  darkMode: boolean
}

export interface Session {
  user: {
    id: string
    email?: string
    role?: string
  }
  expires_at: number
}

export interface AuthError {
  message: string
  status?: number
}

export type AuthState = {
  user: UserProfile | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

export type AuthAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_SESSION'; payload: Session }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AuthError }
  | { type: 'CLEAR_ERROR' } 