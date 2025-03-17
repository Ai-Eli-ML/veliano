import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Design Grillz | Veliano Jewelry",
  description: "Create your own unique grillz design. Work with our expert craftsmen to bring your vision to life.",
};

// Mock data for products
const products = [
  {
    id: "cd1",
    name: "Custom Logo Design",
    price: 1499.99,
    rating: 4.9,
    image: "/images/products/grillz-custom-logo.jpg",
    category: "Custom Designs"
  },
  {
    id: "cd2",
    name: "Custom Pattern Design",
    price: 1299.99,
    rating: 4.8,
    image: "/images/products/grillz-custom-pattern.jpg",
    category: "Custom Designs"
  },
  {
    id: "cd3",
    name: "Custom Diamond Setting",
    price: 2499.99,
    rating: 5.0,
    image: "/images/products/grillz-custom-diamond.jpg",
    category: "Custom Designs"
  },
  {
    id: "cd4",
    name: "Custom Mixed Metal Design",
    price: 1899.99,
    rating: 4.7,
    image: "/images/products/grillz-custom-mixed.jpg",
    category: "Custom Designs"
  }
];

// Filter options
const materials = ["10K Gold", "14K Gold", "18K Gold", "Rose Gold", "White Gold", "Diamond"];
const styles = ["Logo", "Pattern", "Diamond Setting", "Mixed Metals", "Engraving", "Custom Shape"];

export default function CustomDesignsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Custom Design Grillz</h1>
          <p className="text-muted-foreground">
            Create a truly unique piece with our custom design service. Work directly with our expert craftsmen to bring your vision to life.
          </p>
        </div>
        
        {/* Custom Design Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">1. Design Consultation</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Schedule a consultation with our design team to discuss your ideas and requirements.
            </p>
            <Button className="w-full">Schedule Consultation</Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">2. Design Creation</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Our artists will create detailed renderings of your custom design for approval.
            </p>
            <Button variant="outline" className="w-full">View Design Process</Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">3. Expert Crafting</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Once approved, our master jewelers will carefully craft your unique piece.
            </p>
            <Button variant="outline" className="w-full">Meet Our Craftsmen</Button>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Materials</h3>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div key={material} className="flex items-center">
                    <Button 
                      variant="ghost"
                      className="justify-start w-full font-normal"
                    >
                      {material}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Price Range</h3>
              <div className="space-y-4">
                <Slider defaultValue={[0, 3000]} max={10000} step={500} />
                <div className="flex items-center justify-between">
                  <span>$0</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Design Styles</h3>
              <div className="space-y-2">
                {styles.map((style) => (
                  <div key={style} className="flex items-center">
                    <Button variant="ghost" className="justify-start w-full font-normal">
                      {style}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link href={`/products/grillz/custom/${product.id}`} key={product.id}>
                  <Card className="overflow-hidden rounded-lg border h-full transition-all hover:shadow-md">
                    <div className="relative aspect-square">
                      {/* Placeholder for actual product image */}
                      <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                        <span className="text-muted-foreground">Product Image</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-muted-foreground mr-1">
                          {product.rating}
                        </span>
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div className="font-medium">Starting at ${product.price.toLocaleString()}</div>
                      <div className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle2 size={16} />
                        <span>Custom Order</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Custom Design CTA */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Custom Design?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our expert designers are ready to help bring your vision to life. Schedule a consultation to get started on your unique piece.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Start Design Process</Button>
            <Button variant="outline" size="lg">View Design Gallery</Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 