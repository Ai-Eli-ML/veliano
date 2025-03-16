"use client"

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // Create a response with the same headers as the request
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client using server component
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/',
    '/products',
    '/search',
    '/categories'
  ]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    requestUrl.pathname.startsWith(route) || 
    requestUrl.pathname === '/'
  )

  // Handle authentication redirects
  if (!session && !isPublicRoute) {
    // Store the original URL to redirect back after login
    const redirectUrl = new URL('/login', requestUrl.origin)
    redirectUrl.searchParams.set('redirectTo', requestUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Handle admin routes
  if (session && requestUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (session && ['/login', '/register', '/forgot-password', '/reset-password'].some(route => 
    requestUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
} 
