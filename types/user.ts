import { Database } from '@/types/supabase'

export type DbProfile = Database['public']['Tables']['profiles']['Row']

export interface Address {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface UserProfile extends DbProfile {
  shipping_addresses?: Address[]
  preferences?: {
    marketing_emails: boolean
    order_updates: boolean
    newsletter: boolean
  }
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