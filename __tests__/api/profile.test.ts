import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}))

describe('Profile API Routes', () => {
  const mockUserId = 'test-user-id'
  let mockSupabaseClient: any

  beforeEach(() => {
    mockSupabaseClient = {
      from: vi.fn(() => mockSupabaseClient),
      select: vi.fn(() => mockSupabaseClient),
      insert: vi.fn(() => mockSupabaseClient),
      update: vi.fn(() => mockSupabaseClient),
      eq: vi.fn(() => mockSupabaseClient),
      single: vi.fn(() => mockSupabaseClient),
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: 'avatars/test.jpg' } }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.jpg' } })
        })
      }
    }

    ;(createClient as any).mockReturnValue(mockSupabaseClient)
  })

  describe('PUT /api/profile', () => {
    it('should update user profile', async () => {
      const { PUT } = await import('@/app/api/profile/route')
      
      const request = new NextRequest('http://localhost/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          userId: mockUserId,
          name: 'Test User',
          email: 'test@example.com'
        })
      })

      mockSupabaseClient.update.mockResolvedValueOnce({ data: { id: mockUserId }, error: null })

      const response = await PUT(request)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toEqual({ success: true })
    })

    it('should handle profile update errors', async () => {
      const { PUT } = await import('@/app/api/profile/route')
      
      const request = new NextRequest('http://localhost/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          userId: mockUserId,
          name: 'Test User',
          email: 'invalid-email'
        })
      })

      mockSupabaseClient.update.mockRejectedValueOnce(new Error('Database error'))

      const response = await PUT(request)
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('POST /api/profile/avatar', () => {
    it('should upload avatar image', async () => {
      const { POST } = await import('@/app/api/profile/avatar/route')
      
      const formData = new FormData()
      formData.append('avatar', new Blob(['test-image'], { type: 'image/jpeg' }), 'test.jpg')
      formData.append('userId', mockUserId)

      const request = new NextRequest('http://localhost/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('avatarUrl')
    })

    it('should handle avatar upload errors', async () => {
      const { POST } = await import('@/app/api/profile/avatar/route')
      
      mockSupabaseClient.storage.from().upload.mockRejectedValueOnce(new Error('Storage error'))

      const formData = new FormData()
      formData.append('avatar', new Blob(['test-image'], { type: 'image/jpeg' }), 'test.jpg')
      formData.append('userId', mockUserId)

      const request = new NextRequest('http://localhost/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('POST /api/profile/addresses', () => {
    it('should add new address', async () => {
      const { POST } = await import('@/app/api/profile/addresses/route')
      
      const request = new NextRequest('http://localhost/api/profile/addresses', {
        method: 'POST',
        body: JSON.stringify({
          userId: mockUserId,
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345'
        })
      })

      mockSupabaseClient.insert.mockResolvedValueOnce({
        data: { id: 'test-address-id', isDefault: false },
        error: null
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('id')
    })

    it('should handle address creation errors', async () => {
      const { POST } = await import('@/app/api/profile/addresses/route')
      
      const request = new NextRequest('http://localhost/api/profile/addresses', {
        method: 'POST',
        body: JSON.stringify({
          userId: mockUserId,
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345'
        })
      })

      mockSupabaseClient.insert.mockRejectedValueOnce(new Error('Database error'))

      const response = await POST(request)
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('PUT /api/profile/preferences', () => {
    it('should update user preferences', async () => {
      const { PUT } = await import('@/app/api/profile/preferences/route')
      
      const request = new NextRequest('http://localhost/api/profile/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          userId: mockUserId,
          preference: 'marketingEmails',
          value: true
        })
      })

      mockSupabaseClient.update.mockResolvedValueOnce({ data: { id: mockUserId }, error: null })

      const response = await PUT(request)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toEqual({ success: true })
    })

    it('should handle preference update errors', async () => {
      const { PUT } = await import('@/app/api/profile/preferences/route')
      
      const request = new NextRequest('http://localhost/api/profile/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          userId: mockUserId,
          preference: 'marketingEmails',
          value: true
        })
      })

      mockSupabaseClient.update.mockRejectedValueOnce(new Error('Database error'))

      const response = await PUT(request)
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })
}) 