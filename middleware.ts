import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for middleware
  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  // Get user session
  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not / redirect the user to /
  if (!session && request.nextUrl.pathname !== '/' && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is signed in and the current path is / redirect the user to /account
  if (session && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Check if route is admin-protected
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select()
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (!adminUser) {
      return NextResponse.redirect(new URL('/account', request.url))
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
    '/about',
    '/contact',
    '/products',
    '/reset-password',
  ]
  
  const publicPrefixes = [
    '/api/auth/',
    '/_next/',
    '/favicon',
    '/public/',
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

