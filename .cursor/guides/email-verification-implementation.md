# Email Verification Implementation Guide

This guide outlines the steps for implementing a basic email verification system using Resend.com for the Veliano Jewelry e-commerce platform.

## Prerequisites

- Resend.com account (free tier is sufficient for MVP)
- API key from Resend
- Supabase authentication already set up

## Implementation Steps

### 1. Set Up Resend Environment

```bash
# Add your Resend API key to .env.local
RESEND_API_KEY=your_resend_api_key
```

### 2. Create Email Templates

Create React email templates in `app/email/templates`:

**verification-email.tsx**
```tsx
import * as React from 'react';
import { 
  Body, Container, Head, Heading, Html, 
  Link, Preview, Text 
} from '@react-email/components';

interface VerificationEmailProps {
  verificationUrl: string;
  username: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  verificationUrl,
  username,
}) => (
  <Html>
    <Head />
    <Preview>Verify your email for Veliano Jewelry</Preview>
    <Body style={{
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <Container style={{ padding: '20px', margin: '0 auto' }}>
        <Heading style={{ color: '#111827', fontSize: '24px', fontWeight: 'bold', margin: '30px 0' }}>
          Welcome to Veliano Jewelry
        </Heading>
        <Text style={{ color: '#374151', fontSize: '16px', margin: '16px 0' }}>
          Hello {username},
        </Text>
        <Text style={{ color: '#374151', fontSize: '16px', margin: '16px 0' }}>
          Please verify your email address by clicking the button below:
        </Text>
        <Link
          href={verificationUrl}
          style={{
            backgroundColor: '#111827',
            borderRadius: '4px',
            color: '#ffffff',
            display: 'inline-block',
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '16px 0',
            padding: '12px 24px',
            textDecoration: 'none',
          }}
        >
          Verify Email
        </Link>
        <Text style={{ color: '#374151', fontSize: '16px', margin: '16px 0' }}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
        <Text style={{ color: '#6B7280', fontSize: '14px', margin: '16px 0' }}>
          This link will expire in 24 hours.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;
```

### 3. Create Email Service

Create `app/lib/email-service.ts`:

```typescript
import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';
import VerificationEmail from '../email/templates/verification-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationUrl: string
) {
  try {
    const html = await renderAsync(
      VerificationEmail({ 
        verificationUrl, 
        username 
      })
    );

    const { data, error } = await resend.emails.send({
      from: 'verification@yourdomain.com',
      to: email,
      subject: 'Verify your email for Veliano Jewelry',
      html,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw error;
  }
}
```

### 4. Create Auth Hook for Verification

Create `app/auth/hooks/useSignUp.ts`:

```typescript
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { sendVerificationEmail } from '../../lib/email-service';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }

      // 2. Create custom verification link
      const { data: verificationData, error: verificationError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email,
      });

      if (verificationError) {
        throw verificationError;
      }

      // 3. Send custom verification email
      await sendVerificationEmail(
        email,
        username,
        verificationData.properties.action_link
      );

      return { success: true, user: data.user };
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
    error,
  };
}
```

### 5. Create Auth Callback Handler

Create `app/auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to login page with success message
  return NextResponse.redirect(new URL('/login?verified=true', request.url));
}
```

### 6. Update Sign-Up Component

Update your sign-up component to use the new hook:

```tsx
import { useSignUp } from '../auth/hooks/useSignUp';
import { useState } from 'react';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signUp, loading, error } = useSignUp();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signUp(email, password, username);
    
    if (result.success) {
      setSuccessMessage('Please check your email to verify your account.');
      // Clear form
      setEmail('');
      setPassword('');
      setUsername('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      {/* Submit button */}
    </form>
  );
}
```

### 7. Test the Implementation

1. Try signing up with a test email
2. Check that verification email is sent
3. Click the verification link
4. Verify that you can login after verification

### 8. Error Handling and Edge Cases

- Handle expired verification links
- Implement resend verification email functionality
- Add proper error messages for failed verification

## Integration with Existing Code

Review your existing authentication flow and identify where email verification should be integrated. The implementation should be minimally invasive and focus on adding email verification to the existing registration process.

## Best Practices

1. Keep email templates simple and responsive
2. Use environment variables for sensitive information
3. Implement proper error handling
4. Add logging for debugging
5. Set appropriate expiration times for verification links 