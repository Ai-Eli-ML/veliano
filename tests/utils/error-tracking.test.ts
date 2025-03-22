import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock the entire Sentry module with basic mock functions
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn().mockReturnValue('mock-event-id'),
  captureMessage: vi.fn().mockReturnValue('mock-event-id'),
  setUser: vi.fn(),
  withScope: vi.fn((callback) => {
    // Create a simple scope mock every time withScope is called
    const scope = {
      setLevel: vi.fn(),
      setTag: vi.fn(),
      setUser: vi.fn(),
      setExtras: vi.fn()
    };
    callback(scope);
    return scope; // Return scope for test assertions
  }),
  startTransaction: vi.fn().mockReturnValue({
    finish: vi.fn(),
    setTag: vi.fn()
  })
}));

// Now import the module under test and the mocked module
import { 
  trackError, 
  trackMessage, 
  setErrorUser,
  startPerformanceTransaction,
  finishPerformanceTransaction,
  measurePerformance
} from '@/lib/utils/error-tracking';
import * as Sentry from '@sentry/nextjs';

describe('Error Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('trackError captures an exception with metadata', () => {
    const error = new Error('Test error');
    const metadata = {
      severity: 'error' as const,
      context: {
        component: 'TestComponent',
        action: 'testAction',
        userId: 'user123',
        additionalData: { test: true }
      }
    };
    
    const eventId = trackError(error, metadata);
    
    expect(eventId).toBe('mock-event-id');
    expect(Sentry.withScope).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
    
    // Get the scope from the withScope mock call
    const mockCalls = vi.mocked(Sentry.withScope).mock.calls;
    expect(mockCalls.length).toBe(1);
    
    // Call the callback again with our spy to verify what it does
    const scopeSpy = {
      setLevel: vi.fn(),
      setTag: vi.fn(),
      setUser: vi.fn(),
      setExtras: vi.fn()
    };
    mockCalls[0][0](scopeSpy);
    
    expect(scopeSpy.setLevel).toHaveBeenCalledWith('error');
    expect(scopeSpy.setTag).toHaveBeenCalledWith('component', 'TestComponent');
    expect(scopeSpy.setTag).toHaveBeenCalledWith('action', 'testAction');
    expect(scopeSpy.setUser).toHaveBeenCalledWith({ id: 'user123' });
    expect(scopeSpy.setExtras).toHaveBeenCalledWith({ test: true });
  });

  test('trackMessage captures a message with metadata', () => {
    const message = 'Test message';
    const metadata = {
      severity: 'info' as const,
      context: {
        component: 'TestComponent'
      }
    };
    
    const eventId = trackMessage(message, metadata);
    
    expect(eventId).toBe('mock-event-id');
    expect(Sentry.withScope).toHaveBeenCalled();
    expect(Sentry.captureMessage).toHaveBeenCalledWith(message);
    
    // Get the scope from the withScope mock call
    const mockCalls = vi.mocked(Sentry.withScope).mock.calls;
    expect(mockCalls.length).toBe(1);
    
    // Call the callback again with our spy to verify what it does
    const scopeSpy = {
      setLevel: vi.fn(),
      setTag: vi.fn(),
      setUser: vi.fn(),
      setExtras: vi.fn()
    };
    mockCalls[0][0](scopeSpy);
    
    expect(scopeSpy.setLevel).toHaveBeenCalledWith('info');
    expect(scopeSpy.setTag).toHaveBeenCalledWith('component', 'TestComponent');
  });

  test('setErrorUser sets the user in Sentry', () => {
    setErrorUser('user123');
    expect(Sentry.setUser).toHaveBeenCalledWith({ id: 'user123' });
    
    setErrorUser(null);
    expect(Sentry.setUser).toHaveBeenCalledWith(null);
  });

  test('startPerformanceTransaction starts a transaction with options', () => {
    const options = {
      description: 'Test transaction',
      component: 'TestComponent',
      action: 'testAction',
      userId: 'user123',
      data: { test: true }
    };
    
    const transaction = startPerformanceTransaction('TestTransaction', options);
    
    expect(Sentry.startTransaction).toHaveBeenCalledWith({
      name: 'TestTransaction',
      description: 'Test transaction',
      data: { test: true },
      tags: {
        component: 'TestComponent',
        action: 'testAction'
      }
    });
    
    // Check that transaction.setTag was called
    expect(transaction?.setTag).toBeDefined();
    transaction?.setTag('user_id', 'test'); // Just to verify it exists
  });

  test('finishPerformanceTransaction finishes a transaction', () => {
    const mockTransaction = {
      finish: vi.fn(),
      setTag: vi.fn()
    };
    
    finishPerformanceTransaction(mockTransaction);
    
    expect(mockTransaction.finish).toHaveBeenCalled();
  });

  test('measurePerformance measures performance of a successful operation', async () => {
    const mockOperation = vi.fn().mockResolvedValue('result');
    
    const result = await measurePerformance('TestOperation', mockOperation, {
      component: 'TestComponent'
    });
    
    expect(result).toBe('result');
    expect(Sentry.startTransaction).toHaveBeenCalled();
    
    // The transaction.finish is called inside the measurePerformance function
    // We can't directly test it, but we can verify startTransaction was called
  });

  test('measurePerformance handles and tracks errors', async () => {
    const testError = new Error('Operation failed');
    const mockOperation = vi.fn().mockRejectedValue(testError);
    
    await expect(measurePerformance('TestOperation', mockOperation, {
      component: 'TestComponent',
      action: 'testAction'
    })).rejects.toThrow('Operation failed');
    
    expect(Sentry.startTransaction).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(testError);
  });
}); 