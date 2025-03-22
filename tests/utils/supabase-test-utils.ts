import { SupabaseClient } from '@supabase/supabase-js';
import { vi } from 'vitest';

type MockResponse<T> = {
  data: T | null;
  error: null | {
    code: string;
    message: string;
    details: string;
    hint: string;
  };
};

type MockQueryResponse = {
  data: null;
  error: {
    code: string;
    message: string;
    details: string;
    hint: string;
  };
  count: null;
  status: number;
  statusText: string;
};

export function createMockSupabase() {
  return {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    mockSelect: vi.fn().mockResolvedValue({ data: [], error: null }),
    mockInsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    mockUpdate: vi.fn().mockResolvedValue({ data: null, error: null }),
    mockDelete: vi.fn().mockResolvedValue({ data: null, error: null }),
    // Add simulation of network delay
    withDelay: (ms: number, result: any) => 
      new Promise(resolve => setTimeout(() => resolve(result), ms))
  };
}

export function mockSupabaseError(message: string) {
  return {
    data: null,
    error: new Error(message)
  };
}

export function mockOptimisticUpdateFailure(mockSupabase: ReturnType<typeof createMockSupabase>, delay = 300) {
  // First call succeeds, second call fails
  mockSupabase.mockInsert
    .mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve({
            data: null,
            error: new Error('Network error during operation')
          }), 
          delay
        )
      )
    );
}

export function simulateNetworkDelay<T>(result: T, delay = 100): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(result), delay));
} 