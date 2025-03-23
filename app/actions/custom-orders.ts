"use server"

import { revalidatePath } from 'next/cache'
import { CustomOrderRepository } from '@/lib/repositories/custom-orders'
import { CreateCustomOrderData, UpdateCustomOrderData } from '@/types/custom-orders'

const repository = new CustomOrderRepository()

export async function createCustomOrder(data: CreateCustomOrderData) {
  try {
    const order = await repository.create(data)
    revalidatePath('/admin/orders')
    revalidatePath('/account/orders')
    return { data: order, error: null }
  } catch (error) {
    console.error('Error creating custom order:', error)
    return { data: null, error: 'Failed to create custom order' }
  }
}

export async function updateCustomOrder(id: string, data: UpdateCustomOrderData) {
  try {
    const order = await repository.update(id, data)
    revalidatePath('/admin/orders')
    revalidatePath('/account/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { data: order, error: null }
  } catch (error) {
    console.error('Error updating custom order:', error)
    return { data: null, error: 'Failed to update custom order' }
  }
}

export async function updateOrderStatus(id: string, status: UpdateCustomOrderData['status']) {
  if (!status) return { data: null, error: 'Status is required' }
  
  try {
    const order = await repository.updateStatus(id, status)
    revalidatePath('/admin/orders')
    revalidatePath('/account/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { data: order, error: null }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { data: null, error: 'Failed to update order status' }
  }
}

export async function updateImpressionKitStatus(
  id: string,
  status: string,
  tracking: string | null = null
) {
  try {
    const order = await repository.updateImpressionKit(id, {
      impression_kit_status: status,
      impression_kit_tracking: tracking
    })
    revalidatePath('/admin/orders')
    revalidatePath('/account/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { data: order, error: null }
  } catch (error) {
    console.error('Error updating impression kit status:', error)
    return { data: null, error: 'Failed to update impression kit status' }
  }
}

export async function deleteCustomOrder(id: string) {
  try {
    await repository.delete(id)
    revalidatePath('/admin/orders')
    revalidatePath('/account/orders')
    return { error: null }
  } catch (error) {
    console.error('Error deleting custom order:', error)
    return { error: 'Failed to delete custom order' }
  }
} 