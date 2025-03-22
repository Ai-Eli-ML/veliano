import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
vi.mock('@sentry/nextjs', () => {
  const mockSpan = {
    finish: vi.fn(),
    setTag: vi.fn(),
    setTags: vi.fn(),
  };

  const mockTransaction = {
    startChild: vi.fn(() => mockSpan),
    finish: vi.fn(),
    setTag: vi.fn(),
    setTags: vi.fn(),
  };

  return {
    init: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    configureScope: vi.fn((callback) => callback({ setTag: vi.fn() })),
    withScope: vi.fn((callback) => callback({ setTag: vi.fn() })),
    startSpan: vi.fn(() => mockSpan),
    startTransaction: vi.fn(() => mockTransaction),
  };
});

describe('Performance Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Transaction Monitoring', () => {
    test('should create and finish transactions', async () => {
      const transaction = Sentry.startTransaction({
        name: 'test-transaction',
        op: 'test',
      });

      expect(Sentry.startTransaction).toHaveBeenCalledWith({
        name: 'test-transaction',
        op: 'test',
      });

      const span = transaction.startChild({
        op: 'child-operation',
        description: 'child span',
      });

      expect(transaction.startChild).toHaveBeenCalledWith({
        op: 'child-operation',
        description: 'child span',
      });

      span.finish();
      expect(span.finish).toHaveBeenCalled();

      transaction.finish();
      expect(transaction.finish).toHaveBeenCalled();
    });
  });

  describe('Performance Tags', () => {
    test('should set performance tags', () => {
      const transaction = Sentry.startTransaction({
        name: 'test-transaction',
        op: 'test',
      });

      transaction.setTag('custom_tag', 'test_value');
      expect(transaction.setTag).toHaveBeenCalledWith('custom_tag', 'test_value');

      transaction.setTags({
        environment: 'test',
        feature: 'performance',
      });
      expect(transaction.setTags).toHaveBeenCalledWith({
        environment: 'test',
        feature: 'performance',
      });
    });
  });

  describe('Performance Metrics', () => {
    test('should track custom performance metrics', () => {
      const transaction = Sentry.startTransaction({
        name: 'metrics-test',
        op: 'test',
      });

      const span = transaction.startChild({
        op: 'db-query',
        description: 'Database operation',
      });

      // Simulate some work
      setTimeout(() => {
        span.finish();
      }, 100);

      transaction.finish();

      expect(transaction.startChild).toHaveBeenCalledWith({
        op: 'db-query',
        description: 'Database operation',
      });
    });
  });
}); 