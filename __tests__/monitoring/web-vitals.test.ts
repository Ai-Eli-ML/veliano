import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from '@sentry/nextjs';
import { initializePerformanceMonitoring } from '@/lib/monitoring/performance';
import { onLCP, onFID, onCLS } from 'web-vitals';

// Mock web-vitals
vi.mock('web-vitals', () => ({
  onLCP: vi.fn(),
  onFID: vi.fn(),
  onCLS: vi.fn(),
}));

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureMessage: vi.fn(),
}));

describe('Web Vitals Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window
    global.window = {} as any;
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('LCP Monitoring', () => {
    it('should report good LCP values', () => {
      initializePerformanceMonitoring();
      
      // Get the callback function passed to onLCP
      const lcpCallback = (onLCP as jest.Mock).mock.calls[0][0];
      
      // Simulate good LCP
      lcpCallback({ value: 2000 });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('LCP Recorded', {
        level: 'info',
        extra: {
          metric: 'LCP',
          value: 2000,
          threshold: 2500,
        },
      });
    });

    it('should report poor LCP values', () => {
      initializePerformanceMonitoring();
      
      const lcpCallback = (onLCP as jest.Mock).mock.calls[0][0];
      
      // Simulate poor LCP
      lcpCallback({ value: 3000 });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('LCP Recorded', {
        level: 'warning',
        extra: {
          metric: 'LCP',
          value: 3000,
          threshold: 2500,
        },
      });
    });
  });

  describe('FID Monitoring', () => {
    it('should report good FID values', () => {
      initializePerformanceMonitoring();
      
      const fidCallback = (onFID as jest.Mock).mock.calls[0][0];
      
      // Simulate good FID
      fidCallback({ value: 50 });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('FID Recorded', {
        level: 'info',
        extra: {
          metric: 'FID',
          value: 50,
          threshold: 100,
        },
      });
    });

    it('should report poor FID values', () => {
      initializePerformanceMonitoring();
      
      const fidCallback = (onFID as jest.Mock).mock.calls[0][0];
      
      // Simulate poor FID
      fidCallback({ value: 150 });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('FID Recorded', {
        level: 'warning',
        extra: {
          metric: 'FID',
          value: 150,
          threshold: 100,
        },
      });
    });
  });

  describe('CLS Monitoring', () => {
    it('should report good CLS values', () => {
      initializePerformanceMonitoring();
      
      const clsCallback = (onCLS as jest.Mock).mock.calls[0][0];
      
      // Simulate good CLS
      clsCallback({ value: 0.05 });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('CLS Recorded', {
        level: 'info',
        extra: {
          metric: 'CLS',
          value: 0.05,
          threshold: 0.1,
        },
      });
    });

    it('should report poor CLS values', () => {
      initializePerformanceMonitoring();
      
      const clsCallback = (onCLS as jest.Mock).mock.calls[0][0];
      
      // Simulate poor CLS
      clsCallback({ value: 0.15 });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('CLS Recorded', {
        level: 'warning',
        extra: {
          metric: 'CLS',
          value: 0.15,
          threshold: 0.1,
        },
      });
    });
  });
}); 