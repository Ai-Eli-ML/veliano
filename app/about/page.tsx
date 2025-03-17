import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Veliano Jewelry",
  description: "Learn about Veliano Jewelry, our story, mission, and commitment to crafting high-quality custom grillz and jewelry.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Veliano Jewelry</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Crafting premium custom grillz and jewelry since 2015. 
            Our passion for excellence drives everything we do.
          </p>
        </section>

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              Veliano Jewelry was founded in 2015 by master jeweler Alex Veliano, who recognized 
              the need for high-quality, custom grillz that combined artistry with precision. 
              What began as a small operation has grown into a respected brand known for its 
              craftsmanship, attention to detail, and commitment to customer satisfaction.
            </p>
            <p className="text-muted-foreground">
              Today, we serve clients worldwide, from celebrities to everyday individuals who 
              appreciate fine jewelry. Our team of skilled artisans combines traditional 
              techniques with modern technology to create pieces that are both beautiful and durable.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <Image 
              src="/images/workshop.jpg" 
              alt="Veliano Jewelry workshop" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Our Values */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We use only the finest materials and maintain rigorous quality control 
                  standards to ensure that every piece meets our exacting specifications.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Craftsmanship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our team combines years of experience with continuous education to 
                  stay at the forefront of jewelry design and manufacturing techniques.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We believe in building lasting relationships with our clients through 
                  transparent communication, reliability, and a commitment to satisfaction.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Process */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">1</span>
                  Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We begin with a detailed consultation to understand your vision, preferences, and requirements.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">2</span>
                  Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our designers create a custom design based on your input, providing visualizations for your approval.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">3</span>
                  Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our skilled artisans craft your piece with meticulous attention to detail, using premium materials.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">4</span>
                  Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your finished piece undergoes quality inspection before being carefully packaged and delivered to you.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden">
                <Image 
                  src="/images/team-alex.jpg" 
                  alt="Alex Veliano" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Alex Veliano</h3>
              <p className="text-muted-foreground">Founder & Master Jeweler</p>
            </div>
            <div className="text-center space-y-3">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden">
                <Image 
                  src="/images/team-sofia.jpg" 
                  alt="Sofia Chen" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sofia Chen</h3>
              <p className="text-muted-foreground">Lead Designer</p>
            </div>
            <div className="text-center space-y-3">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden">
                <Image 
                  src="/images/team-marcus.jpg" 
                  alt="Marcus Johnson" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Marcus Johnson</h3>
              <p className="text-muted-foreground">Customer Experience Director</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 bg-muted p-8 rounded-lg">
          <h2 className="text-3xl font-bold">Ready to Create Your Custom Piece?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let us help you bring your vision to life with our expert craftsmanship and personalized service.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/products" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Explore Products
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
} 