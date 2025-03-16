"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const contactMethods = [
    {
      title: 'Customer Support',
      email: 'support@veliano.com',
      phone: '(555) 123-4567',
      hours: 'Mon-Fri: 9AM-6PM EST',
    },
    {
      title: 'Sales Inquiries',
      email: 'sales@veliano.com',
      phone: '(555) 234-5678',
      hours: 'Mon-Fri: 9AM-5PM EST',
    },
    {
      title: 'Wholesale',
      email: 'wholesale@veliano.com',
      phone: '(555) 345-6789',
      hours: 'Mon-Fri: 10AM-4PM EST',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="grid gap-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{method.title}</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Email: {method.email}</p>
                      <p>Phone: {method.phone}</p>
                      <p>Hours: {method.hours}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Visit Us</h3>
              <div className="space-y-2 text-gray-600">
                <p>123 Main Street</p>
                <p>Suite 100</p>
                <p>City, State 12345</p>
                <p>United States</p>
              </div>
            </Card>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Response</h3>
              <p className="text-gray-600 mb-4">
                We typically respond to all inquiries within 24 hours during business days.
                For immediate assistance, please call our customer support line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
