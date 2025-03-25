import { resend, emailConfig, type EmailTemplate } from './config';
import { renderWelcomeEmail } from './templates/welcome';
import { renderOrderConfirmationEmail } from './templates/order-confirmation';
import { renderShippingUpdateEmail } from './templates/shipping-update';
import { renderAbandonedCartEmail } from './templates/abandoned-cart';
import { renderNewsletterEmail } from './templates/newsletter';
import { renderPasswordResetEmail } from './templates/password-reset';

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async sendEmail(
    to: string,
    template: EmailTemplate,
    html: string,
    subject?: string
  ) {
    try {
      const { from } = emailConfig;
      const templateConfig = emailConfig.templates[template];

      await resend.emails.send({
        from: `${from.name} <${from.email}>`,
        to,
        subject: subject || templateConfig.subject,
        html
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Failed to send ${template} email`);
    }
  }

  public async sendWelcomeEmail(to: string, name: string) {
    const html = renderWelcomeEmail({ name, urls: emailConfig.urls });
    await this.sendEmail(to, 'welcome', html);
  }

  public async sendOrderConfirmationEmail(to: string, orderDetails: any) {
    const html = renderOrderConfirmationEmail({ 
      orderDetails, 
      urls: emailConfig.urls 
    });
    await this.sendEmail(to, 'order-confirmation', html);
  }

  public async sendShippingUpdateEmail(to: string, trackingInfo: any) {
    const html = renderShippingUpdateEmail({ 
      trackingInfo, 
      urls: emailConfig.urls 
    });
    await this.sendEmail(to, 'shipping-update', html);
  }

  public async sendAbandonedCartEmail(to: string, cartItems: any) {
    const html = renderAbandonedCartEmail({ 
      cartItems, 
      urls: emailConfig.urls 
    });
    await this.sendEmail(to, 'abandoned-cart', html);
  }

  public async sendNewsletterEmail(to: string, content: any) {
    const html = renderNewsletterEmail({ 
      content, 
      urls: emailConfig.urls 
    });
    await this.sendEmail(to, 'newsletter', html);
  }

  public async sendPasswordResetEmail(to: string, resetToken: string) {
    const html = renderPasswordResetEmail({ 
      resetToken, 
      urls: emailConfig.urls 
    });
    await this.sendEmail(to, 'password-reset', html);
  }
} 