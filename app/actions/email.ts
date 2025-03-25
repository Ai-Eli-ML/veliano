'use server';

import { z } from 'zod';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { EmailRepository } from '@/repositories/EmailRepository';

const subscriptionSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
});

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  targetAudience: z.enum(['all', 'marketing', 'product_updates']),
  scheduledFor: z.string().optional(),
});

export async function subscribeToNewsletter(data: z.infer<typeof subscriptionSchema>) {
  const supabase = createServerActionClient({ cookies });
  const emailRepository = new EmailRepository(supabase);

  try {
    const validatedData = subscriptionSchema.parse(data);
    const { data: { session } } = await supabase.auth.getSession();
    
    await emailRepository.createSubscriber({
      email: validatedData.email,
      first_name: validatedData.firstName,
      user_id: session?.user?.id,
    });

    if (session?.user) {
      await emailRepository.updateUserEmailPreferences(session.user.id, {
        marketing_emails: true,
        product_updates: true,
        order_updates: true,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw new Error('Failed to subscribe to newsletter');
  }
}

export async function updateEmailPreferences(
  preferences: { 
    marketing_emails?: boolean;
    product_updates?: boolean;
    order_updates?: boolean;
  }
) {
  const supabase = createServerActionClient({ cookies });
  const emailRepository = new EmailRepository(supabase);
  const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await emailRepository.updateUserEmailPreferences(session.user.id, preferences);
    return { success: true };
  } catch (error) {
    console.error('Update email preferences error:', error);
    throw new Error('Failed to update email preferences');
  }
}

export async function unsubscribeFromNewsletter(token: string) {
  const supabase = createServerActionClient({ cookies });
  const emailRepository = new EmailRepository(supabase);

  try {
    const subscriber = await emailRepository.getSubscriberByToken(token);
    
    if (!subscriber) {
      throw new Error('Invalid unsubscribe token');
    }

    if (subscriber.user_id) {
      await emailRepository.updateUserEmailPreferences(subscriber.user_id, {
        marketing_emails: false,
        product_updates: false,
        order_updates: true,
      });
    }

    await emailRepository.updateSubscriber(subscriber.id, {
      is_subscribed: false,
      unsubscribed_at: new Date().toISOString(),
    });

    await emailRepository.logEmailEvent({
      type: 'unsubscribe',
      subscriber_id: subscriber.id,
      metadata: { token },
    });

    return { success: true };
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    throw new Error('Failed to unsubscribe from newsletter');
  }
}

export async function createCampaign(data: z.infer<typeof campaignSchema>) {
  const supabase = createServerActionClient({ cookies });
  const emailRepository = new EmailRepository(supabase);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const validatedData = campaignSchema.parse(data);
    
    const campaign = await emailRepository.createCampaign({
      title: validatedData.title,
      subject: validatedData.subject,
      content: validatedData.content,
      target_audience: validatedData.targetAudience,
      scheduled_for: validatedData.scheduledFor,
      created_by: session.user.id,
    });

    await emailRepository.logEmailEvent({
      type: 'campaign_created',
      campaign_id: campaign.id,
      metadata: { target_audience: validatedData.targetAudience },
    });

    return { success: true, campaign };
  } catch (error) {
    console.error('Create campaign error:', error);
    throw new Error('Failed to create campaign');
  }
}

export async function sendCampaign(campaignId: string) {
  const supabase = createServerActionClient({ cookies });
  const emailRepository = new EmailRepository(supabase);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const campaign = await emailRepository.getCampaign(campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'draft') {
      throw new Error('Campaign is not in draft status');
    }

    // Update campaign status to sending
    await emailRepository.updateCampaign(campaignId, {
      status: 'sending',
    });

    // Get subscribers based on target audience
    const subscribers = await emailRepository.getSubscribersByAudience(
      campaign.target_audience
    );

    // TODO: Integrate with email service provider to send emails
    // For now, just log the event and update status
    await emailRepository.logEmailEvent({
      type: 'campaign_sent',
      campaign_id: campaignId,
        metadata: {
        recipient_count: subscribers.length,
      },
    });

    // Update campaign status to sent
    await emailRepository.updateCampaign(campaignId, {
      status: 'sent',
      sent_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Send campaign error:', error);

    // Update campaign status to failed
    await emailRepository.updateCampaign(campaignId, {
      status: 'failed',
    });

    throw new Error('Failed to send campaign');
  }
}
