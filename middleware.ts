import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const pathname = requestUrl.pathname
  
  // Create a response object
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for middleware
  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  // Get user session
  const { data: { session } } = await supabase.auth.getSession()

  // If the route is public, allow access
  if (isPublicRoute(pathname)) {
    // If user is signed in and trying to access auth pages, redirect to account
    if (
      session && 
      (pathname === '/account/login' || 
       pathname === '/account/register' || 
       pathname === '/account/forgot-password')
    ) {
      return NextResponse.redirect(new URL('/account', requestUrl.origin))
    }
    
    return response
  }

  // For non-public routes, check if user is authenticated
  if (!session) {
    // Save the original URL to redirect back after login
    const redirectUrl = new URL('/account/login', requestUrl.origin)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if route is admin-protected
  if (pathname.startsWith('/admin')) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select()
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (!adminUser) {
      return NextResponse.redirect(new URL('/account', requestUrl.origin))
    }
  }

  return response
}

// Helper to determine if a route is public
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/register',
    '/about',
    '/contact',
    '/products',
    '/reset-password',
    '/account/login',
    '/account/register',
    '/account/forgot-password',
    '/account/reset-password',
    '/how-it-works',
    '/faq',
    '/ambassador-program',
    '/warranty',
    '/privacy-policy',
    '/terms-of-service',
    '/shipping-delivery',
    '/returns-exchanges'
  ]
  
  const publicPrefixes = [
    '/api/auth/',
    '/_next/',
    '/favicon',
    '/public/',
    '/products/',
    '/search'
  ]
  
  if (publicRoutes.includes(pathname)) {
    return true
  }
  
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return true
  }
  
  return false
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

