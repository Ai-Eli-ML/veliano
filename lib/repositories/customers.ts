import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export class CustomerRepository {
  async create(data: CustomerInsert): Promise<Customer> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: customer, error } = await supabase
      .from('customers')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return customer
  }

  async update(id: string, data: CustomerUpdate): Promise<Customer> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: customer, error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return customer
  }

  async getById(id: string): Promise<Customer | null> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return customer
  }

  async getByUserId(userId: string): Promise<Customer | null> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return customer
  }

  async list(options?: {
    search?: string
    limit?: number
    offset?: number
  }): Promise<Customer[]> {
    const supabase = createServerActionClient<Database>({ cookies })
    let query = supabase
      .from('customers')
      .select('*')

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data: customers, error } = await query

    if (error) throw error
    return customers || []
  }

  async delete(id: string): Promise<void> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 