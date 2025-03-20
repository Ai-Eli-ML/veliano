import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found - Veliano',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
      <Link 
        href="/" 
        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
} 