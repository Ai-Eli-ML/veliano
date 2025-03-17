import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ReturnsExchangesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Returns & Exchanges</h1>
          <p className="text-muted-foreground">
            Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can't offer you a refund or exchange.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Return Policy Overview</CardTitle>
            <CardDescription>
              Please read our policy carefully before making a purchase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Eligibility for Returns</h3>
              <p className="text-sm text-muted-foreground">
                To be eligible for a return, your item must be unused and in the same condition that you received it. 
                It must also be in the original packaging.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Non-Returnable Items</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Custom or personalized orders</li>
                <li>Downloadable products</li>
                <li>Gift cards</li>
                <li>Items on sale or clearance</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Return Process</h3>
              <p className="text-sm text-muted-foreground">
                To start a return, please email us at returns@veliano.com. 
                Please include your order number and the reason for your return.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Refunds</h3>
              <p className="text-sm text-muted-foreground">
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. 
                We will also notify you of the approval or rejection of your refund.
              </p>
              <p className="text-sm text-muted-foreground">
                If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 7-14 business days.
              </p>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I request a return?</AccordionTrigger>
            <AccordionContent>
              To request a return, please email our customer service team at returns@veliano.com with your order number and reason for return. We'll provide you with a return authorization and shipping instructions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is your exchange policy?</AccordionTrigger>
            <AccordionContent>
              We're happy to exchange items within 30 days of purchase. The item must be in its original condition and packaging. Please contact our customer service team to initiate an exchange.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do I have to pay for return shipping?</AccordionTrigger>
            <AccordionContent>
              Yes, customers are responsible for return shipping costs unless the return is due to our error (such as sending the wrong item or a defective product).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How long does the refund process take?</AccordionTrigger>
            <AccordionContent>
              Once we receive your return, we'll inspect the item and process your refund within 3-5 business days. It may take an additional 7-14 days for the refund to appear on your account, depending on your payment method and financial institution.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-center">
          <Button variant="outline" className="mr-4">Contact Support</Button>
          <Button>Shop Now</Button>
        </div>
      </div>
    </div>
  )
}






