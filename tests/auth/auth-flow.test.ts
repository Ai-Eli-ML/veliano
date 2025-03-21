import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { loadEnvConfig } from '@next/env'

// Load environment variables
const projectDir = process.cwd()
loadEnvConfig(projectDir, true)

// Mock data
const mockUser = {
  id: 'test-user-id',
  email: 'test@veliano.com',
  phone: '',
  created_at: new Date().toISOString(),
}

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
}

const mockProfile = {
  id: mockUser.id,
  email: mockUser.email,
  full_name: 'Test User',
  phone: null,
  address: null,
  bio: null,
  website: null,
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Create a reusable query builder mock
const createQueryBuilderMock = (returnData = mockProfile) => {
  let currentData = returnData
  const mock = {
    data: null as any,
    select: vi.fn(() => mock),
    insert: vi.fn(() => {
      currentData = { ...mockProfile, ...currentData }
      return mock
    }),
    update: vi.fn((updates) => {
      currentData = { ...currentData, ...updates }
      return mock
    }),
    eq: vi.fn(() => mock),
    single: vi.fn(() => {
      mock.data = { data: currentData, error: null }
      return Promise.resolve(mock.data)
    }),
  }
  return mock
}

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn(() => createQueryBuilderMock()),
  })),
}))

const testUser = {
  email: 'test@veliano.com',
  password: 'testpassword123',
}

describe('Authentication Flow', () => {
  let supabase: ReturnType<typeof createClient<Database>>

  beforeAll(() => {
    supabase = createClient<Database>(
      'mock-url',
      'mock-key'
    )
  })

  it('should sign up a new user', async () => {
    const { data, error } = await supabase.auth.signUp(testUser)
    expect(error).toBeNull()
    expect(data.user).not.toBeNull()
    expect(data.session).not.toBeNull()
  })

  it('should sign in an existing user', async () => {
    const { data, error } = await supabase.auth.signInWithPassword(testUser)
    expect(error).toBeNull()
    expect(data.user).not.toBeNull()
    expect(data.session).not.toBeNull()
  })

  it('should create a profile for the user', async () => {
    const { data: authData } = await supabase.auth.signInWithPassword(testUser)
    expect(authData.session).not.toBeNull()

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user!.id,
        email: authData.user!.email!,
        full_name: 'Test User',
      }])
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).not.toBeNull()
    expect(data.full_name).toBe('Test User')
  })

  it('should update user profile', async () => {
    const { data: authData } = await supabase.auth.signInWithPassword(testUser)
    expect(authData.session).not.toBeNull()

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: 'Updated Name' })
      .eq('id', authData.user!.id)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).not.toBeNull()
    expect(data.full_name).toBe('Updated Name')
  })

  it('should sign out the user', async () => {
    const { error } = await supabase.auth.signOut()
    expect(error).toBeNull()
  })
}) 