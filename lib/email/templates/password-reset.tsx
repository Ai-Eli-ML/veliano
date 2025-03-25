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

export interface PasswordResetEmailProps {
  subscriber: EmailSubscriber;
  resetToken: string;
  resetUrl: string;
  appUrl: string;
  assetsUrl: string;
}

export const passwordResetEmail = ({
  subscriber,
  resetToken,
  resetUrl,
  appUrl,
  assetsUrl
}: PasswordResetEmailProps) => {
  const { first_name } = subscriber;

  return (
    <Html>
      <Head />
      <Preview>Reset Your Veliano Jewelry Password</Preview>
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
          
          <Heading style={h1}>Password Reset Request</Heading>
          
          <Text style={text}>
            Dear {first_name || 'Valued Customer'},
          </Text>
          
          <Text style={text}>
            We received a request to reset your password for your Veliano Jewelry account.
            If you didn't make this request, you can safely ignore this email.
          </Text>

          <Text style={text}>
            To reset your password, click the button below. This link will expire in 1 hour for security reasons.
          </Text>

          <Section style={ctaSection}>
            <Button
              href={resetUrl}
              style={button}
            >
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            If the button above doesn't work, you can copy and paste this URL into your browser:
            <br />
            <span style={resetLink}>{resetUrl}</span>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            For security reasons, this password reset link will expire in 1 hour. If you need assistance,
            please contact our{' '}
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

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
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

const resetLink = {
  color: '#4a4a4a',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
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