'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getShippingAddresses, updateShippingAddress, deleteShippingAddress } from '@/app/actions/user'
import { Address } from '@/types/user'
import { useToast } from '@/components/ui/use-toast'

export function ShippingAddresses({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const { toast } = useToast()

  const handleAddAddress = async (address: Address) => {
    try {
      await updateShippingAddress(userId, address)
      const updatedAddresses = await getShippingAddresses(userId)
      setAddresses(updatedAddresses)
      toast({
        title: 'Address added',
        description: 'Your shipping address has been added successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add shipping address.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteShippingAddress(addressId)
      const updatedAddresses = await getShippingAddresses(userId)
      setAddresses(updatedAddresses)
      toast({
        title: 'Address deleted',
        description: 'Your shipping address has been deleted.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete shipping address.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Shipping Addresses</h2>
      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{address.name}</p>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state} {address.postal_code}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteAddress(address.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 