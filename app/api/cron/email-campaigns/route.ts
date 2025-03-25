import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { EmailService } from '../../../../services/EmailService';
import { Database } from '@/types/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Verify cron secret to ensure request is legitimate
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createServerComponentClient<Database>({ cookies });
    const emailService = new EmailService();

    // Get scheduled campaigns that are due to be sent
    const { data: campaigns, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', new Date().toISOString());

    if (campaignError) {
      console.error('Error fetching campaigns:', campaignError);
      return new NextResponse('Error fetching campaigns', { status: 500 });
    }

    if (!campaigns || campaigns.length === 0) {
      return new NextResponse('No campaigns to process', { status: 200 });
    }

    // Process each campaign
    const results = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          // Update campaign status to sending
          await supabase
            .from('email_campaigns')
            .update({ status: 'sending' })
            .eq('id', campaign.id);

          // Get subscribers based on target audience
          const { data: subscribers, error: subscriberError } = await supabase
            .from('email_subscribers')
            .select('*')
            .eq('is_subscribed', true)
            .is('unsubscribed_at', null);

          if (subscriberError) {
            throw subscriberError;
          }

          if (!subscribers || subscribers.length === 0) {
            return {
              campaignId: campaign.id,
              status: 'completed',
              message: 'No subscribers to process',
            };
          }

          // Filter subscribers based on campaign target audience
          const filteredSubscribers = subscribers.filter((subscriber) => {
            if (campaign.target_audience === 'all') return true;
            const preferences = subscriber.email_preferences || {};
            return preferences[campaign.target_audience];
          });

          // Send campaign to filtered subscribers
          const sendResult = await emailService.sendCampaign(
            campaign,
            filteredSubscribers
          );

          return {
            campaignId: campaign.id,
            status: 'completed',
            ...sendResult,
          };
        } catch (error) {
          console.error(`Error processing campaign ${campaign.id}:`, error);
          await supabase
            .from('email_campaigns')
            .update({ status: 'failed' })
            .eq('id', campaign.id);

          return {
            campaignId: campaign.id,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in email campaign cron:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 