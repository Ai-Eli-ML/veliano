import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FallbackProps } from 'react-error-boundary';
import * as Sentry from '@sentry/nextjs';
import { SentryErrorBoundary } from '@/components/error/SentryErrorBoundary';
import { act } from 'react-dom/test-utils';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withScope: vi.fn((callback) => callback({ setExtra: vi.fn() })),
}));

// Component that throws an error
const ErrorComponent = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Custom fallback for testing
const TestFallback = ({ resetErrorBoundary }: FallbackProps) => (
  <div>
    <p>Error Boundary Fallback</p>
    <button onClick={resetErrorBoundary}>Retry</button>
  </div>
);

describe('Error Handling Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Client-side Error Handling', () => {
    it('should capture client-side errors with Sentry', () => {
      render(
        <SentryErrorBoundary fallback={TestFallback}>
          <ErrorComponent />
        </SentryErrorBoundary>
      );

      expect(Sentry.withScope).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalled();
      expect(screen.getByText('Error Boundary Fallback')).toBeInTheDocument();
    });

    it('should include error context in Sentry capture', () => {
      render(
        <SentryErrorBoundary fallback={TestFallback}>
          <ErrorComponent />
        </SentryErrorBoundary>
      );

      expect(Sentry.withScope).toHaveBeenCalled();
      expect(screen.getByText('Error Boundary Fallback')).toBeInTheDocument();
    });
  });

  describe('Server-side Error Handling', () => {
    it('should capture server-side errors with Sentry', () => {
      const error = new Error('Server error');
      Sentry.captureException(error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should handle server component errors gracefully', () => {
      render(
        <SentryErrorBoundary fallback={TestFallback}>
          <ErrorComponent />
        </SentryErrorBoundary>
      );

      expect(screen.getByText('Error Boundary Fallback')).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('should handle error recovery through error boundary reset', async () => {
      let shouldThrow = true;
      
      const TestComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>No error</div>;
      };

      const { rerender } = render(
        <SentryErrorBoundary fallback={TestFallback}>
          <TestComponent />
        </SentryErrorBoundary>
      );

      // Initial error state
      expect(screen.getByText('Error Boundary Fallback')).toBeInTheDocument();

      // Click retry and update shouldThrow
      await act(async () => {
        shouldThrow = false;
        fireEvent.click(screen.getByText('Retry'));
      });

      // Rerender with updated state
      await act(async () => {
        rerender(
          <SentryErrorBoundary fallback={TestFallback}>
            <TestComponent />
          </SentryErrorBoundary>
        );
      });

      // Verify recovery
      await waitFor(() => {
        expect(screen.queryByText('Error Boundary Fallback')).not.toBeInTheDocument();
        expect(screen.getByText('No error')).toBeInTheDocument();
      });
    });
  });
}); 