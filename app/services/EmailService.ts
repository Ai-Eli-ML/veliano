import { Resend } from 'resend';
import { EmailCampaign, EmailSubscriber } from '@/types/email';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { OrderConfirmationEmail } from '@/components/email/templates/OrderConfirmationEmail';
import { AbandonedCartEmail } from '@/components/email/templates/AbandonedCartEmail';
import { CampaignEmail } from '@/components/email/templates/CampaignEmail';
import * as React from 'react';

export class EmailService {
  private resend: Resend;
  private supabase;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.supabase = createServerComponentClient<Database>({ cookies });
  }

  async sendOrderConfirmation(orderId: string, email: string, firstName: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Veliano Jewelry <orders@veliano.com>',
        to: email,
        subject: 'Your Veliano Order Confirmation',
        react: React.createElement(OrderConfirmationEmail, { orderId, firstName }),
      });

      if (error) {
        console.error('Failed to send order confirmation:', error);
        throw error;
      }

      await this.logEmailEvent({
        type: 'order_confirmation',
        recipientEmail: email,
        orderId,
        status: 'sent',
      });

      return data;
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      throw error;
    }
  }

  async sendAbandonedCartReminder(email: string, firstName: string, cartItems: any[]) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Veliano Jewelry <notifications@veliano.com>',
        to: email,
        subject: 'Complete Your Veliano Purchase',
        react: React.createElement(AbandonedCartEmail, { firstName, cartItems }),
      });

      if (error) {
        console.error('Failed to send abandoned cart reminder:', error);
        throw error;
      }

      await this.logEmailEvent({
        type: 'abandoned_cart',
        recipientEmail: email,
        metadata: { cartItems },
        status: 'sent',
      });

      return data;
    } catch (error) {
      console.error('Error sending abandoned cart reminder:', error);
      throw error;
    }
  }

  async sendCampaign(campaign: EmailCampaign, subscribers: EmailSubscriber[]) {
    try {
      const results = await Promise.allSettled(
        subscribers.map(async (subscriber) => {
          const { data, error } = await this.resend.emails.send({
            from: 'Veliano Jewelry <newsletter@veliano.com>',
            to: subscriber.email,
            subject: campaign.subject,
            react: React.createElement(CampaignEmail, { campaign, subscriber }),
          });

          if (error) {
            throw error;
          }

          await this.logEmailEvent({
            type: 'campaign',
            recipientEmail: subscriber.email,
            campaignId: campaign.id,
            status: 'sent',
          });

          return data;
        })
      );

      const successCount = results.filter((result) => result.status === 'fulfilled').length;
      const failureCount = results.filter((result) => result.status === 'rejected').length;

      await this.updateCampaignStats(campaign.id, {
        sent: successCount,
        failed: failureCount,
      });

      return {
        successCount,
        failureCount,
        total: subscribers.length,
      };
    } catch (error) {
      console.error('Error sending campaign:', error);
      throw error;
    }
  }

  private async logEmailEvent(event: {
    type: string;
    recipientEmail: string;
    orderId?: string;
    campaignId?: string;
    metadata?: any;
    status: 'sent' | 'failed' | 'opened' | 'clicked';
  }) {
    const { error } = await this.supabase.from('email_logs').insert([
      {
        type: event.type,
        recipient_email: event.recipientEmail,
        order_id: event.orderId,
        campaign_id: event.campaignId,
        metadata: event.metadata,
        status: event.status,
      },
    ]);

    if (error) {
      console.error('Failed to log email event:', error);
    }
  }

  private async updateCampaignStats(
    campaignId: string,
    stats: { sent: number; failed: number }
  ) {
    const { error } = await this.supabase
      .from('email_campaigns')
      .update({
        sent_count: stats.sent,
        failed_count: stats.failed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    if (error) {
      console.error('Failed to update campaign stats:', error);
    }
  }
} 