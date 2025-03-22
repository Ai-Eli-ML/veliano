import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

describe('Address Management RLS Policies', () => {
  let user1Id: string
  let user2Id: string
  let address1Id: string

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

      // Create test address for user1
      const { data: address } = await supabase
        .from('addresses')
        .insert({
          user_id: user1Id,
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip_code: '12345',
          is_default: false
        })
        .select()
        .single()

      address1Id = address!.id
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          test: 'Address Management RLS - Setup'
        }
      })
      throw error
    }
  })

  afterAll(async () => {
    // Cleanup test data
    await supabase.from('addresses').delete().eq('user_id', user1Id)
    await supabase.from('addresses').delete().eq('user_id', user2Id)
    await supabase.auth.admin.deleteUser(user1Id)
    await supabase.auth.admin.deleteUser(user2Id)
  })

  describe('SELECT Policy', () => {
    it('should allow users to view their own addresses', async () => {
      const { data, error } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { data: addresses, error: selectError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user1Id)

      expect(selectError).toBeNull()
      expect(addresses).toHaveLength(1)
      expect(addresses![0].street).toBe('123 Test St')
    })

    it('should not allow users to view other users addresses', async () => {
      const { data, error } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { data: addresses, error: selectError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user1Id)

      expect(addresses).toHaveLength(0)
    })
  })

  describe('INSERT Policy', () => {
    it('should allow users to add their own addresses', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error: insertError } = await supabase
        .from('addresses')
        .insert({
          user_id: user1Id,
          street: '456 New St',
          city: 'New City',
          state: 'NS',
          zip_code: '67890',
          is_default: false
        })

      expect(insertError).toBeNull()
    })

    it('should not allow users to add addresses for other users', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error: insertError } = await supabase
        .from('addresses')
        .insert({
          user_id: user1Id,
          street: '789 Fake St',
          city: 'Fake City',
          state: 'FS',
          zip_code: '11111',
          is_default: false
        })

      expect(insertError).not.toBeNull()
    })
  })

  describe('UPDATE Policy', () => {
    it('should allow users to update their own addresses', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error: updateError } = await supabase
        .from('addresses')
        .update({ street: '123 Updated St' })
        .eq('id', address1Id)

      expect(updateError).toBeNull()
    })

    it('should not allow users to update other users addresses', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error: updateError } = await supabase
        .from('addresses')
        .update({ street: '123 Hacked St' })
        .eq('id', address1Id)

      expect(updateError).not.toBeNull()
    })
  })

  describe('DELETE Policy', () => {
    it('should allow users to delete their own addresses', async () => {
      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error: deleteError } = await supabase
        .from('addresses')
        .delete()
        .eq('id', address1Id)

      expect(deleteError).toBeNull()
    })

    it('should not allow users to delete other users addresses', async () => {
      // Create a new address for user1 first
      const { data: newAddress } = await supabase
        .from('addresses')
        .insert({
          user_id: user1Id,
          street: '999 Test St',
          city: 'Test City',
          state: 'TS',
          zip_code: '12345',
          is_default: false
        })
        .select()
        .single()

      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error: deleteError } = await supabase
        .from('addresses')
        .delete()
        .eq('id', newAddress!.id)

      expect(deleteError).not.toBeNull()
    })
  })

  describe('set_default_address Function', () => {
    it('should allow users to set their own address as default', async () => {
      const { data: address } = await supabase
        .from('addresses')
        .insert({
          user_id: user1Id,
          street: '777 Default St',
          city: 'Default City',
          state: 'DS',
          zip_code: '54321',
          is_default: false
        })
        .select()
        .single()

      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test1@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .rpc('set_default_address', {
          p_address_id: address!.id,
          p_user_id: user1Id
        })

      expect(error).toBeNull()

      // Verify the address is now default
      const { data: updatedAddress } = await supabase
        .from('addresses')
        .select('is_default')
        .eq('id', address!.id)
        .single()

      expect(updatedAddress!.is_default).toBe(true)
    })

    it('should not allow users to set other users addresses as default', async () => {
      const { data: address } = await supabase
        .from('addresses')
        .insert({
          user_id: user1Id,
          street: '888 Other St',
          city: 'Other City',
          state: 'OS',
          zip_code: '98765',
          is_default: false
        })
        .select()
        .single()

      const { data } = await supabase
        .auth.signInWithPassword({
          email: 'test2@example.com',
          password: 'testpassword123'
        })

      const { error } = await supabase
        .rpc('set_default_address', {
          p_address_id: address!.id,
          p_user_id: user2Id
        })

      expect(error).not.toBeNull()
    })
  })
}) 