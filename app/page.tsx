import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Veliano - Custom Grillz & Jewelry',
  description: 'Premium custom grillz and jewelry crafted with excellence.',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Custom Grillz & Jewelry
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Crafted with excellence, designed for you
          </p>
          <Link
            href="/products"
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Design</h2>
          <p className="text-gray-600">
            Work with our expert designers to create your perfect piece
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Premium Quality</h2>
          <p className="text-gray-600">
            Only the finest materials and craftsmanship
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Satisfaction Guaranteed</h2>
          <p className="text-gray-600">
            Your satisfaction is our top priority
          </p>
        </div>
      </section>
    </div>
  );
}
