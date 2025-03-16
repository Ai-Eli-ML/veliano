"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What materials are your grillz made from?",
    answer: "Our grillz are crafted from genuine precious metals including 10K, 14K, 18K gold, and .925 sterling silver. We use only high-quality materials to ensure durability and satisfaction."
  },
  {
    question: "How long does the entire process take?",
    answer: "The entire process typically takes 2-3 weeks from the time you receive your impression kit. This includes shipping time for the kit, making your impression, sending it back, and crafting your custom grillz."
  },
  {
    question: "Is the impression process safe?",
    answer: "Yes, absolutely! Our impression materials are dental grade and FDA approved. The process is completely safe and easy to do at home with our detailed instructions and video guide."
  },
  {
    question: "How do I know my size?",
    answer: "We provide a professional dental impression kit that allows us to create a perfect fit for your teeth. You don't need to know your size beforehand - the impression kit will capture the exact measurements we need."
  },
  {
    question: "Do you offer warranties?",
    answer: "Yes, we offer a 1-year warranty against manufacturing defects. This covers issues related to craftsmanship but does not cover damage from misuse or normal wear and tear."
  },
  {
    question: "Can I eat with my grillz?",
    answer: "While you can eat with your grillz, we recommend removing them during meals to maintain their appearance and extend their lifespan. Always clean them thoroughly after use."
  },
  {
    question: "How do I clean and maintain my grillz?",
    answer: "Clean your grillz daily with mild soap and warm water. Avoid using harsh chemicals or abrasive materials. Store them in the provided case when not in use to prevent damage."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please check our shipping page for specific details about your country."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and various buy-now-pay-later options like Affirm and Klarna."
  },
  {
    question: "Can I return or exchange my grillz?",
    answer: "Since each piece is custom-made for your teeth, we cannot accept returns or exchanges unless there is a manufacturing defect. Please refer to our warranty policy for more details."
  }
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-600 text-center mb-8">
          Find answers to our most commonly asked questions. If you can't find what you're looking for,
          please don't hesitate to contact our customer support team.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="text-primary hover:text-primary/90 font-semibold"
          >
            Contact Our Support Team →
          </a>
        </div>
      </div>
    </div>
  );
} 
