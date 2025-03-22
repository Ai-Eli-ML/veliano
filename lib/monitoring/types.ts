import type { Span, SpanStatus } from '@sentry/types';
import type { Metric } from 'web-vitals';

export interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
}

export interface SpanContext {
  op: string;
  name: string;
  data?: Record<string, unknown>;
}

export interface TransactionContext extends SpanContext {
  trimEnd?: boolean;
  sampled?: boolean;
}

export interface MonitoringOptions {
  shouldMonitorWebVitals?: boolean;
  shouldMonitorAPI?: boolean;
  shouldMonitorDatabase?: boolean;
}

export interface WebVitalMetric extends Metric {
  threshold: number;
  status: 'good' | 'needs-improvement' | 'poor';
}

export interface PerformanceSpan extends Omit<Span, 'setStatus'> {
  setStatus(status: SpanStatus): this;
  setTag(key: string, value: string): this;
  setData(key: string, value: unknown): this;
}

export type SpanOperation = 'http' | 'db' | 'cache' | 'render' | 'resource' | 'navigation';

export interface ErrorWithContext extends Error {
  context?: Record<string, unknown>;
  severity?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  tags?: Record<string, string>;
}

export interface MonitoringResult<T> {
  data: T;
  duration: number;
  success: boolean;
  error?: ErrorWithContext;
} 