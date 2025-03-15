import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const steps = [
  {
    title: 'Order Your Impression Kit',
    description: 'We send you a professional dental impression kit with easy-to-follow instructions.',
    image: '/images/steps/step1.jpg',
  },
  {
    title: 'Make Your Impression',
    description: 'Follow our simple video guide to make your dental impression at home.',
    image: '/images/steps/step2.jpg',
  },
  {
    title: 'Send It Back',
    description: 'Use the pre-paid shipping label to send your impression back to our lab.',
    image: '/images/steps/step3.jpg',
  },
  {
    title: 'We Create Your Custom Grillz',
    description: 'Our expert craftsmen create your custom grillz using premium materials.',
    image: '/images/steps/step4.jpg',
  },
];

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get your custom grillz in 4 easy steps. Our process is simple, safe, and designed to give you the perfect fit.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="p-6">
            <div className="relative w-full h-48 mb-4">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover rounded-lg"
                priority={index === 0}
              />
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button size="lg" className="bg-primary text-white">
          Order Your Impression Kit Now
        </Button>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Add FAQ items here */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">How long does the process take?</h3>
            <p className="text-gray-600">
              The entire process typically takes 2-3 weeks from the time you receive your impression kit to receiving your custom grillz.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">Are your grillz real gold?</h3>
            <p className="text-gray-600">
              Yes, we use genuine precious metals including 10K, 14K, 18K gold, and .925 sterling silver for all our custom grillz.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">Is the impression process safe?</h3>
            <p className="text-gray-600">
              Absolutely! Our impression materials are dental grade and FDA approved. The process is completely safe and easy to do at home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 