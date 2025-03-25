import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminCampaignEditor } from '@/components/email/AdminCampaignEditor';
import { CampaignList } from '@/components/email/CampaignList';
import { EmailRepository } from '@/repositories/EmailRepository';
import type { EmailCampaign } from '@/types/email';

export default async function AdminCampaignsPage() {
  const supabase = createServerComponentClient({ cookies });
  const emailRepository = new EmailRepository(supabase);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  // Fetch all campaigns
  const { data: campaigns } = await supabase
    .from('email_campaigns')
    .select()
    .order('created_at', { ascending: false });

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Email Campaigns</h1>
      <div className="space-y-8">
        <AdminCampaignEditor />
        <div>
          <h2 className="text-2xl font-bold mb-4">Campaign History</h2>
          <CampaignList campaigns={campaigns || []} />
        </div>
      </div>
    </div>
  );
} 