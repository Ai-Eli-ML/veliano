import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from '@sentry/nextjs';
import {
  initializePerformanceMonitoring,
  measureAPIPerformance,
  measureDatabasePerformance,
} from '@/lib/monitoring/performance';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureMessage: vi.fn(),
  startSpan: vi.fn(() => ({
    setStatus: vi.fn(),
    finish: vi.fn(),
  })),
}));

describe('Performance Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window for web vitals
    global.window = {} as any;
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('initializePerformanceMonitoring', () => {
    it('should initialize monitoring when window is defined', () => {
      initializePerformanceMonitoring();
      // Initial setup should not trigger any Sentry calls
      expect(Sentry.captureMessage).not.toHaveBeenCalled();
    });
  });

  describe('measureAPIPerformance', () => {
    it('should measure successful API calls', async () => {
      const mockFn = vi.fn().mockResolvedValue({ data: 'success' });
      const result = await measureAPIPerformance('test-operation', mockFn);

      expect(Sentry.startSpan).toHaveBeenCalledWith({
        op: 'http',
        name: 'api-test-operation',
      });
      expect(result).toEqual({ data: 'success' });
    });

    it('should handle API errors correctly', async () => {
      const error = new Error('API Error');
      const mockFn = vi.fn().mockRejectedValue(error);

      await expect(
        measureAPIPerformance('test-operation', mockFn)
      ).rejects.toThrow('API Error');

      expect(Sentry.startSpan).toHaveBeenCalledWith({
        op: 'http',
        name: 'api-test-operation',
      });
    });
  });

  describe('measureDatabasePerformance', () => {
    it('should measure successful database operations', async () => {
      const mockFn = vi.fn().mockResolvedValue({ id: 1 });
      const result = await measureDatabasePerformance('test-query', mockFn);

      expect(Sentry.startSpan).toHaveBeenCalledWith({
        op: 'db',
        name: 'db-test-query',
      });
      expect(result).toEqual({ id: 1 });
    });

    it('should handle database errors correctly', async () => {
      const error = new Error('Database Error');
      const mockFn = vi.fn().mockRejectedValue(error);

      await expect(
        measureDatabasePerformance('test-query', mockFn)
      ).rejects.toThrow('Database Error');

      expect(Sentry.startSpan).toHaveBeenCalledWith({
        op: 'db',
        name: 'db-test-query',
      });
    });
  });
}); 