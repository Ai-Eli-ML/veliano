"use client"

import { Card } from '@/components/ui/card';

export default function ShippingDelivery() {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      time: '5-7 business days',
      cost: 'Free on orders over $100',
      details: 'Available for all orders within the United States',
    },
    {
      name: 'Express Shipping',
      time: '2-3 business days',
      cost: '$15.00',
      details: 'Available for all orders within the United States',
    },
    {
      name: 'Next Day Delivery',
      time: 'Next business day',
      cost: '$25.00',
      details: 'Order by 2 PM EST for next-day delivery (excluding weekends and holidays)',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Shipping & Delivery</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
          <div className="grid gap-6">
            {shippingMethods.map((method, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{method.name}</h3>
                    <p className="text-gray-600 mb-1">Delivery Time: {method.time}</p>
                    <p className="text-gray-600 mb-1">Cost: {method.cost}</p>
                    <p className="text-gray-600">{method.details}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
            <p className="text-gray-600">
              All orders are processed within 1-2 business days. Orders placed after 2 PM EST 
              will be processed the next business day. You will receive a confirmation email 
              with your tracking number once your order ships.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <p className="text-gray-600">
              We currently ship to select international destinations. International shipping rates 
              and delivery times vary by location. Please contact our customer service team for 
              specific international shipping inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
            <p className="text-gray-600">
              Once your order ships, you will receive a confirmation email with your tracking 
              number. You can track your order status at any time by clicking the tracking 
              link in your email or logging into your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
            <p className="text-gray-600">
              Some items may have shipping restrictions to certain locations. We reserve the 
              right to cancel any order that cannot be shipped to the specified address.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 
