'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

type AdminUser = Database['public']['Tables']['admin_users']['Row']
type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']

export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false

  const supabase = createServerActionClient<Database>({ cookies })
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select()
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !adminUser) return false
  return true
}

export async function addAdmin(userId: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select()
      .eq('user_id', userId)
      .maybeSingle()

    if (existingAdmin) {
      return { error: 'User is already an admin' }
    }

    const newAdmin: AdminUserInsert = {
      user_id: userId
    }

    const { error } = await supabase
      .from('admin_users')
      .insert(newAdmin)

    if (error) throw error

    revalidatePath('/admin')
    return { error: null }
  } catch (error) {
    console.error('Error adding admin:', error)
    return { error: 'Failed to add admin' }
  }
}

export async function removeAdmin(userId: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    revalidatePath('/admin')
    return { error: null }
  } catch (error) {
    console.error('Error removing admin:', error)
    return { error: 'Failed to remove admin' }
  }
}

export async function listAdmins() {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data, error } = await supabase
      .from('admin_users')
      .select()

    if (error) throw error

    return { data: (data || []) as AdminUser[], error: null }
  } catch (error) {
    console.error('Error listing admins:', error)
    return { data: [], error: 'Failed to list admins' }
  }
} 