
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReturnsExchanges() {
  const policies = [
    {
      title: 'Return Window',
      description: '30 days from the date of delivery for unused items in original packaging',
    },
    {
      title: 'Exchange Policy',
      description: 'Free exchanges within 30 days of delivery for different sizes or styles',
    },
    {
      title: 'Refund Method',
      description: 'Refunds will be issued to the original payment method within 5-7 business days',
    },
    {
      title: 'Custom Orders',
      description: 'Custom-made items are non-refundable unless defective',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Returns & Exchanges</h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {policies.map((policy, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{policy.title}</h3>
              <p className="text-gray-600">{policy.description}</p>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex gap-4">
                <span className="font-semibold">1.</span>
                <p>Log into your account and navigate to your order history</p>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold">2.</span>
                <p>Select the order containing the item(s) you wish to return</p>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold">3.</span>
                <p>Click "Start Return" and follow the instructions to generate your return label</p>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold">4.</span>
                <p>Package your item(s) securely in their original packaging</p>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold">5.</span>
                <p>Attach the return label and drop off at any authorized shipping location</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Return Conditions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Items must be unused and in original condition</li>
              <li>All original packaging and tags must be included</li>
              <li>Custom-made items cannot be returned unless defective</li>
              <li>Shipping costs for returns are the responsibility of the customer</li>
              <li>Items marked as "Final Sale" cannot be returned or exchanged</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-gray-600 mb-4">
              We offer free exchanges within 30 days of delivery. To initiate an exchange:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Follow the same process as returns</li>
              <li>Select "Exchange" instead of "Return" when processing</li>
              <li>Choose your preferred replacement item</li>
              <li>We'll ship your exchange item once we receive your return</li>
            </ul>
          </section>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              Our customer service team is here to assist you with any questions about returns or exchanges.
            </p>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
