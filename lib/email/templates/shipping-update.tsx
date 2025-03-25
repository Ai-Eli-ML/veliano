import { EmailSubscriber, Order } from '@/types/email';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button
} from '@react-email/components';

export interface TrackingInfo {
  tracking_number: string;
  carrier: string;
  estimated_delivery?: string;
  tracking_url: string;
  status: 'shipped' | 'delivered' | 'out_for_delivery' | 'delayed';
}

export interface ShippingUpdateEmailProps {
  subscriber: EmailSubscriber;
  order: Order;
  tracking: TrackingInfo;
  appUrl: string;
  assetsUrl: string;
}

export const shippingUpdateEmail = ({
  subscriber,
  order,
  tracking,
  appUrl,
  assetsUrl
}: ShippingUpdateEmailProps) => {
  const { first_name } = subscriber;
  const { tracking_number, carrier, estimated_delivery, tracking_url, status } = tracking;

  const getStatusMessage = () => {
    switch (status) {
      case 'shipped':
        return 'Your order is on its way!';
      case 'delivered':
        return 'Your order has been delivered!';
      case 'out_for_delivery':
        return 'Your order is out for delivery!';
      case 'delayed':
        return 'Your order is experiencing a delay.';
      default:
        return 'Your order status has been updated.';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{getStatusMessage()} Order #{order.id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <img
              src={`${assetsUrl}/images/logo.png`}
              alt="Veliano Jewelry"
              width="170"
              height="50"
            />
          </Section>
          
          <Heading style={h1}>{getStatusMessage()}</Heading>
          
          <Text style={text}>
            Dear {first_name || 'Valued Customer'},
          </Text>
          
          <Text style={text}>
            We wanted to let you know that the status of your order #{order.id} has been updated.
          </Text>

          <Section style={trackingSection}>
            <Heading as="h2" style={h2}>Tracking Information</Heading>
            <div style={trackingDetails}>
              <Text style={trackingText}>
                Carrier: {carrier}<br />
                Tracking Number: {tracking_number}<br />
                {estimated_delivery && `Estimated Delivery: ${estimated_delivery}`}
              </Text>
            </div>
          </Section>

          <Section style={ctaSection}>
            <Button
              href={tracking_url}
              style={button}
            >
              Track Your Package
            </Button>
          </Section>

          <Section style={orderSection}>
            <Heading as="h2" style={h2}>Order Summary</Heading>
            {order.items.map((item, index) => (
              <div key={index} style={orderItem}>
                <Text style={itemText}>
                  {item.product_name} x {item.quantity}
                  <span style={itemPrice}>${item.price.toFixed(2)}</span>
                </Text>
              </div>
            ))}
            <Hr style={hr} />
            <Text style={totalText}>
              Total: ${order.total.toFixed(2)}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            View your complete order details at{' '}
            <a href={`${appUrl}/account/orders/${order.id}`} style={link}>
              your account
            </a>
            . If you need assistance, please contact our{' '}
            <a href={`${appUrl}/contact`} style={link}>support team</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '16px 0',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const trackingSection = {
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
};

const trackingDetails = {
  margin: '16px 0',
};

const trackingText = {
  ...text,
  margin: '8px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
};

const orderSection = {
  margin: '24px 0',
};

const orderItem = {
  margin: '8px 0',
};

const itemText = {
  ...text,
  margin: '4px 0',
  display: 'flex',
  justifyContent: 'space-between',
};

const itemPrice = {
  fontWeight: '600',
};

const totalText = {
  ...text,
  fontWeight: '600',
  textAlign: 'right' as const,
};

const hr = {
  margin: '24px 0',
  borderColor: '#e6e6e6',
};

const link = {
  color: '#067df7',
  textDecoration: 'underline',
};

const footer = {
  ...text,
  color: '#6a6a6a',
  fontSize: '14px',
}; 