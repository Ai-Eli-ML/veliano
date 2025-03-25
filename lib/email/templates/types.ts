export interface EmailUrls {
  app: string;
  assets: string;
}

export interface BaseEmailProps {
  urls: EmailUrls;
}

export interface WelcomeEmailProps extends BaseEmailProps {
  name: string;
}

export interface OrderConfirmationEmailProps extends BaseEmailProps {
  orderDetails: {
    orderId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
}

export interface ShippingUpdateEmailProps extends BaseEmailProps {
  trackingInfo: {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    trackingUrl: string;
  };
}

export interface AbandonedCartEmailProps extends BaseEmailProps {
  cartItems: Array<{
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
}

export interface NewsletterEmailProps extends BaseEmailProps {
  content: {
    title: string;
    body: string;
    featuredProducts?: Array<{
      name: string;
      price: number;
      imageUrl: string;
      url: string;
    }>;
  };
}

export interface PasswordResetEmailProps extends BaseEmailProps {
  resetToken: string;
} 