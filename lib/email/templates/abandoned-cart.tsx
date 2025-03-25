import { EmailSubscriber } from '@/types/email';
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
  Button,
  Row,
  Column
} from '@react-email/components';

export interface CartItem {
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
}

export interface AbandonedCartEmailProps {
  subscriber: EmailSubscriber;
  cartItems: CartItem[];
  cartTotal: number;
  cartUrl: string;
  appUrl: string;
  assetsUrl: string;
}

export const abandonedCartEmail = ({
  subscriber,
  cartItems,
  cartTotal,
  cartUrl,
  appUrl,
  assetsUrl
}: AbandonedCartEmailProps) => {
  const { first_name } = subscriber;

  return (
    <Html>
      <Head />
      <Preview>Complete your Veliano Jewelry purchase</Preview>
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
          <Heading style={h1}>Don't Miss Out on Your Perfect Piece</Heading>
          <Text style={text}>
            Dear {first_name || 'Valued Customer'},
          </Text>
          <Text style={text}>
            We noticed you left some amazing items in your cart. Your unique style selections are still waiting for you!
          </Text>

          <Section style={cartDetails}>
            <Heading as="h2" style={h2}>Your Cart</Heading>
            
            {cartItems.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={imageColumn}>
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    width="80"
                    height="80"
                    style={productImage}
                  />
                </Column>
                <Column>
                  <Text style={itemText}>
                    {item.product_name}
                    <br />
                    <span style={quantityText}>Quantity: {item.quantity}</span>
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
                <Text style={totalPrice}>${cartTotal.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={ctaSection}>
            <Button
              href={cartUrl}
              style={button}
            >
              Complete Your Purchase
            </Button>
          </Section>

          <Text style={text}>
            Your cart will be saved for a limited time. Don't let these beautiful pieces slip away!
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you need any assistance, please don't hesitate to{' '}
            <a href={`${appUrl}/contact`} style={link}>contact us</a>.
            <br />
            <br />
            To unsubscribe from these notifications, visit your{' '}
            <a href={`${appUrl}/account/preferences`} style={link}>email preferences</a>.
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

const cartDetails = {
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
};

const itemRow = {
  margin: '12px 0',
  alignItems: 'center',
};

const imageColumn = {
  width: '80px',
};

const productImage = {
  borderRadius: '4px',
  objectFit: 'cover' as const,
};

const itemText = {
  ...text,
  margin: '4px 0',
};

const quantityText = {
  color: '#6a6a6a',
  fontSize: '14px',
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