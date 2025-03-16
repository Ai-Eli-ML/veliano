
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Warranty() {
  const coverageDetails = [
    {
      title: 'Manufacturing Defects',
      covered: true,
      description: 'Defects in materials or workmanship under normal use',
    },
    {
      title: 'Fitting Issues',
      covered: true,
      description: 'Problems with fit due to manufacturing error',
    },
    {
      title: 'Material Integrity',
      covered: true,
      description: 'Issues with metal purity or plating',
    },
    {
      title: 'Physical Damage',
      covered: false,
      description: 'Damage from drops, impacts, or misuse',
    },
    {
      title: 'Normal Wear',
      covered: false,
      description: 'Regular wear and tear from normal use',
    },
    {
      title: 'Lost or Stolen',
      covered: false,
      description: 'Items that are lost or stolen',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Warranty Information</h1>

      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Warranty</h2>
          <p className="text-gray-600 mb-6">
            We stand behind the quality of our products with a comprehensive 1-year limited warranty.
            All our custom grillz are covered against manufacturing defects to ensure your complete satisfaction.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {coverageDetails.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.covered ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.covered ? '✓' : '×'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Warranty Terms</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Our warranty covers manufacturing defects for a period of one (1) year from the date
              of purchase. This includes issues with fit, material integrity, and craftsmanship
              under normal use conditions.
            </p>
            <p>
              To maintain your warranty coverage, please follow our care instructions and avoid
              actions that could damage your grillz. The warranty does not cover damage caused
              by accidents, misuse, or normal wear and tear.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How to File a Warranty Claim</h2>
          <ol className="space-y-4 text-gray-600">
            <li className="flex gap-4">
              <span className="font-semibold">1.</span>
              <p>Contact our customer service team within the warranty period</p>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold">2.</span>
              <p>Provide your order number and detailed description of the issue</p>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold">3.</span>
              <p>Include clear photos of the defect or issue</p>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold">4.</span>
              <p>Our team will review your claim and respond within 2 business days</p>
            </li>
          </ol>
        </section>

        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Need to File a Claim?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is ready to assist you with your warranty claim.
          </p>
          <div className="space-x-4">
            <Button variant="default">File a Claim</Button>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
