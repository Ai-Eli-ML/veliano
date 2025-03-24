import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendVerificationEmail } from '@/lib/email'

// Webhook secret for verification
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET

// Function to verify the webhook signature
function verifyWebhookSignature(request: Request): boolean {
  const signature = request.headers.get('x-supabase-webhook-secret')
  
  if (!WEBHOOK_SECRET || !signature) {
    return false
  }
  
  return signature === WEBHOOK_SECRET
}

export async function POST(request: Request) {
  try {
    // Verify this is a valid webhook request from Supabase
    if (!verifyWebhookSignature(request)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload = await request.json()
    
    // Extract event type and user data from the payload
    const { type, record } = payload
    
    // Process auth events
    if (type === 'INSERT' && record?.email) {
      // This is a new user signup event
      
      // Generate a signup link
      const supabase = await createServerSupabaseClient()
      
      // Create a sign-up confirmation URL with the user's email
      const confirmationToken = await generateSignupToken(supabase, record.email)
      
      if (confirmationToken) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const confirmUrl = `${baseUrl}/auth/confirm?token=${confirmationToken}`
        
        // Send the custom verification email
        await sendVerificationEmail(record.email, confirmUrl)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook payload', error)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}

// Helper function to generate a signup token
async function generateSignupToken(supabase: any, email: string): Promise<string | null> {
  try {
    // Generate a signup link using Supabase
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email
    })
    
    if (error) {
      console.error('Error generating signup token:', error)
      return null
    }
    
    // Return the token part from the full URL
    return data?.properties?.token || null
  } catch (error) {
    console.error('Error in generateSignupToken:', error)
    return null
  }
} 