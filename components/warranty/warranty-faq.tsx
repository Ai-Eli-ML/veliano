"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function WarrantyFAQClient() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Do I need to register my product for warranty coverage?</AccordionTrigger>
          <AccordionContent>
            No, your warranty is automatically activated upon purchase. However, we recommend registering your product for easier warranty claims and to receive care tips specific to your item.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What documentation do I need for a warranty claim?</AccordionTrigger>
          <AccordionContent>
            You'll need your order number or proof of purchase. If you purchased from an authorized retailer, the original receipt is required. Photos of the issue will also be requested during the claim process.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How long does the warranty claim process take?</AccordionTrigger>
          <AccordionContent>
            Most warranty claims are processed within 5-7 business days after we receive the item. Repairs typically take 1-2 weeks, depending on the nature of the issue. We'll keep you updated throughout the process.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is shipping covered for warranty repairs?</AccordionTrigger>
          <AccordionContent>
            We cover the return shipping costs for approved warranty repairs. However, the customer is responsible for shipping the item to our service center. For premium collection items, we cover shipping both ways.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 