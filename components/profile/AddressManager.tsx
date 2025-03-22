'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Loader2, Pencil, Trash2, Star } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { supabase } from '@/lib/supabase-client'
import { trackError } from '@/lib/utils/error-tracking'
import { toast } from 'react-hot-toast'

interface Address {
  id: string
  user_id: string
  street: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
  isOptimistic?: boolean
  created_at?: string
  updated_at?: string
}

interface AddressManagerProps {
  userId: string
}

export function AddressManager({ userId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({})

  const loadAddresses = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)

      if (fetchError) {
        throw new Error('Failed to load addresses')
      }
      setAddresses(data || [])
    } catch (err) {
      Sentry.captureException(err, {
        extra: {
          component: 'AddressManager',
          operation: 'loadAddresses',
          userId
        }
      })
      setError('Failed to load addresses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [userId])

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const zipCode = formData.get('zipCode') as string

    // Validate zip code
    if (!/^\d{5}$/.test(zipCode)) {
      setValidationError('Please enter a valid 5-digit zip code')
      return
    }
    setValidationError(null)
    setIsSubmitting(true)

    const newAddress: Address = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip_code: zipCode,
      is_default: addresses.length === 0,
      isOptimistic: true
    }

    try {
      // Add optimistic address
      setAddresses(prev => [...prev, newAddress])
      setProgress(30)

      const { data, error: addError } = await supabase
        .from('addresses')
        .insert([{
          user_id: userId,
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          zip_code: newAddress.zip_code,
          is_default: newAddress.is_default
        }])
        .select()
        .single()

      if (addError) {
        throw new Error('Failed to add address')
      }

      // Replace optimistic address with real one
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === newAddress.id ? { ...data, isOptimistic: false } : addr
        )
      )
      setProgress(100)
      form.reset()
    } catch (err) {
      trackError(err as Error, {
        severity: 'error',
        context: {
          component: 'AddressManager',
          action: 'createAddress',
          userId,
          additionalData: { addressData: newAddress }
        }
      })
      setError('Failed to add address. Please try again.')
      // Remove optimistic address on error
      setAddresses(prev => prev.filter(addr => addr.id !== newAddress.id))
      setProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      // Optimistic update
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        }))
      )

      const { error: updateError } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)

      if (updateError) {
        throw new Error('Failed to set default address')
      }

      const { error: batchError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .neq('id', addressId)
        .eq('user_id', userId)

      if (batchError) {
        throw new Error('Failed to update other addresses')
      }
    } catch (err) {
      trackError(err as Error, {
        severity: 'error',
        context: {
          component: 'AddressManager',
          action: 'setDefaultAddress',
          userId,
          addressId
        }
      });
      toast.error('Failed to update address');
      await loadAddresses(); // Reload addresses to revert optimistic update
    }
  }

  const handleRetry = () => {
    setError(null)
    loadAddresses()
  }

  const handleEdit = (address: Address) => {
    // TODO: Implement edit functionality
    console.log('Edit address:', address);
  };

  const handleDelete = async (addressId: string) => {
    try {
      const addressToDelete = addresses.find(addr => addr.id === addressId);
      if (!addressToDelete) return;

      // Update deleting state
      setIsDeletingMap(prev => ({ ...prev, [addressId]: true }));

      // Optimistically remove the address
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        throw new Error('Failed to delete address');
      }
    } catch (err) {
      // Restore the address if delete fails
      const addressToRestore = addresses.find(addr => addr.id === addressId);
      if (addressToRestore) {
        setAddresses(prev => [...prev, addressToRestore]);
      }
      
      trackError(err as Error, {
        severity: 'error',
        context: {
          component: 'AddressManager',
          action: 'deleteAddress',
          userId
        }
      });
      toast.error('Failed to delete address');
    } finally {
      // Clear deleting state
      setIsDeletingMap(prev => {
        const updated = { ...prev };
        delete updated[addressId];
        return updated;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Addresses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center">
              {error}
              <Button
                variant="link"
                size="sm"
                className="ml-2"
                onClick={handleRetry}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {validationError && (
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <form 
          onSubmit={handleAddAddress} 
          className="space-y-4"
          role="form"
          aria-label="Address entry form"
        >
          <div className="grid gap-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              aria-label="street"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                aria-label="city"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                aria-label="state"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              aria-label="zip code"
              pattern="[0-9]{5}"
              aria-invalid={!!validationError}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : 'Add Address'}
          </Button>
        </form>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" />
              <span>Loading addresses...</span>
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-muted-foreground">No addresses added yet.</p>
          ) : (
            addresses.map((address) => (
              <Card key={address.id} className="mb-4" data-testid="address-item">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium" data-testid="address-street">{address.street}</p>
                      <p className="text-sm text-muted-foreground" data-testid="address-city-state">
                        {address.city}, {address.state} {address.zip_code}
                      </p>
                    </div>
                    <div className="space-x-2">
                      {address.is_default && (
                        <Badge variant="outline" className="font-normal ml-2">
                          Default
                        </Badge>
                      )}
                      {address.isOptimistic && (
                        <Badge variant="outline" className="font-normal ml-2">
                          Saving...
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    {!address.is_default && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs" 
                        onClick={() => handleSetDefault(address.id)}
                        aria-label="Set as default address"
                      >
                        <Star className="h-3 w-3 mr-1" /> Set as default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs" 
                      onClick={() => handleEdit(address)}
                    >
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-destructive" 
                      onClick={() => handleDelete(address.id)}
                      disabled={isDeletingMap[address.id]}
                      aria-label="Delete address"
                    >
                      {isDeletingMap[address.id] ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {progress > 0 && progress < 100 && (
          <Progress value={progress} className="w-full" />
        )}
      </CardContent>
    </Card>
  )
}