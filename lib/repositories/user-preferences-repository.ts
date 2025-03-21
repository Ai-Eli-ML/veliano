import { supabase } from '@/lib/supabase'
import { UserPreferences } from '@/types/user'

export class UserPreferencesRepository {
  private static instance: UserPreferencesRepository

  private constructor() {}

  public static getInstance(): UserPreferencesRepository {
    if (!UserPreferencesRepository.instance) {
      UserPreferencesRepository.instance = new UserPreferencesRepository()
    }
    return UserPreferencesRepository.instance
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      console.error('Error fetching preferences:', error)
      return null
    }

    return data.preferences as UserPreferences
  }

  async updateUserPreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        preferences,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating preferences:', error)
      return false
    }

    return true
  }
} 