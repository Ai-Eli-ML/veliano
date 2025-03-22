import * as Sentry from '@sentry/nextjs';
import { getCurrentHub } from '@sentry/core';
import { onCLS, onFID, onLCP } from 'web-vitals';
import type {
  MonitoringOptions,
  PerformanceMetric,
  SpanContext,
  WebVitalMetric,
  MonitoringResult,
  SpanOperation,
} from './types';

const DEFAULT_OPTIONS: MonitoringOptions = {
  shouldMonitorWebVitals: true,
  shouldMonitorAPI: true,
  shouldMonitorDatabase: true,
};

export const initializePerformanceMonitoring = (
  options: MonitoringOptions = DEFAULT_OPTIONS
) => {
  if (options.shouldMonitorWebVitals && typeof window !== 'undefined') {
    onLCP((metric) => {
      const webVitalMetric: WebVitalMetric = {
        ...metric,
        threshold: 2500,
        status: metric.value <= 2500 ? 'good' : 'poor',
      };

      Sentry.captureMessage('LCP Recorded', {
        level: webVitalMetric.status === 'good' ? 'info' : 'warning',
        extra: {
          metric: 'LCP',
          value: webVitalMetric.value,
          threshold: webVitalMetric.threshold,
        },
      });
    });

    onFID((metric) => {
      const webVitalMetric: WebVitalMetric = {
        ...metric,
        threshold: 100,
        status: metric.value <= 100 ? 'good' : 'poor',
      };

      Sentry.captureMessage('FID Recorded', {
        level: webVitalMetric.status === 'good' ? 'info' : 'warning',
        extra: {
          metric: 'FID',
          value: webVitalMetric.value,
          threshold: webVitalMetric.threshold,
        },
      });
    });

    onCLS((metric) => {
      const webVitalMetric: WebVitalMetric = {
        ...metric,
        threshold: 0.1,
        status: metric.value <= 0.1 ? 'good' : 'poor',
      };

      Sentry.captureMessage('CLS Recorded', {
        level: webVitalMetric.status === 'good' ? 'info' : 'warning',
        extra: {
          metric: 'CLS',
          value: webVitalMetric.value,
          threshold: webVitalMetric.threshold,
        },
      });
    });
  }
};

export const measureAPIPerformance = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<MonitoringResult<T>> => {
  const startTime = performance.now();
  const context: SpanContext = {
    op: 'http' as SpanOperation,
    name: `api-${operation}`,
  };

  const hub = getCurrentHub();
  const transaction = hub.startTransaction({
    name: context.name,
    op: context.op,
  });

  const span = transaction?.startChild(context);

  try {
    const data = await fn();
    span?.setStatus('ok');
    transaction?.setStatus('ok');
    return {
      data,
      duration: performance.now() - startTime,
      success: true,
    };
  } catch (error) {
    span?.setStatus('error');
    transaction?.setStatus('error');
    return {
      data: null as T,
      duration: performance.now() - startTime,
      success: false,
      error: error as Error,
    };
  } finally {
    span?.finish();
    transaction?.finish();
  }
};

export const measureDatabasePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<MonitoringResult<T>> => {
  const startTime = performance.now();
  const context: SpanContext = {
    op: 'db' as SpanOperation,
    name: `db-${operation}`,
  };

  const hub = getCurrentHub();
  const transaction = hub.startTransaction({
    name: context.name,
    op: context.op,
  });

  const span = transaction?.startChild(context);

  try {
    const data = await fn();
    span?.setStatus('ok');
    transaction?.setStatus('ok');
    return {
      data,
      duration: performance.now() - startTime,
      success: true,
    };
  } catch (error) {
    span?.setStatus('error');
    transaction?.setStatus('error');
    return {
      data: null as T,
      duration: performance.now() - startTime,
      success: false,
      error: error as Error,
    };
  } finally {
    span?.finish();
    transaction?.finish();
  }
}; 