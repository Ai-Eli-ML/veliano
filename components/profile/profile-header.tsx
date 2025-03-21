'use client'

import { useState } from 'react'
import { UserProfile } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EditProfileDialog } from './edit-profile-dialog'

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)

  const initials = profile.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || profile.email?.[0].toUpperCase() || '?'

  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User avatar'} />
          ) : (
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <p className="text-muted-foreground">{profile.email}</p>
          {profile.phone && (
            <p className="text-sm text-muted-foreground">{profile.phone}</p>
          )}
        </div>
      </div>
      <Button onClick={() => setIsEditing(true)} variant="outline">
        Edit Profile
      </Button>
      {isEditing && (
        <EditProfileDialog
          profile={profile}
          open={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
    </div>
  )
} 