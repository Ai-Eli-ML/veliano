import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import {
  CustomOrder,
  CustomOrderWithRelations,
  CreateCustomOrderData,
  UpdateCustomOrderData,
  CustomOrderQueryOptions
} from '@/types/custom-orders'
import { Database } from '@/types/supabase'

type CustomOrderInsert = Database['public']['Tables']['custom_orders']['Insert']
type CustomOrderUpdate = Database['public']['Tables']['custom_orders']['Update']

export class CustomOrderRepository {
  async create(data: CreateCustomOrderData): Promise<CustomOrder> {
    const supabase = createServerActionClient<Database>({ cookies })
    const insertData: CustomOrderInsert = {
      order_number: data.order_number,
      customer_id: data.customer_id,
      total_price: data.total_price,
      teeth_selection: data.teeth_selection,
      material: data.material,
      design_details: data.design_details || null,
      notes: data.notes || null
    }

    const { data: order, error } = await supabase
      .from('custom_orders')
      .insert(insertData)
      .select('*')
      .single()

    if (error) throw error
    return order
  }

  async update(id: string, data: UpdateCustomOrderData): Promise<CustomOrder> {
    const supabase = createServerActionClient<Database>({ cookies })
    const updateData: CustomOrderUpdate = {}
    
    if (data.status) updateData.status = data.status
    if (data.impression_kit_status) updateData.impression_kit_status = data.impression_kit_status
    if (data.impression_kit_tracking !== undefined) updateData.impression_kit_tracking = data.impression_kit_tracking
    if (data.design_details !== undefined) updateData.design_details = data.design_details
    if (data.estimated_completion_date !== undefined) updateData.estimated_completion_date = data.estimated_completion_date
    if (data.notes !== undefined) updateData.notes = data.notes

    const { data: order, error } = await supabase
      .from('custom_orders')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return order
  }

  async getById(id: string): Promise<CustomOrderWithRelations | null> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: order, error } = await supabase
      .from('custom_orders')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return order
  }

  async list(options?: CustomOrderQueryOptions): Promise<CustomOrderWithRelations[]> {
    const supabase = createServerActionClient<Database>({ cookies })
    let query = supabase
      .from('custom_orders')
      .select(`
        *,
        customer:customers(*)
      `)

    if (options?.filters) {
      const { status, customer_id, from_date, to_date } = options.filters
      
      if (status) {
        query = query.eq('status', status)
      }
      
      if (customer_id) {
        query = query.eq('customer_id', customer_id)
      }
      
      if (from_date) {
        query = query.gte('created_at', from_date.toISOString())
      }
      
      if (to_date) {
        query = query.lte('created_at', to_date.toISOString())
      }
    }

    if (options?.order_by) {
      query = query.order(options.order_by.column, {
        ascending: options.order_by.direction === 'asc'
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data: orders, error } = await query

    if (error) throw error
    return orders || []
  }

  async delete(id: string): Promise<void> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { error } = await supabase
      .from('custom_orders')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getCustomerOrders(customerId: string): Promise<CustomOrder[]> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: orders, error } = await supabase
      .from('custom_orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return orders || []
  }

  async updateStatus(id: string, status: CustomOrder['status']): Promise<CustomOrder> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: order, error } = await supabase
      .from('custom_orders')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return order
  }

  async updateImpressionKit(
    id: string,
    data: Pick<CustomOrder, 'impression_kit_status' | 'impression_kit_tracking'>
  ): Promise<CustomOrder> {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: order, error } = await supabase
      .from('custom_orders')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return order
  }
} 