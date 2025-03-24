import { Metadata } from 'next';
import { EmailPreferences } from '@/components/email/EmailPreferences';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Email Preferences | Veliano',
  description: 'Manage your email subscription preferences for Veliano communications.'
};

export default async function EmailPreferencesPage() {
  // Get current user
  const currentUser = await getCurrentUser();
  
  // Redirect to login if not logged in
  if (!currentUser) {
    redirect('/login?redirect=/account/email-preferences');
  }
  
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Email Preferences</h1>
      <p className="text-muted-foreground mb-8">
        Manage how and when you receive emails from Veliano.
      </p>
      
      <EmailPreferences userId={currentUser.id} />
    </div>
  );
} 