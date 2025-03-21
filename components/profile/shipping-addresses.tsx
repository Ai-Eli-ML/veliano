'use client'

import { useState } from 'react'
import { UserProfile, Address } from '@/types/user'
import { UserRepository } from '@/lib/repositories/user-repository'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { PlusIcon, Trash2Icon } from 'lucide-react'

interface ShippingAddressesProps {
  profile: UserProfile
}

export function ShippingAddresses({ profile }: ShippingAddressesProps) {
  const [addresses, setAddresses] = useState<Address[]>(profile.shipping_addresses || [])
  const [isAdding, setIsAdding] = useState(false)
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  })

  const handleAddAddress = async () => {
    try {
      const userRepo = UserRepository.getInstance()
      const updatedAddresses = [...addresses, newAddress]
      const success = await userRepo.updateShippingAddresses(profile.id, updatedAddresses)

      if (success) {
        setAddresses(updatedAddresses)
        setIsAdding(false)
        setNewAddress({
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        })
        toast({
          title: 'Address added',
          description: 'Your shipping address has been added successfully.',
        })
      } else {
        throw new Error('Failed to add address')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add address. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveAddress = async (index: number) => {
    try {
      const userRepo = UserRepository.getInstance()
      const updatedAddresses = addresses.filter((_, i) => i !== index)
      const success = await userRepo.updateShippingAddresses(profile.id, updatedAddresses)

      if (success) {
        setAddresses(updatedAddresses)
        toast({
          title: 'Address removed',
          description: 'Your shipping address has been removed.',
        })
      } else {
        throw new Error('Failed to remove address')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove address. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      {addresses.map((address, index) => (
        <Card key={index}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.postal_code}`}</p>
              <p>{address.country}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveAddress(index)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={newAddress.postal_code}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postal_code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress}>Save Address</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      )}
    </div>
  )
} 