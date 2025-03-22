import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserProfileEditor } from '@/components/profile/UserProfileEditor'
import { vi } from 'vitest'

describe('Profile Management Integration', () => {
  const mockUserId = 'test-user-id'
  const mockInitialData = {
    avatar: 'https://example.com/avatar.jpg',
    name: 'John Doe',
    email: 'john@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Profile Update Flow', () => {
    it('should handle complete profile update process', async () => {
      render(<UserProfileEditor userId={mockUserId} initialData={mockInitialData} />)

      // Update profile information
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } })
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })

      // Upload new avatar
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const avatarInput = screen.getByTestId('avatar-upload')
      fireEvent.change(avatarInput, { target: { files: [file] } })

      // Add new address
      fireEvent.change(screen.getByLabelText('Street Address'), { target: { value: '456 New St' } })
      fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New City' } })
      fireEvent.change(screen.getByLabelText('State'), { target: { value: 'NC' } })
      fireEvent.change(screen.getByLabelText('ZIP Code'), { target: { value: '54321' } })
      fireEvent.click(screen.getByText('Add Address'))

      // Update preferences
      fireEvent.click(screen.getByLabelText('Marketing Emails'))
      fireEvent.click(screen.getByLabelText('New Product Notifications'))

      // Verify all updates
      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('Jane Doe')
        expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com')
        expect(screen.getByText('Avatar updated successfully')).toBeInTheDocument()
        expect(screen.getByText('456 New St')).toBeInTheDocument()
        expect(screen.getByText('New City, NC 54321')).toBeInTheDocument()
        expect(screen.getByLabelText('Marketing Emails')).toBeChecked()
        expect(screen.getByLabelText('New Product Notifications')).toBeChecked()
      })
    })
  })

  describe('Error Recovery Flow', () => {
    it('should handle and recover from errors', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<UserProfileEditor userId={mockUserId} initialData={mockInitialData} />)

      // Mock network error for avatar upload
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))
      
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const avatarInput = screen.getByTestId('avatar-upload')
      fireEvent.change(avatarInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('Failed to update avatar')).toBeInTheDocument()
      })

      // Retry avatar upload
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true })
      fireEvent.change(avatarInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('Avatar updated successfully')).toBeInTheDocument()
      })
    })
  })

  describe('Optimistic Updates', () => {
    it('should handle optimistic updates and rollbacks', async () => {
      render(<UserProfileEditor userId={mockUserId} initialData={mockInitialData} />)

      // Optimistic update for preferences
      const marketingToggle = screen.getByLabelText('Marketing Emails')
      fireEvent.click(marketingToggle)
      expect(marketingToggle).toBeChecked() // Immediate update

      // Mock API failure
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

      await waitFor(() => {
        expect(marketingToggle).not.toBeChecked() // Should rollback
        expect(screen.getByText('Failed to update preferences')).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should validate all forms before submission', async () => {
      render(<UserProfileEditor userId={mockUserId} initialData={mockInitialData} />)

      // Try to submit address with invalid ZIP
      fireEvent.change(screen.getByLabelText('ZIP Code'), { target: { value: '123' } })
      fireEvent.click(screen.getByText('Add Address'))

      expect(screen.getByLabelText('ZIP Code')).toBeInvalid()

      // Fix ZIP and submit
      fireEvent.change(screen.getByLabelText('ZIP Code'), { target: { value: '12345' } })
      fireEvent.click(screen.getByText('Add Address'))

      await waitFor(() => {
        expect(screen.getByText('Address added successfully')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading states during operations', async () => {
      render(<UserProfileEditor userId={mockUserId} initialData={mockInitialData} />)

      // Trigger multiple operations
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const avatarInput = screen.getByTestId('avatar-upload')
      fireEvent.change(avatarInput, { target: { files: [file] } })

      const addAddressButton = screen.getByText('Add Address')
      fireEvent.click(addAddressButton)

      const marketingToggle = screen.getByLabelText('Marketing Emails')
      fireEvent.click(marketingToggle)

      // Verify loading states
      expect(screen.getByText('Change Avatar')).toBeDisabled()
      expect(addAddressButton).toBeDisabled()
      expect(marketingToggle).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByText('Change Avatar')).not.toBeDisabled()
        expect(addAddressButton).not.toBeDisabled()
        expect(marketingToggle).not.toBeDisabled()
      })
    })
  })
}) 