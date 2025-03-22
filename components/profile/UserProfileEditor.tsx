'use client'

import { useState } from 'react'
import { type FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AddressManager } from './AddressManager'
import { PreferenceSettings } from './PreferenceSettings'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'

interface UserProfileEditorProps {
  userId: string
  initialData?: {
    avatar?: string
    name?: string
    email?: string
  }
}

export const UserProfileEditor: FC<UserProfileEditorProps> = ({ userId, initialData = {} }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    avatar: initialData.avatar || ''
  })
  const { toast } = useToast()

  const handleAvatarUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      formData.append('userId', userId)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload avatar')

      const { avatarUrl } = await response.json()
      setFormData(prev => ({ ...prev, avatar: avatarUrl }))

      toast({
        title: 'Success',
        description: 'Avatar updated successfully'
      })
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          component: 'UserProfileEditor',
          operation: 'avatarUpload',
          userId
        }
      })
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData
        })
      })

      if (!response.ok) throw new Error('Failed to update profile')

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          component: 'UserProfileEditor',
          operation: 'profileUpdate',
          userId
        }
      })
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback>
                {formData.name?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                Change Avatar
              </Button>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                data-testid="avatar-upload"
                onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>

        <AddressManager userId={userId} />
        <PreferenceSettings userId={userId} />
      </CardContent>
    </Card>
  )
} 