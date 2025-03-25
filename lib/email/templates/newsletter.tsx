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

export interface NewsletterContent {
  subject: string;
  title: string;
  content: string;
  callToAction?: {
    text: string;
    url: string;
  };
}

export interface NewsletterEmailProps {
  subscriber: EmailSubscriber;
  content: NewsletterContent;
  appUrl: string;
  assetsUrl: string;
}

export const newsletterEmail = ({
  subscriber,
  content,
  appUrl,
  assetsUrl
}: NewsletterEmailProps) => {
  const { first_name } = subscriber;
  const { title, content: body, callToAction } = content;

  return (
    <Html>
      <Head />
      <Preview>{content.subject}</Preview>
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
          
          {first_name && (
            <Text style={text}>
              Dear {first_name},
            </Text>
          )}

          <Heading style={h1}>{title}</Heading>

          <Section style={contentSection}>
            <Text style={text} dangerouslySetInnerHTML={{ __html: body }} />
          </Section>

          {callToAction && (
            <Section style={ctaSection}>
              <Button
                href={callToAction.url}
                style={button}
              >
                {callToAction.text}
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            You received this email because you're subscribed to Veliano Jewelry newsletters.
            <br />
            To update your preferences or unsubscribe, visit your{' '}
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

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const contentSection = {
  margin: '24px 0',
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