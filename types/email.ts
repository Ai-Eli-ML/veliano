import { Database } from '@/types/supabase';

export interface EmailSubscriber {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  status: 'active' | 'unsubscribed' | 'bounced'
  user_id: string | null
  preferences: EmailPreferences
  source: string
  created_at: string
  updated_at: string
}

export interface EmailPreferences {
  marketing: boolean
  transactional: boolean
  product_updates: boolean
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  preheader: string | null
  content: string
  template_id: string
  scheduled_for: string | null
  sent_at: string | null
  target_audience: 'all' | 'active' | 'inactive' | 'custom'
  segment_data: Record<string, any> | null
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  created_at: string
  updated_at: string
  created_by: string
}

export interface EmailLog {
  id: string
  subscriber_id: string
  campaign_id: string | null
  event_type: 'subscribe' | 'unsubscribe' | 'resubscribe' | 'open' | 'click' | 'bounce' | 'complaint' | 'preference_update'
  metadata: Record<string, any> | null
  created_at: string
}

export interface EmailSubscriptionFormProps {
  variant?: 'default' | 'minimal' | 'footer'
  className?: string
  showName?: boolean
}

export interface EmailPreferencesProps {
  className?: string
}

export interface AdminCampaignEditorProps {
  initialCampaign?: Partial<EmailCampaign>
  onSave?: (campaign: EmailCampaign) => void
  className?: string
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

export type EmailStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
export type DeliveryStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed';
