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
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderId: string;
  firstName: string;
}

export const OrderConfirmationEmail = ({
  orderId,
  firstName,
}: OrderConfirmationEmailProps) => {
  const previewText = `Order Confirmation - Order #${orderId}`;

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
          <Heading style={heading}>Order Confirmation</Heading>
          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
            Thank you for your order! We're excited to confirm that your order #{orderId} has been
            received and is being processed.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={`https://veliano.com/orders/${orderId}`}>
              View Order Details
            </Link>
          </Section>
          <Text style={paragraph}>
            If you have any questions about your order, please don't hesitate to contact our
            customer service team.
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