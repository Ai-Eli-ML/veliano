import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient({ cookies: () => cookieStore })
    
    // Try to fetch categories as a simple test
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 