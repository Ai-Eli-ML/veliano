
import { createClient } from '@/lib/supabase/server';
import { type Database } from '@/types/supabase';
import { 
  type EmailSubscriber, 
  type EmailCampaign,
  type EmailLog,
  type SubscribeEmailInput,
  type UpdateEmailPreferencesInput,
  type EmailPreferences
} from '@/types/email';

export class EmailRepository {
  private supabase = createClient();

  /**
   * Get a subscriber by email
   */
  async getSubscriberByEmail(email: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
    return data as EmailSubscriber | null;
  }

  /**
   * Get a subscriber by user ID
   */
  async getSubscriberByUserId(userId: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as EmailSubscriber | null;
  }

  /**
   * Subscribe a new email
   */
  async subscribeEmail(data: SubscribeEmailInput): Promise<EmailSubscriber> {
    const { data: subscriber, error } = await this.supabase
      .from('email_subscribers')
      .insert({
        email: data.email.toLowerCase(),
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        preferences: data.preferences || { marketing: true, product: true, newsletter: true },
        status: 'active',
        source: data.source || 'website',
      })
      .select()
      .single();

    if (error) throw error;
    return subscriber as EmailSubscriber;
  }

  /**
   * Update email preferences
   */
  async updateEmailPreferences(
    subscriberId: string, 
    data: UpdateEmailPreferencesInput
  ): Promise<EmailSubscriber> {
    const { data: subscriber, error } = await this.supabase
      .from('email_subscribers')
      .update({
        preferences: data.preferences,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriberId)
      .select()
      .single();

    if (error) throw error;
    return subscriber as EmailSubscriber;
  }

  /**
   * Unsubscribe an email
   */
  async unsubscribeEmail(email: string): Promise<void> {
    const { error } = await this.supabase
      .from('email_subscribers')
      .update({
        status: 'unsubscribed',
        preferences: { marketing: false, product: false, newsletter: false },
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

    if (error) throw error;
  }

  /**
   * Link subscriber to user
   */
  async linkSubscriberToUser(email: string, userId: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .update({
        user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) throw error;
    return data as EmailSubscriber;
  }
}
