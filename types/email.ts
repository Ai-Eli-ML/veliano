import { Database } from '@/types/supabase';

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_id?: string;
  is_subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
}

export interface UserEmailPreferences {
  marketing_emails: boolean;
  product_updates: boolean;
  order_updates: boolean;
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  target_audience: 'all' | 'marketing' | 'product_updates';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  sent_count?: number;
  failed_count?: number;
  cta_link?: string;
  cta_text?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailEvent {
  type: 'subscribe' | 'unsubscribe' | 'campaign_created' | 'campaign_sent' | 'email_opened' | 'link_clicked';
  subscriber_id?: string;
  campaign_id?: string;
  metadata?: Record<string, any>;
}

export interface EmailLog {
  id: string;
  type: string;
  recipient_email: string;
  campaign_id?: string;
  order_id?: string;
  metadata?: Record<string, any>;
  status: 'sent' | 'failed' | 'opened' | 'clicked';
  created_at: string;
}

export interface Order {
  id: string
  customer_email: string
  total: number
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
  }
  created_at: string
  updated_at: string
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
  preferences?: UserEmailPreferences;
  source?: string;
}

export interface UpdateEmailPreferencesInput {
  preferences: UserEmailPreferences;
  status?: EmailStatus;
}

export type EmailStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
export type DeliveryStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed';

export type EmailTemplate = 
  | 'welcome'
  | 'order-confirmation'
  | 'shipping-update'
  | 'abandoned-cart'
  | 'newsletter'
  | 'password-reset';
