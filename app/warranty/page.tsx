import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WarrantyFAQClient from '@/components/warranty/warranty-faq';

export default function WarrantyPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Warranty Information</h1>
          <p className="text-muted-foreground">
            Our commitment to quality and customer satisfaction
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Limited Warranty</CardTitle>
            <CardDescription>
              All Veliano products come with a limited warranty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Coverage Period</h3>
              <p className="text-sm text-muted-foreground">
                All Veliano jewelry pieces are covered by a 1-year limited warranty from the date of purchase. 
                Our premium collections come with an extended 2-year warranty.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">What's Covered</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Manufacturing defects in materials and workmanship</li>
                <li>Structural integrity issues</li>
                <li>Stone setting problems (loose stones)</li>
                <li>Clasp and closure malfunctions</li>
                <li>Plating issues (for gold-plated items)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">What's Not Covered</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Normal wear and tear</li>
                <li>Accidental damage or misuse</li>
                <li>Scratches, dents, or other cosmetic damage that doesn't affect functionality</li>
                <li>Damage caused by improper care or storage</li>
                <li>Theft or loss</li>
                <li>Unauthorized repairs or modifications</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">How to Make a Claim</h3>
              <p className="text-sm text-muted-foreground">
                To initiate a warranty claim, please contact our customer service team at warranty@veliano.com with your order number, 
                a description of the issue, and photos of the affected item. Our team will guide you through the next steps.
              </p>
            </div>
          </CardContent>
        </Card>

        <WarrantyFAQClient />

        <div className="flex justify-center">
          <Button variant="outline" className="mr-4">Contact Support</Button>
          <Button>Register Your Product</Button>
        </div>
      </div>
    </div>
  )
}






