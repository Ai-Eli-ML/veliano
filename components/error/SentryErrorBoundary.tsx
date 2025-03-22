import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import * as Sentry from '@sentry/nextjs';

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
}

const DefaultFallback = ({ resetErrorBoundary }: FallbackProps) => (
  <div className="p-4 rounded-md bg-red-50 border border-red-200">
    <p className="text-red-700 mb-2">Something went wrong</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

export function SentryErrorBoundary({ children, fallback: Fallback = DefaultFallback }: SentryErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={(error, info) => {
        Sentry.withScope((scope) => {
          scope.setExtra('componentStack', info.componentStack);
          Sentry.captureException(error);
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 