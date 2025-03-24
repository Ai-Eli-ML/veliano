import { Metadata } from 'next'
import EmailPreferences from '@/components/email/EmailPreferences'

export const metadata: Metadata = {
  title: 'Email Preferences | Veliano Jewelry',
  description: 'Manage your email subscription preferences for Veliano Jewelry',
}

export default function EmailPreferencesPage() {
  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Email Preferences</h1>
          <p className="mt-2 text-muted-foreground">
            Customize which emails you receive from us.
          </p>
        </div>
        
        <EmailPreferences />
      </div>
    </div>
  )
} 