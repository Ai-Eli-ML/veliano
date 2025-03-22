import * as Sentry from '@sentry/nextjs';

async function throwServerError() {
  throw new Error('Test server component error');
}

export default async function ServerErrorTest() {
  try {
    await throwServerError();
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e; // Re-throw to test error boundary
    }
  }

  return (
    <div className="p-4 mt-8 border rounded">
      <h2 className="text-xl font-bold">Server Component Error Test</h2>
      <p>This component should throw an error...</p>
    </div>
  );
} 