import { Metadata } from 'next'
import { getUser } from '@/lib/auth'
import { UserRepository } from '@/lib/repositories/user-repository'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileTabs } from '@/components/profile/profile-tabs'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Account | Veliano',
  description: 'Manage your Veliano account settings and preferences',
}

export default async function AccountPage() {
  const user = await getUser()
  if (!user) redirect('/auth/signin')

  const userRepo = UserRepository.getInstance()
  const profile = await userRepo.getProfile(user.id)
  if (!profile) redirect('/auth/signin')

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </div>
  )
} 