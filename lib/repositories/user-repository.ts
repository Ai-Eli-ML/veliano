import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserProfile, Address } from '@/types/user'
import { Database } from '@/types/supabase'

export class UserRepository {
  private static instance: UserRepository

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository()
    }
    return UserRepository.instance
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = await createServerSupabaseClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return profile as UserProfile
  }

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data as UserProfile
  }

  async updateShippingAddresses(userId: string, addresses: Address[]): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('profiles')
      .update({ shipping_addresses: addresses })
      .eq('id', userId)

    if (error) {
      console.error('Error updating shipping addresses:', error)
      return false
    }

    return true
  }

  async updatePreferences(
    userId: string,
    preferences: UserProfile['preferences']
  ): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('profiles')
      .update({ preferences })
      .eq('id', userId)

    if (error) {
      console.error('Error updating preferences:', error)
      return false
    }

    return true
  }

  async deleteProfile(userId: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('Error deleting profile:', error)
      return false
    }

    return true
  }
} 