import { Order, EmailSubscriber } from '@/types/email';
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
  Row,
  Column
} from '@react-email/components';

export interface OrderConfirmationEmailProps {
  order: Order;
  subscriber: EmailSubscriber;
  appUrl: string;
  assetsUrl: string;
}

export const orderConfirmationEmail = ({
  order,
  subscriber,
  appUrl,
  assetsUrl
}: OrderConfirmationEmailProps) => {
  const { first_name } = subscriber;
  const { items, total, shipping_address } = order;

  return (
    <Html>
      <Head />
      <Preview>Your Veliano Jewelry Order Confirmation #{order.id}</Preview>
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
          <Heading style={h1}>Order Confirmation</Heading>
          <Text style={text}>
            Dear {first_name || 'Valued Customer'},
          </Text>
          <Text style={text}>
            Thank you for your order! We're excited to confirm that your order has been received and is being processed.
          </Text>

          <Section style={orderDetails}>
            <Heading as="h2" style={h2}>Order Details</Heading>
            <Text style={text}>Order #{order.id}</Text>
            
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemText}>
                    {item.product_name} x {item.quantity}
                  </Text>
                </Column>
                <Column>
                  <Text style={itemPrice}>
                    ${item.price.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            ))}
            
            <Hr style={hr} />
            
            <Row style={totalRow}>
              <Column>
                <Text style={totalText}>Total</Text>
              </Column>
              <Column>
                <Text style={totalPrice}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={shippingSection}>
            <Heading as="h2" style={h2}>Shipping Address</Heading>
            <Text style={text}>
              {shipping_address.street}<br />
              {shipping_address.city}, {shipping_address.state} {shipping_address.zip}
            </Text>
          </Section>

          <Text style={text}>
            You can track your order status by visiting your account at{' '}
            <a href={`${appUrl}/account/orders/${order.id}`} style={link}>
              Veliano Jewelry
            </a>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions about your order, please don't hesitate to{' '}
            <a href={`${appUrl}/contact`} style={link}>contact us</a>.
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

const orderDetails = {
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
};

const itemRow = {
  margin: '8px 0',
};

const itemText = {
  ...text,
  margin: '4px 0',
};

const itemPrice = {
  ...text,
  textAlign: 'right' as const,
  margin: '4px 0',
};

const totalRow = {
  marginTop: '16px',
};

const totalText = {
  ...text,
  fontWeight: '600',
};

const totalPrice = {
  ...text,
  fontWeight: '600',
  textAlign: 'right' as const,
};

const shippingSection = {
  margin: '24px 0',
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