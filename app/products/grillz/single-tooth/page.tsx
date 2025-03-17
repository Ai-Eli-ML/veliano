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
  title: "Single Tooth Grillz | Veliano Jewelry",
  description: "Shop our collection of custom single tooth grillz. Perfect for a subtle statement.",
};

// Mock data for products
const products = [
  {
    id: "st1",
    name: "10K Gold Single Tooth",
    price: 199.99,
    rating: 4.9,
    image: "/images/products/grillz-single-10k.jpg",
    category: "Single Tooth"
  },
  {
    id: "st2",
    name: "14K Gold Single Tooth",
    price: 299.99,
    rating: 4.8,
    image: "/images/products/grillz-single-14k.jpg",
    category: "Single Tooth"
  },
  {
    id: "st3",
    name: "Diamond Single Tooth",
    price: 499.99,
    rating: 5.0,
    image: "/images/products/grillz-single-diamond.jpg",
    category: "Single Tooth"
  },
  {
    id: "st4",
    name: "Rose Gold Single Tooth",
    price: 249.99,
    rating: 4.7,
    image: "/images/products/grillz-single-rose.jpg",
    category: "Single Tooth"
  }
];

// Filter options
const materials = ["10K Gold", "14K Gold", "18K Gold", "Rose Gold", "White Gold", "Diamond"];
const styles = ["Plain", "Diamond-Cut", "Iced Out", "Two-Tone"];

export default function SingleToothGrillzPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Single Tooth Grillz</h1>
          <p className="text-muted-foreground">
            Make a subtle statement with our custom single tooth grillz. Choose from various materials and styles.
          </p>
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
                <Slider defaultValue={[0, 1000]} max={2000} step={50} />
                <div className="flex items-center justify-between">
                  <span>$0</span>
                  <span>$2,000+</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Styles</h3>
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
                <Link href={`/products/grillz/single-tooth/${product.id}`} key={product.id}>
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
                      <div className="font-medium">${product.price.toLocaleString()}</div>
                      <div className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle2 size={16} />
                        <span>In Stock</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button>Load More</Button>
        </div>
      </div>
    </div>
  );
} 