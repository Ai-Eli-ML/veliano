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
import { EmailCampaign, EmailSubscriber } from '@/types/email';

interface CampaignEmailProps {
  campaign: EmailCampaign;
  subscriber: EmailSubscriber;
}

export const CampaignEmail = ({
  campaign,
  subscriber,
}: CampaignEmailProps) => {
  const unsubscribeUrl = `https://veliano.com/unsubscribe?token=${subscriber.unsubscribe_token}`;

  return (
    <Html>
      <Head />
      <Preview>{campaign.subject}</Preview>
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
          
          <Heading style={heading}>{campaign.title}</Heading>
          
          {subscriber.first_name && (
            <Text style={paragraph}>Hi {subscriber.first_name},</Text>
          )}
          
          <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
          
          {campaign.cta_link && (
            <Section style={buttonContainer}>
              <Link style={button} href={campaign.cta_link}>
                {campaign.cta_text || 'Shop Now'}
              </Link>
            </Section>
          )}
          
          <Text style={footer}>
            You're receiving this email because you subscribed to our newsletter.{' '}
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe
            </Link>
          </Text>
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

const footer = {
  fontSize: '12px',
  lineHeight: '1.4',
  color: '#9ca299',
  marginTop: '48px',
  textAlign: 'center' as const,
};

const unsubscribeLink = {
  color: '#9ca299',
  textDecoration: 'underline',
}; 