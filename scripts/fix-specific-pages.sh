#!/bin/bash

# Initialize log file
LOG_FILE="specific-pages-fixes-log.txt"
echo "Starting specific pages fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Fix FAQ Page
fix_faq_page() {
  local file="./app/faq/page.tsx"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper imports and structure
    cat > "$temp_file" << EOF
"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "You can create an account by clicking on the 'Sign Up' button in the top right corner of the homepage. Follow the instructions to complete your registration."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping times vary depending on your location. Domestic orders typically arrive within 3-5 business days, while international orders may take 7-14 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy. Items must be unused and in their original packaging. Please visit our Returns & Exchanges page for more details."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={\`item-\${index}\`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix How It Works Page
fix_how_it_works_page() {
  local file="./app/how-it-works/page.tsx"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper imports and structure
    cat > "$temp_file" << EOF
"use client"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const steps = [
  {
    title: "Browse Products",
    description: "Explore our wide selection of high-quality products designed for your needs.",
    icon: "🔍"
  },
  {
    title: "Add to Cart",
    description: "Select your desired items and add them to your shopping cart.",
    icon: "🛒"
  },
  {
    title: "Checkout",
    description: "Provide your shipping and payment information at checkout.",
    icon: "💳"
  },
  {
    title: "Fast Delivery",
    description: "Receive your order quickly with our efficient shipping partners.",
    icon: "🚚"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">How It Works</h1>
      <p className="text-center text-gray-600 mb-12">Follow these simple steps to get started with our service</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.map((step, index) => (
          <Card key={index} className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="text-sm text-gray-500 mt-4">Step {index + 1}</div>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Link href="/products">
          <Button size="lg">Start Shopping Now</Button>
        </Link>
      </div>
    </div>
  );
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Run the fixes
log_message "Starting specific page fixes..."
fix_faq_page
fix_how_it_works_page
log_message "Completed specific page fixes at $(date)" 