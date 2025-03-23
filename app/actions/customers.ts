'use server'

import { revalidatePath } from 'next/cache'
import { CustomerRepository } from '@/lib/repositories/customers'
import { Database } from '@/types/supabase'

type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

const repository = new CustomerRepository()

export async function createCustomer(data: CustomerInsert) {
  try {
    const customer = await repository.create(data)
    revalidatePath('/admin/customers')
    revalidatePath('/account')
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error creating customer:', error)
    return { data: null, error: 'Failed to create customer' }
  }
}

export async function updateCustomer(id: string, data: CustomerUpdate) {
  try {
    const customer = await repository.update(id, data)
    revalidatePath('/admin/customers')
    revalidatePath('/account')
    revalidatePath(`/admin/customers/${id}`)
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error updating customer:', error)
    return { data: null, error: 'Failed to update customer' }
  }
}

export async function deleteCustomer(id: string) {
  try {
    await repository.delete(id)
    revalidatePath('/admin/customers')
    revalidatePath('/account')
    return { error: null }
  } catch (error) {
    console.error('Error deleting customer:', error)
    return { error: 'Failed to delete customer' }
  }
}

export async function getCustomerByUserId(userId: string) {
  try {
    const customer = await repository.getByUserId(userId)
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error fetching customer:', error)
    return { data: null, error: 'Failed to fetch customer' }
  }
}

export async function listCustomers(options?: {
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    const customers = await repository.list(options)
    return { data: customers, error: null }
  } catch (error) {
    console.error('Error listing customers:', error)
    return { data: [], error: 'Failed to list customers' }
  }
} 