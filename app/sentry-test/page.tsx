'use client';

import * as Sentry from '@sentry/nextjs';

export default function SentryTest() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold mb-4">Sentry Test Page</h1>
        
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => {
            // Direct capture method
            Sentry.captureException(new Error("Manual Test Error: Direct Capture"));
          }}
        >
          Test Direct Capture
        </button>
        
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded ml-4"
          onClick={() => {
            // Message capture
            Sentry.captureMessage("Test Message: Manual Capture");
          }}
        >
          Test Message
        </button>
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4"
          onClick={async () => {
            await Sentry.startSpan(
              {
                name: "Test Transaction",
                op: "test.operation"
              },
              async () => {
                // Simulate some work
                await new Promise(resolve => setTimeout(resolve, 1000));
                throw new Error("Test Error: Within Transaction");
              }
            );
          }}
        >
          Test Transaction
        </button>
      </div>
    </div>
  );
} 