import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { EmailSubscriber, UserEmailPreferences, EmailCampaign, EmailEvent } from '@/types/email';

export class EmailRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createSubscriber(data: {
    email: string;
    first_name?: string;
    user_id?: string;
  }): Promise<EmailSubscriber> {
    const { data: subscriber, error } = await this.supabase
      .from('email_subscribers')
      .insert({
        email: data.email,
        first_name: data.first_name,
        user_id: data.user_id,
        is_subscribed: true,
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscriber:', error);
      throw new Error('Failed to create subscriber');
    }

    return subscriber;
  }

  async updateSubscriber(
    id: string,
    data: Partial<EmailSubscriber>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('email_subscribers')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Error updating subscriber:', error);
      throw new Error('Failed to update subscriber');
    }
  }

  async getSubscriberByEmail(email: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .select()
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting subscriber by email:', error);
      throw new Error('Failed to get subscriber');
    }

    return data;
  }

  async getSubscriberByToken(token: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .select()
      .eq('unsubscribe_token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting subscriber by token:', error);
      throw new Error('Failed to get subscriber');
    }

    return data;
  }

  async updateUserEmailPreferences(
    userId: string,
    preferences: Partial<UserEmailPreferences>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update(preferences)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user email preferences:', error);
      throw new Error('Failed to update email preferences');
    }
  }

  async getUserEmailPreferences(
    userId: string
  ): Promise<UserEmailPreferences | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('marketing_emails, product_updates, order_updates')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting user email preferences:', error);
      throw new Error('Failed to get email preferences');
    }

    return data;
  }

  async createCampaign(data: {
    title: string;
    subject: string;
    content: string;
    target_audience: EmailCampaign['target_audience'];
    scheduled_for?: string;
    created_by: string;
  }): Promise<EmailCampaign> {
    const { data: campaign, error } = await this.supabase
      .from('email_campaigns')
      .insert({
        title: data.title,
        subject: data.subject,
        content: data.content,
        target_audience: data.target_audience,
        status: data.scheduled_for ? 'scheduled' : 'draft',
        scheduled_for: data.scheduled_for,
        created_by: data.created_by,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw new Error('Failed to create campaign');
    }

    return campaign;
  }

  async getCampaign(id: string): Promise<EmailCampaign | null> {
    const { data, error } = await this.supabase
      .from('email_campaigns')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting campaign:', error);
      throw new Error('Failed to get campaign');
    }

    return data;
  }

  async updateCampaign(
    id: string,
    data: Partial<EmailCampaign>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('email_campaigns')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Error updating campaign:', error);
      throw new Error('Failed to update campaign');
    }
  }

  async logEmailEvent(event: EmailEvent): Promise<void> {
    const { error } = await this.supabase.from('email_logs').insert({
      type: event.type,
      subscriber_id: event.subscriber_id,
      campaign_id: event.campaign_id,
      metadata: event.metadata,
    });

    if (error) {
      console.error('Error logging email event:', error);
      throw new Error('Failed to log email event');
    }
  }

  async getSubscribersByAudience(
    audience: EmailCampaign['target_audience']
  ): Promise<EmailSubscriber[]> {
    let query = this.supabase
      .from('email_subscribers')
      .select()
      .eq('is_subscribed', true);

    if (audience === 'marketing') {
      query = query.eq('marketing_emails', true);
    } else if (audience === 'product_updates') {
      query = query.eq('product_updates', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting subscribers by audience:', error);
      throw new Error('Failed to get subscribers');
    }

    return data;
  }
}
