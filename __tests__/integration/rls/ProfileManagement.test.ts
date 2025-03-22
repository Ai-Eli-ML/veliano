import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

describe('Profile Management RLS Policies', () => {
  let user1Id: string
  let user2Id: string

  beforeAll(async () => {
    try {
      // Create test users
      const { data: user1 } = await supabase.auth.signUp({
        email: 'test1@example.com',
        password: 'testpassword123'
      })
      const { data: user2 } = await supabase.auth.signUp({
        email: 'test2@example.com',
        password: 'testpassword123'
      })

      user1Id = user1.user!.id
      user2Id = user2.user!.id

      // Create initial profiles
      await supabase
        .from('profiles')
        .insert([
          {
            id: user1Id,
            name: 'Test User 1',
            email: 'test1@example.com'
          },
          {
            id: user2Id,
            name: 'Test User 2',
            email: 'test2@example.com'
          }
        ])
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          test: 'Profile Management RLS - Setup'
        }
      })
      throw error
    }
  })

  afterAll(async () => {
    // Cleanup test data
    await supabase.from('profiles').delete().eq('id', user1Id)
    await supabase.from('profiles').delete().eq('id', user2Id)
    await supabase.auth.admin.deleteUser(user1Id)
    await supabase.auth.admin.deleteUser(user2Id)
  })

  describe('SELECT Policy', () => {
    it('should allow users to view their own profile', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user1Id)
        .single()

      expect(error).toBeNull()
      expect(profile).not.toBeNull()
      expect(profile!.name).toBe('Test User 1')
    })

    it('should allow users to view limited data of other profiles', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .eq('id', user1Id)
        .single()

      expect(error).toBeNull()
      expect(profile).not.toBeNull()
      expect(profile!.name).toBe('Test User 1')
      expect(profile!.email).toBeUndefined()
    })
  })

  describe('UPDATE Policy', () => {
    it('should allow users to update their own profile', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('profiles')
        .update({ name: 'Updated User 1' })
        .eq('id', user1Id)

      expect(error).toBeNull()

      // Verify update
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user1Id)
        .single()

      expect(profile!.name).toBe('Updated User 1')
    })

    it('should not allow users to update other profiles', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('profiles')
        .update({ name: 'Hacked User 1' })
        .eq('id', user1Id)

      expect(error).not.toBeNull()
    })
  })

  describe('Avatar Upload Policy', () => {
    it('should allow users to upload their own avatar', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const { error } = await supabase
        .storage
        .from('avatars')
        .upload(`${user1Id}/avatar.jpg`, testFile)

      expect(error).toBeNull()
    })

    it('should not allow users to upload avatars for others', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const { error } = await supabase
        .storage
        .from('avatars')
        .upload(`${user1Id}/avatar.jpg`, testFile)

      expect(error).not.toBeNull()
    })
  })

  describe('DELETE Policy', () => {
    it('should not allow profile deletion through RLS', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user1Id)

      expect(error).not.toBeNull()
    })
  })
}) 