'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationState('error')
        setErrorMessage('Missing verification token')
        return
      }
      
      try {
        const supabase = createClientSupabaseClient()
        
        // Verify the token by trying to exchange it for a session
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        })
        
        if (error) {
          console.error('Token verification error:', error)
          setVerificationState('error')
          setErrorMessage(error.message || 'Failed to verify email')
          return
        }
        
        setVerificationState('success')
      } catch (error) {
        console.error('Verification error:', error)
        setVerificationState('error')
        setErrorMessage('An unexpected error occurred during verification')
      }
    }
    
    verifyToken()
  }, [token])
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Verifying your email address...
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center py-6">
          {verificationState === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-gold-500" />
              <p className="text-center text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
          
          {verificationState === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center">
                <p className="font-medium text-xl">Your email has been verified!</p>
                <p className="text-muted-foreground mt-2">
                  You can now sign in to your account with your email and password.
                </p>
              </div>
            </div>
          )}
          
          {verificationState === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div className="text-center">
                <p className="font-medium text-xl">Verification Failed</p>
                <p className="text-muted-foreground mt-2">
                  {errorMessage || 'There was a problem verifying your email address.'}
                </p>
                <p className="text-muted-foreground mt-1">
                  This may be because the verification link has expired or has already been used.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {verificationState === 'success' && (
            <Button onClick={() => router.push('/auth/login')}>
              Go to Login
            </Button>
          )}
          
          {verificationState === 'error' && (
            <Button variant="outline" onClick={() => router.push('/auth/register')}>
              Back to Sign Up
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
} 