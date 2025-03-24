
import { Database } from '@/types/supabase';

export interface EmailSubscriber extends Database['public']['Tables']['email_subscribers']['Row'] {
  // Base type from Supabase schema
}

export interface EmailCampaign extends Database['public']['Tables']['email_campaigns']['Row'] {
  // Base type from Supabase schema
}

export interface EmailLog extends Database['public']['Tables']['email_logs']['Row'] {
  // Base type from Supabase schema
}

export interface SubscribeEmailInput {
  email: string;
  first_name?: string;
  last_name?: string;
  preferences?: EmailPreferences;
  source?: string;
}

export interface UpdateEmailPreferencesInput {
  preferences: EmailPreferences;
  status?: 'active' | 'unsubscribed';
}

export interface EmailPreferences {
  marketing: boolean;
  product: boolean;
  newsletter: boolean;
}

export type EmailStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
export type DeliveryStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed';
