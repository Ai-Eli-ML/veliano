// Import vi first
import { vi } from 'vitest';

// Mock modules first - these must be before any other imports
vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn()
}));

// Define toast mock directly in the mock function
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

vi.mock('@/lib/utils/error-tracking', () => ({
  trackError: vi.fn()
}));

// Then import everything else
import { test, expect, describe, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Import components
import { AddressManager } from '@/components/profile/AddressManager';
import { supabase } from '@/lib/supabase-client';
import { trackError } from '@/lib/utils/error-tracking';
import { toast } from 'react-hot-toast';

// Get the mocked toast functions for assertions
const mockToast = vi.mocked(toast);

describe('AddressManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Cast supabase to 'any' to bypass TypeScript errors with mocks
    const mockSupabase = supabase as any;
    
    // Set up chain of mock functions
    const mockEq = vi.fn();
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ select: mockSelect });
    
    // Default success response
    mockEq.mockResolvedValue({
      data: [
        { 
          id: '1', 
          user_id: 'user1', 
          street: '123 Main St', 
          city: 'New York', 
          state: 'NY', 
          zip_code: '10001', 
          is_default: true 
        }
      ],
      error: null
    });
  });

  test('displays addresses properly', async () => {
    // Render component
    render(<AddressManager userId="user1" />);
    
    // Check for loading state
    expect(screen.getByText(/loading addresses/i)).toBeInTheDocument();
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.queryByText(/loading addresses/i)).not.toBeInTheDocument();
    });
    
    // Verify address display
    expect(screen.getByTestId('address-item')).toBeInTheDocument();
    expect(screen.getByTestId('address-street')).toHaveTextContent('123 Main St');
    expect(screen.getByTestId('address-city-state')).toHaveTextContent('New York, NY 10001');
  });

  test('shows error message when loading fails', async () => {
    // Override default mock for this test
    const mockSupabase = supabase as any;
    const mockEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Error loading addresses' }
    });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ select: mockSelect });

    // Render component
    render(<AddressManager userId="user1" />);
    
    // Wait for loading to finish and error to appear
    await waitFor(() => {
      expect(screen.queryByText(/loading addresses/i)).not.toBeInTheDocument();
      expect(screen.getByText(/failed to load addresses/i)).toBeInTheDocument();
    });
    
    // Verify retry button
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  test('can add a new address', async () => {
    // Setup mocks for this test
    const mockSupabase = supabase as any;
    
    // Initial load returns empty array
    const mockEq = vi.fn().mockResolvedValue({
      data: [],
      error: null
    });
    
    // Mock for the insert operation
    const mockSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'new-id',
        user_id: 'user1',
        street: '456 Elm St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02108',
        is_default: false
      },
      error: null
    });
    
    const mockInsertSelect = vi.fn().mockReturnValue({ 
      single: mockSingle 
    });
    
    const mockInsert = vi.fn().mockReturnValue({
      select: mockInsertSelect
    });
    
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    
    // Set up the chain
    mockSupabase.from.mockImplementation((table: string) => {
      return {
        select: mockSelect,
        insert: mockInsert
      };
    });

    // Render component
    render(<AddressManager userId="user1" />);
    
    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading addresses/i)).not.toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByLabelText(/street address/i), { 
      target: { value: '456 Elm St' } 
    });
    fireEvent.change(screen.getByLabelText(/city/i), { 
      target: { value: 'Boston' } 
    });
    fireEvent.change(screen.getByLabelText(/state/i), { 
      target: { value: 'MA' } 
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), { 
      target: { value: '02108' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText(/add address/i));
    
    // Wait for address to be added (optimistic update)
    await waitFor(() => {
      expect(screen.getByTestId('address-street')).toHaveTextContent('456 Elm St');
      expect(screen.getByTestId('address-city-state')).toHaveTextContent('Boston, MA 02108');
    });
  });

  test('recovers from network errors during delete operations', async () => {
    // Setup mocks for this test
    const mockSupabase = supabase as any;
    
    // Initial load returns an address
    const mockEq = vi.fn().mockResolvedValue({
      data: [
        { 
          id: '1', 
          user_id: 'user1', 
          street: '123 Main St', 
          city: 'New York', 
          state: 'NY', 
          zip_code: '10001', 
          is_default: true 
        }
      ],
      error: null
    });
    
    // Delete operation that will fail
    const mockDelete = vi.fn().mockResolvedValue({
      error: { message: 'Network error during delete' }
    });
    
    // Set up the mocks for different operations
    mockSupabase.from.mockImplementation((table: string) => {
      return {
        select: vi.fn().mockReturnValue({ eq: mockEq }),
        delete: vi.fn().mockReturnValue({ eq: mockDelete })
      };
    });

    // Render component
    render(<AddressManager userId="user1" />);
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.queryByText(/loading addresses/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('address-item')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButton = screen.getByLabelText(/delete address/i);
    fireEvent.click(deleteButton);
    
    // The address should be temporarily removed (optimistic update)
    await waitFor(() => {
      expect(screen.queryByTestId('address-item')).not.toBeInTheDocument();
    });
    
    // After error, the address should reappear and error toast should be shown
    await waitFor(() => {
      // Verify toast error was called
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete address');
      
      // Address should be restored after delete failure
      expect(screen.getByTestId('address-item')).toBeInTheDocument();
      expect(screen.getByTestId('address-street')).toHaveTextContent('123 Main St');
    });
    
    // Verify error tracking was called
    expect(trackError).toHaveBeenCalledWith(expect.any(Error), {
      severity: 'error',
      context: expect.objectContaining({
        component: 'AddressManager',
        action: 'deleteAddress'
      })
    });
  });

  test('validates optimistic updates when setting default address', async () => {
    // Setup mocks for this test
    const mockSupabase = supabase as any;
    
    // Initial load returns two addresses
    const mockEq = vi.fn().mockResolvedValue({
      data: [
        { 
          id: '1', 
          user_id: 'user1', 
          street: '123 Main St', 
          city: 'New York', 
          state: 'NY', 
          zip_code: '10001', 
          is_default: true 
        },
        { 
          id: '2', 
          user_id: 'user1', 
          street: '456 Elm St', 
          city: 'Boston', 
          state: 'MA', 
          zip_code: '02108', 
          is_default: false 
        }
      ],
      error: null
    });
    
    // Update operation that will fail
    const mockUpdate = vi.fn().mockResolvedValue({
      error: { message: 'Network error during update' }
    });
    
    // Set up the mocks for different operations
    mockSupabase.from.mockImplementation((table: string) => {
      return {
        select: vi.fn().mockReturnValue({ eq: mockEq }),
        update: vi.fn().mockReturnValue({ 
          eq: mockUpdate,
          neq: vi.fn().mockReturnValue({ eq: mockUpdate }) 
        })
      };
    });

    // Render component
    render(<AddressManager userId="user1" />);
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.queryByText(/loading addresses/i)).not.toBeInTheDocument();
      expect(screen.getAllByTestId('address-item').length).toBe(2);
    });
    
    // Find the "Set as default" button on the second address
    const defaultButtons = screen.getAllByText(/set as default/i);
    expect(defaultButtons.length).toBe(1); // Only the non-default address has this button
    fireEvent.click(defaultButtons[0]);
    
    // Immediately after click, the UI should update optimistically
    // The second address should now show as default
    await waitFor(() => {
      const badges = screen.getAllByText('Default');
      expect(badges.length).toBe(1);
      
      // The default badge should be on the second address
      const addressItems = screen.getAllByTestId('address-item');
      const secondAddressItem = addressItems.find(item => 
        item.textContent?.includes('456 Elm St')
      );
      expect(secondAddressItem?.textContent).toContain('Default');
    });
    
    // After error, the system should revert the change and show an error message
    await waitFor(() => {
      // Check that toast.error was called with the expected message
      expect(mockToast.error).toHaveBeenCalledWith('Failed to update address');
      
      // The default badge should be back on the first address
      const addressItems = screen.getAllByTestId('address-item');
      const firstAddressItem = addressItems.find(item => 
        item.textContent?.includes('123 Main St')
      );
      expect(firstAddressItem?.textContent).toContain('Default');
    });
    
    // Verify error was logged with Sentry
    expect(trackError).toHaveBeenCalled();
  });
}); 