"use server"

import { createServerActionClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { CreateCustomOrderData } from "@/types/custom-order"

export async function createCustomOrder(data: CreateCustomOrderData) {
  const supabase = await createServerActionClient()
  
  // First create the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  // Then create the custom order
  const { data: customOrder, error: customOrderError } = await supabase
    .from('custom_orders')
    .insert({
      order_id: orderData.id,
      product_id: data.product_id,
      customer_notes: data.customer_notes,
      status: 'pending'
    })
    .select(`
      *,
      product:products(*),
      order:orders(*)
    `)
    .single()

  if (customOrderError) throw new Error(customOrderError.message)

  revalidatePath('/orders')
  return customOrder
}

export async function updateCustomOrderStatus(
  orderId: string,
  status: string
) {
  const supabase = await createServerActionClient()

  const { error } = await supabase
    .from('custom_orders')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  revalidatePath('/orders')
  revalidatePath(`/orders/${orderId}`)
} 