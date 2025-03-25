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
import { emailConfig } from '@/lib/email/config';

interface WelcomeEmailProps {
  first_name?: string;
}

export const WelcomeEmail = ({ first_name }: WelcomeEmailProps) => {
  const preheader = emailConfig.templates.welcome.preheader;

  return (
    <Html>
      <Head />
      <Preview>{preheader}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logo}>
            <img
              src="https://veliano.co/logo.png"
              alt="Veliano Jewelry"
              width="150"
              height="50"
            />
          </Section>
          
          <Heading style={styles.heading}>
            Welcome {first_name ? `${first_name}!` : 'to Veliano Jewelry!'}
          </Heading>

          <Text style={styles.text}>
            Thank you for joining the Veliano family. We're excited to help you discover
            our unique collection of custom jewelry and grillz.
          </Text>

          <Text style={styles.text}>
            As a member, you'll be the first to know about:
          </Text>

          <ul style={styles.list}>
            <li>New custom jewelry designs</li>
            <li>Exclusive member discounts</li>
            <li>Limited edition releases</li>
            <li>Special events and promotions</li>
          </ul>

          <Section style={styles.buttonContainer}>
            <Link
              href="https://veliano.co/products"
              style={styles.button}
            >
              Start Shopping
            </Link>
          </Section>

          <Text style={styles.footer}>
            If you have any questions, simply reply to this email. We're always here to help!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: '#f6f6f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
    backgroundColor: '#ffffff',
  },
  logo: {
    margin: '0 auto',
    marginBottom: '24px',
    padding: '20px',
    textAlign: 'center' as const,
  },
  heading: {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
    margin: '0',
    textAlign: 'center' as const,
  },
  text: {
    margin: '24px 0',
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#484848',
    padding: '0 24px',
  },
  list: {
    margin: '24px 0',
    padding: '0 24px 0 44px',
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#484848',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '32px 0',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    maxWidth: '220px',
  },
  footer: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#9ca299',
    padding: '0 24px',
    margin: '24px 0',
    textAlign: 'center' as const,
  },
}; 