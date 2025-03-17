"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !message) {
      toast.error("Please fill out all required fields")
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Message sent successfully", {
      description: "We'll get back to you as soon as possible."
    })
    
    // Reset form
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setIsSubmitting(false)
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We'd love to hear from you. Our team is always here to help.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle>Call Us</CardTitle>
            <CardDescription>
              Speak directly with our customer service team
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium">+1 (800) 123-4567</p>
            <p className="text-sm text-muted-foreground">Monday-Friday, 9am-6pm EST</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle>Email Us</CardTitle>
            <CardDescription>
              Get in touch via email for any inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium">support@veliano.com</p>
            <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <MapPin className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle>Visit Us</CardTitle>
            <CardDescription>
              Visit our flagship store and showroom
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium">123 Luxury Lane, New York, NY 10001</p>
            <p className="text-sm text-muted-foreground">Monday-Saturday, 10am-7pm</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have a question about a product, an order, or just want to chat? Fill out the form and we'll get back to you as soon as possible.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-sm text-muted-foreground">Monday-Friday: 9am-6pm EST</p>
                <p className="text-sm text-muted-foreground">Saturday: 10am-4pm EST</p>
                <p className="text-sm text-muted-foreground">Sunday: Closed</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Store Locations</h3>
                <p className="text-sm text-muted-foreground">New York: 123 Luxury Lane, NY 10001</p>
                <p className="text-sm text-muted-foreground">Los Angeles: 456 Fashion Blvd, LA 90001</p>
                <p className="text-sm text-muted-foreground">Miami: 789 Gold Coast Drive, FL 33101</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact">Contact Form</TabsTrigger>
              <TabsTrigger value="support">Support Request</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Your name" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="your.email@example.com" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        placeholder="What is this regarding?" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                      <Textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="How can we help you?" 
                        rows={5} 
                        required 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="support" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request Support</CardTitle>
                  <CardDescription>
                    Need help with an order or product? Let us know and we'll assist you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="support-name">Name <span className="text-destructive">*</span></Label>
                      <Input id="support-name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Email <span className="text-destructive">*</span></Label>
                      <Input id="support-email" type="email" placeholder="your.email@example.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="order-number">Order Number (if applicable)</Label>
                    <Input id="order-number" placeholder="e.g. ORD-123456" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issue-type">Type of Issue <span className="text-destructive">*</span></Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order-status">Order Status</SelectItem>
                        <SelectItem value="returns">Returns or Exchanges</SelectItem>
                        <SelectItem value="product">Product Information</SelectItem>
                        <SelectItem value="damaged">Damaged Item</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-message">Details <span className="text-destructive">*</span></Label>
                    <Textarea id="support-message" placeholder="Please describe your issue in detail" rows={5} required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Support Request
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215455392574!2d-73.9858770842636!3d40.75051684332894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30eac9f%3A0x618bf9c9dbe19e97!2sFifth%20Avenue%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1648138675764!5m2!1sen!2sus" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Store location"
        />
      </div>
    </div>
  )
}
