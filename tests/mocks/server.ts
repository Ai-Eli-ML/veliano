import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

// Use localhost URL for MSW
const SUPABASE_URL = 'http://127.0.0.1:3000'

// Mock session data
const mockSession = {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: null as any,
}

// Mock user data
const mockUser = {
  id: 'test-user-id',
  email: 'test@veliano.com',
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmation_sent_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email' },
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Update session with user
mockSession.user = mockUser

// Mock profile data
const mockProfile: Profile = {
  id: mockUser.id,
  email: mockUser.email!,
  full_name: 'Test User',
  phone: null,
  address: null,
  bio: null,
  website: null,
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Helper to check auth header
const isAuthenticated = (request: Request) => {
  const authHeader = request.headers.get('Authorization')
  return authHeader?.includes('Bearer mock-access-token')
}

// Create MSW handlers
export const handlers = [
  // Sign up
  http.post(`${SUPABASE_URL}/auth/v1/signup`, async () => {
    return HttpResponse.json({
      user: mockUser,
      session: mockSession,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),

  // Sign in with password
  http.post(`${SUPABASE_URL}/auth/v1/token*`, async () => {
    return HttpResponse.json({
      user: mockUser,
      session: mockSession,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),

  // Get user
  http.get(`${SUPABASE_URL}/auth/v1/user`, async ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({ user: null }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    return HttpResponse.json({ user: mockUser }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),

  // Get profile
  http.get(`${SUPABASE_URL}/rest/v1/profiles*`, async ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({
        error: {
          message: 'Authentication required',
          status: 401,
        },
      }, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    return HttpResponse.json([mockProfile], {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),

  // Update profile
  http.patch(`${SUPABASE_URL}/rest/v1/profiles*`, async ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({
        error: {
          message: 'Authentication required',
          status: 401,
        },
      }, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    const updates = await request.json() as Partial<Profile>
    const updatedProfile: Profile = {
      ...mockProfile,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json([updatedProfile], {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),

  // Sign out
  http.post(`${SUPABASE_URL}/auth/v1/logout`, async () => {
    return HttpResponse.json({}, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),

  // OPTIONS requests for CORS
  http.options('*', async () => {
    return HttpResponse.json({}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }),
]

// Create test server
export const server = setupServer(...handlers) 