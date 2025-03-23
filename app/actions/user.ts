'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserProfile, Address } from '@/types/user'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(data: Partial<UserProfile>) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', data.id)

  if (error) throw error
  revalidatePath('/account')
  return { success: true }
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateShippingAddress(userId: string, address: Address) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('shipping_addresses')
    .upsert({ ...address, user_id: userId })

  if (error) throw error
  revalidatePath('/account')
  return { success: true }
}

export async function getShippingAddresses(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

export async function deleteShippingAddress(addressId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('shipping_addresses')
    .delete()
    .eq('id', addressId)

  if (error) throw error
  revalidatePath('/account')
  return { success: true }
} 