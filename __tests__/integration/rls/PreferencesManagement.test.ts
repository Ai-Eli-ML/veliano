import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('Preferences Management RLS Policies', () => {
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

      // Create initial preferences
      await supabase
        .from('user_preferences')
        .insert([
          {
            user_id: user1Id,
            marketing_emails: true,
            order_updates: true,
            new_products: false
          },
          {
            user_id: user2Id,
            marketing_emails: false,
            order_updates: true,
            new_products: true
          }
        ])
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          test: 'Preferences Management RLS - Setup'
        }
      })
      throw error
    }
  })

  afterAll(async () => {
    // Cleanup test data
    await supabase.from('user_preferences').delete().eq('user_id', user1Id)
    await supabase.from('user_preferences').delete().eq('user_id', user2Id)
    await supabase.auth.admin.deleteUser(user1Id)
    await supabase.auth.admin.deleteUser(user2Id)
  })

  describe('SELECT Policy', () => {
    it('should allow users to view their own preferences', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user1Id)
        .single()

      expect(error).toBeNull()
      expect(preferences).not.toBeNull()
      expect(preferences!.marketing_emails).toBe(true)
      expect(preferences!.order_updates).toBe(true)
      expect(preferences!.new_products).toBe(false)
    })

    it('should not allow users to view other users preferences', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user1Id)
        .single()

      expect(error).not.toBeNull()
    })
  })

  describe('UPDATE Policy', () => {
    it('should allow users to update their own preferences', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('user_preferences')
        .update({
          marketing_emails: false,
          new_products: true
        })
        .eq('user_id', user1Id)

      expect(error).toBeNull()

      // Verify update
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user1Id)
        .single()

      expect(preferences!.marketing_emails).toBe(false)
      expect(preferences!.new_products).toBe(true)
    })

    it('should not allow users to update other users preferences', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('user_preferences')
        .update({
          marketing_emails: true,
          new_products: true
        })
        .eq('user_id', user1Id)

      expect(error).not.toBeNull()
    })
  })

  describe('INSERT Policy', () => {
    it('should allow users to create their own preferences', async () => {
      // Delete existing preferences first
      await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user1Id)

      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user1Id,
          marketing_emails: true,
          order_updates: true,
          new_products: true
        })

      expect(error).toBeNull()
    })

    it('should not allow users to create preferences for others', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user1Id,
          marketing_emails: false,
          order_updates: false,
          new_products: false
        })

      expect(error).not.toBeNull()
    })
  })

  describe('DELETE Policy', () => {
    it('should not allow preference deletion through RLS', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user1Id)

      expect(error).not.toBeNull()
    })
  })
}) 