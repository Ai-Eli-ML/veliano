import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { EmailRepository } from '@/repositories/EmailRepository';
import EmailPreferencesPage from './page';

export default async function EmailPreferencesLayout() {
  const supabase = createServerComponentClient({ cookies });
  const emailRepository = new EmailRepository(supabase);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const preferences = await emailRepository.getUserEmailPreferences(
    session.user.id
  );

  const initialPreferences = {
    marketing_emails: preferences?.marketing_emails ?? false,
    product_updates: preferences?.product_updates ?? false,
    order_updates: preferences?.order_updates ?? true,
  };

  return (
    <div className="container max-w-2xl py-8">
      <EmailPreferencesPage initialPreferences={initialPreferences} />
      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          Note: Order-related emails cannot be disabled as they contain important
          information about your purchases.
        </p>
      </div>
    </div>
  );
} 