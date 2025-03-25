import { NextResponse } from 'next/server';
import { EmailRepository } from '@/app/repositories/EmailRepository';
import { EmailService } from '@/lib/email/service';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  preferences: z.object({
    marketing: z.boolean().default(true),
    product: z.boolean().default(true),
    newsletter: z.boolean().default(true),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    const emailRepository = new EmailRepository();
    const emailService = new EmailService();

    // Check if already subscribed
    const existingSubscriber = await emailRepository.getSubscriberByEmail(validatedData.email);
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate subscription
        await emailRepository.updateEmailPreferences(existingSubscriber.id, {
          preferences: validatedData.preferences || {
            marketing: true,
            product: true,
            newsletter: true,
          },
          status: 'active',
        });
        return NextResponse.json({ message: 'Subscription reactivated' });
      }
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscriber
    const subscriber = await emailRepository.subscribeEmail({
      email: validatedData.email,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      preferences: validatedData.preferences,
      source: 'website',
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(subscriber);

    return NextResponse.json({
      message: 'Successfully subscribed',
      subscriber,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to subscribe' },
      { status: 500 }
    );
  }
} 