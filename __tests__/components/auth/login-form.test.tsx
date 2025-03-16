import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginForm from '@/components/auth/login-form'
import { useAuth } from '@/components/providers/auth-provider'
import { useToast } from '@/hooks/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock the hooks
jest.mock('@/components/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe('LoginForm', () => {
  const mockSignIn = jest.fn()
  const mockToast = jest.fn()
  const mockPush = jest.fn()
  const mockGet = jest.fn()

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Mock useAuth hook
    ;(useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
    })

    // Mock useToast hook
    ;(useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    })

    // Mock router
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })

    // Mock search params with default (no redirect)
    mockGet.mockReturnValue(null)
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    })
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('validates email format', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('validates password length', async () => {
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data and redirects to default path', async () => {
    mockSignIn.mockResolvedValueOnce({ success: true })

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login successful',
        description: 'Welcome back to Custom Gold Grillz',
      })
      expect(mockPush).toHaveBeenCalledWith('/account')
    })
  })

  it('submits form with valid data and redirects to custom path', async () => {
    mockSignIn.mockResolvedValueOnce({ success: true })
    mockGet.mockReturnValue('/custom-redirect')

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login successful',
        description: 'Welcome back to Custom Gold Grillz',
      })
      expect(mockPush).toHaveBeenCalledWith('/custom-redirect')
    })
  })

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials'
    mockSignIn.mockResolvedValueOnce({ success: false, error: { message: errorMessage } })

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Login failed',
        description: errorMessage,
      })
    })
  })

  it('handles unexpected errors', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Network error'))

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
      })
    })
  })

  it('shows loading state during submission', async () => {
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(await screen.findByText(/logging in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
}) 