import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

// Initialize Resend with API key
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email template types
export type EmailTemplate = 
  | 'welcome'
  | 'order-confirmation'
  | 'shipping-update'
  | 'abandoned-cart'
  | 'newsletter'
  | 'password-reset';

// Email configuration
export const emailConfig = {
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Veliano Jewelry',
    email: process.env.EMAIL_FROM_ADDRESS || 'noreply@veliano.co'
  },
  urls: {
    app: process.env.NEXT_PUBLIC_APP_URL || 'https://veliano.co',
    assets: process.env.NEXT_PUBLIC_ASSETS_URL || 'https://assets.veliano.co'
  },
  templates: {
    welcome: {
      subject: 'Welcome to Veliano Jewelry',
      preheader: 'Start your journey with custom jewelry'
    },
    'order-confirmation': {
      subject: 'Order Confirmation - Veliano Jewelry',
      preheader: 'Thank you for your order'
    },
    'shipping-update': {
      subject: 'Your Order Has Been Shipped',
      preheader: 'Track your order'
    },
    'abandoned-cart': {
      subject: 'Complete Your Purchase',
      preheader: 'Your cart is waiting'
    },
    newsletter: {
      subject: 'Latest Updates from Veliano Jewelry',
      preheader: 'See what\'s new'
    },
    'password-reset': {
      subject: 'Reset Your Password',
      preheader: 'Secure your account'
    }
  }
} as const; 