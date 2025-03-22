import { ErrorBoundary } from 'react-error-boundary';
import ErrorTest from './error-test';
import ServerErrorTest from './server-error-test';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Error Tracking Test Page</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">Client-side Error Test</h2>
          <ErrorBoundary
            fallback={<div className="text-red-500 p-4 border rounded">Client Error: Something went wrong</div>}
            onError={(error) => {
              console.error('Client error caught by boundary:', error);
            }}
          >
            <ErrorTest />
          </ErrorBoundary>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Server-side Error Test</h2>
          <ErrorBoundary
            fallback={<div className="text-red-500 p-4 border rounded">Server Error: Something went wrong</div>}
            onError={(error) => {
              console.error('Server error caught by boundary:', error);
            }}
          >
            <ServerErrorTest />
          </ErrorBoundary>
        </section>
      </div>
    </div>
  );
} 