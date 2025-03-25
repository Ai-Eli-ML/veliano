import { resend, emailConfig, type EmailTemplate } from './config';
import { EmailRepository } from '@/app/repositories/EmailRepository';
import { EmailSubscriber, Order } from '@/types/email';
import { welcomeEmail } from './templates/welcome';
import { orderConfirmationEmail } from './templates/order-confirmation';
import { shippingUpdateEmail, TrackingInfo } from './templates/shipping-update';
import { abandonedCartEmail, CartItem } from './templates/abandoned-cart';
import { newsletterEmail, NewsletterContent } from './templates/newsletter';
import { passwordResetEmail } from './templates/password-reset';

export class EmailService {
  private repository: EmailRepository;

  constructor() {
    this.repository = new EmailRepository();
  }

  /**
   * Send a welcome email to a new subscriber
   */
  async sendWelcomeEmail(subscriber: EmailSubscriber) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: subscriber.email,
        subject: 'Welcome to Veliano Jewelry',
        react: welcomeEmail({
          subscriber,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!
        })
      });

      if (error) {
        console.error('Failed to send welcome email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send an order confirmation email
   */
  async sendOrderConfirmation(order: Order, subscriber: EmailSubscriber) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: order.customer_email,
        subject: `Order Confirmation - #${order.id}`,
        react: orderConfirmationEmail({
          order,
          subscriber,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!
        })
      });

      if (error) {
        console.error('Failed to send order confirmation email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send a shipping update email
   */
  async sendShippingUpdateEmail(order: Order, subscriber: EmailSubscriber, tracking: TrackingInfo) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: order.customer_email,
        subject: `Shipping Update - Order #${order.id}`,
        react: shippingUpdateEmail({
          subscriber,
          order,
          tracking,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!
        })
      });

      if (error) {
        console.error('Failed to send shipping update email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending shipping update email:', error);
      throw error;
    }
  }

  /**
   * Send an abandoned cart reminder
   */
  async sendAbandonedCartReminder(subscriber: EmailSubscriber, cartItems: Array<{
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>) {
    const template = emailConfig.templates['abandoned-cart'];

    try {
      await resend.emails.send({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: subscriber.email,
        subject: template.subject,
        html: abandonedCartEmail({
          cartItems,
          urls: emailConfig.urls
        })
      });

      await this.logEmailSent(subscriber.id, 'abandoned-cart');
    } catch (error) {
      console.error('Failed to send abandoned cart reminder:', error);
      throw error;
    }
  }

  /**
   * Send a newsletter
   */
  async sendNewsletter(campaign: {
    title: string;
    body: string;
    featuredProducts?: Array<{
      name: string;
      price: number;
      imageUrl: string;
      url: string;
    }>;
  }) {
    const subscribers = await this.repository.getActiveSubscribers();
    const template = emailConfig.templates.newsletter;

    try {
      const emailPromises = subscribers.map(subscriber => 
        resend.emails.send({
          from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
          to: subscriber.email,
          subject: template.subject,
          html: newsletterEmail({
            content: campaign,
            urls: emailConfig.urls
          })
        })
      );

      await Promise.all(emailPromises);
      await this.logCampaignSent('newsletter', subscribers.map(s => s.id));
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      throw error;
    }
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(subscriber: EmailSubscriber, resetToken: string) {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: subscriber.email,
        subject: 'Reset Your Veliano Jewelry Password',
        react: passwordResetEmail({
          subscriber,
          resetToken,
          resetUrl,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!
        })
      });

      if (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Log email sent to subscriber
   */
  private async logEmailSent(subscriberId: string, type: EmailTemplate) {
    await this.repository.createEmailLog({
      subscriber_id: subscriberId,
      type,
      status: 'sent',
      metadata: {
        sent_at: new Date().toISOString()
      }
    });
  }

  /**
   * Log campaign sent to multiple subscribers
   */
  private async logCampaignSent(type: EmailTemplate, subscriberIds: string[]) {
    const logs = subscriberIds.map(subscriberId => ({
      subscriber_id: subscriberId,
      type,
      status: 'sent',
      metadata: {
        sent_at: new Date().toISOString()
      }
    }));

    await this.repository.createEmailLogs(logs);
  }

  async sendAbandonedCartEmail(subscriber: EmailSubscriber, cartItems: CartItem[], cartTotal: number) {
    try {
      const cartUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cart`;

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: subscriber.email,
        subject: 'Complete Your Veliano Jewelry Purchase',
        react: abandonedCartEmail({
          subscriber,
          cartItems,
          cartTotal,
          cartUrl,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!
        })
      });

      if (error) {
        console.error('Failed to send abandoned cart email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending abandoned cart email:', error);
      throw error;
    }
  }

  async sendNewsletterEmail(subscriber: EmailSubscriber, content: NewsletterContent) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: subscriber.email,
        subject: content.subject,
        react: newsletterEmail({
          subscriber,
          content,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!
        })
      });

      if (error) {
        console.error('Failed to send newsletter email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending newsletter email:', error);
      throw error;
    }
  }
} 