# Domain Integration Guide for veliano.co

This document outlines the steps for integrating the custom domain (veliano.co) with the Vercel deployment and configuring email services.

## Domain Configuration Overview

- **Domain Provider**: Namecheap
- **Domain**: veliano.co
- **Hosting**: Vercel
- **Email Service**: Namecheap Email Service
- **Current Status**: Domain nameservers set up to point to Vercel

## Setting Up Domain with Vercel

### Initial Domain Connection

1. Log in to the Vercel dashboard
2. Navigate to the Veliano project
3. Go to Settings > Domains
4. Add the domain "veliano.co"
5. Follow verification steps provided by Vercel
6. Optionally add "www.veliano.co" as well for subdomain access

### Configuring Nameservers (Already Done)

Vercel requires the following nameservers to be set up in your Namecheap account:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Verifying Domain Configuration

1. Go to Vercel dashboard > Project > Domains
2. Check that veliano.co shows "Valid Configuration"
3. Verify that DNS propagation is complete (may take up to 48 hours)
4. Test the domain by visiting https://veliano.co

## Re-enabling Domain Integration

If the domain was temporarily removed from Vercel, follow these steps to re-enable it:

1. Log in to Vercel dashboard
2. Navigate to the Veliano project
3. Go to Settings > Domains
4. Click "Add" and enter "veliano.co"
5. Select "Proceed with Verification"
6. Vercel will detect the nameservers are already pointed correctly
7. Confirm the setup and wait for verification to complete

## Email Configuration

### Current Status
- Email service is purchased through Namecheap
- MX records are configured to work with Vercel's DNS

### Checking Email Configuration

1. Visit Vercel dashboard > Project > Domains > veliano.co
2. Check the DNS Records tab
3. Verify the following MX records exist:
   ```
   MX @ mail.privateemail.com 10
   MX @ mx1.privateemail.com 10
   MX @ mx2.privateemail.com 10
   ```
4. Verify the following TXT records for SPF/DKIM:
   ```
   TXT @ v=spf1 include:spf.privateemail.com ~all
   ```

### Setting Up Email in Project Environment Variables

1. Go to Vercel dashboard > Project > Settings > Environment Variables
2. Add the following email-related variables:
   ```
   EMAIL_SERVER_HOST=mail.privateemail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@veliano.co
   EMAIL_SERVER_PASSWORD=your-email-password
   EMAIL_FROM=noreply@veliano.co
   ```
3. Make sure to redeploy the application to apply the new environment variables

## Custom Email Configuration in Next.js Project

Add the following code to your email service in the project:

```typescript
// lib/email.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }: { 
  to: string, 
  subject: string, 
  html: string 
}) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
```

## Troubleshooting Domain Issues

### Domain Not Connecting

1. Verify nameservers in Namecheap are correctly set to Vercel's nameservers
2. Check if there are any verification issues in Vercel dashboard
3. Ensure domain registration is active and not expired
4. Try running `dig veliano.co` to see current DNS resolution

### Email Not Working

1. Verify MX records are correctly configured in Vercel
2. Ensure email service is active in Namecheap
3. Check credentials used in environment variables
4. Test email sending functionality with a simple test email
5. Check server logs for email sending errors

## Maintenance Tasks

### Regular Checks

- Verify domain connectivity monthly
- Ensure domain registration is renewed before expiration
- Check email deliverability periodically
- Review Vercel domain settings after major deployments

### Domain Renewal

- Renew domain through Namecheap before expiration
- After renewal, verify nameservers remain correctly configured
- Verify SSL certificate auto-renewal through Vercel

## Production Deployment Checklist

Before going to production, ensure:

- [ ] Domain is properly connected and verified
- [ ] SSL certificate is valid and active
- [ ] Email functionality is tested and working
- [ ] Proper redirects are set up (e.g., http to https, www to non-www or vice versa)
- [ ] Custom 404 page works correctly with the domain
- [ ] All environment variables are correctly set in Vercel 