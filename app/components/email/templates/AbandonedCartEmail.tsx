import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AbandonedCartEmailProps {
  firstName: string;
  cartItems: CartItem[];
}

export const AbandonedCartEmail = ({
  firstName,
  cartItems,
}: AbandonedCartEmailProps) => {
  const previewText = 'Complete your purchase at Veliano Jewelry';
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <img
              src="https://veliano.com/logo.png"
              width="170"
              height="50"
              alt="Veliano Jewelry"
            />
          </Section>
          <Heading style={heading}>Complete Your Purchase</Heading>
          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
            We noticed you left some amazing items in your cart. Don't miss out on these pieces:
          </Text>
          
          {cartItems.map((item) => (
            <Section key={item.id} style={itemContainer}>
              <Row>
                <Column>
                  <img
                    src={item.image}
                    width="80"
                    height="80"
                    alt={item.name}
                    style={itemImage}
                  />
                </Column>
                <Column>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemDetails}>
                    Quantity: {item.quantity}
                  </Text>
                  <Text style={itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          ))}
          
          <Section style={totalContainer}>
            <Text style={totalText}>
              Total: ${total.toFixed(2)}
            </Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Link style={button} href="https://veliano.com/cart">
              Complete Your Purchase
            </Link>
          </Section>
          
          <Text style={paragraph}>
            Your cart will be saved for the next 48 hours. Don't wait too long - these items are in high demand!
          </Text>
          
          <Text style={paragraph}>
            If you have any questions, our customer service team is here to help.
          </Text>
          
          <Text style={paragraph}>Best regards,</Text>
          <Text style={paragraph}>The Veliano Jewelry Team</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const itemContainer = {
  padding: '15px',
  marginBottom: '15px',
  border: '1px solid #e6e6e6',
  borderRadius: '4px',
};

const itemImage = {
  borderRadius: '4px',
  objectFit: 'cover' as const,
};

const itemName = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#484848',
  margin: '0 0 5px',
};

const itemDetails = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 5px',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#000000',
  margin: '0',
};

const totalContainer = {
  marginTop: '20px',
  padding: '15px',
  backgroundColor: '#f7f7f7',
  borderRadius: '4px',
};

const totalText = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#000000',
  margin: '0',
  textAlign: 'right' as const,
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
  marginTop: '20px',
}; 