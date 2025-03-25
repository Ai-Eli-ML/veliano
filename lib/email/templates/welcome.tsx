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
  Button
} from '@react-email/components';

export interface WelcomeEmailProps {
  subscriber: EmailSubscriber;
  appUrl: string;
  assetsUrl: string;
}

export const welcomeEmail = ({
  subscriber,
  appUrl,
  assetsUrl
}: WelcomeEmailProps) => {
  const { first_name } = subscriber;

  return (
    <Html>
      <Head />
      <Preview>Welcome to Veliano Jewelry</Preview>
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
          
          <Heading style={h1}>Welcome to Veliano Jewelry</Heading>
          
          <Text style={text}>
            Dear {first_name || 'Valued Customer'},
          </Text>
          
          <Text style={text}>
            Thank you for joining the Veliano Jewelry family! We're thrilled to have you as part of our community of custom jewelry enthusiasts.
          </Text>

          <Section style={featuresSection}>
            <Heading as="h2" style={h2}>What You Can Expect</Heading>
            <ul style={list}>
              <li style={listItem}>Exclusive early access to new collections</li>
              <li style={listItem}>Special member-only discounts</li>
              <li style={listItem}>Custom grillz design consultations</li>
              <li style={listItem}>Expert jewelry care tips</li>
            </ul>
          </Section>

          <Section style={ctaSection}>
            <Button
              href={`${appUrl}/products`}
              style={button}
            >
              Start Shopping
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={socialSection}>
            <Heading as="h2" style={h2}>Stay Connected</Heading>
            <Text style={text}>
              Follow us on social media for the latest updates, styling tips, and behind-the-scenes content:
            </Text>
            <div style={socialLinks}>
              <a href="https://instagram.com/velianojewelry" style={socialLink}>Instagram</a>
              <a href="https://facebook.com/velianojewelry" style={socialLink}>Facebook</a>
              <a href="https://twitter.com/velianojewelry" style={socialLink}>Twitter</a>
            </div>
          </Section>

          <Text style={footer}>
            If you have any questions, our customer service team is here to help at{' '}
            <a href={`${appUrl}/contact`} style={link}>Veliano Support</a>.
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

const featuresSection = {
  margin: '32px 0',
};

const list = {
  margin: '16px 0',
  padding: '0 0 0 24px',
};

const listItem = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
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

const hr = {
  margin: '24px 0',
  borderColor: '#e6e6e6',
};

const socialSection = {
  margin: '24px 0',
  textAlign: 'center' as const,
};

const socialLinks = {
  margin: '16px 0',
};

const socialLink = {
  color: '#067df7',
  textDecoration: 'none',
  margin: '0 12px',
  fontSize: '16px',
};

const link = {
  color: '#067df7',
  textDecoration: 'underline',
};

const footer = {
  ...text,
  color: '#6a6a6a',
  fontSize: '14px',
  textAlign: 'center' as const,
}; 