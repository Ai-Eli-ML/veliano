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
  title: "Top Grillz | Veliano Jewelry",
  description: "Shop our collection of custom top grillz. Premium materials and expert craftsmanship.",
};

// Mock data for products
const products = [
  {
    id: "tg1",
    name: "6 Teeth Top Grillz - 10K Gold",
    price: 599.99,
    rating: 4.9,
    image: "/images/products/grillz-top-6-10k.jpg",
    category: "Top Grillz"
  },
  {
    id: "tg2",
    name: "8 Teeth Top Grillz - 14K Gold",
    price: 799.99,
    rating: 4.8,
    image: "/images/products/grillz-top-8-14k.jpg",
    category: "Top Grillz"
  },
  {
    id: "tg3",
    name: "Full Top Grillz - Diamond",
    price: 1499.99,
    rating: 5.0,
    image: "/images/products/grillz-top-full-diamond.jpg",
    category: "Top Grillz"
  },
  {
    id: "tg4",
    name: "Open Face Top Grillz",
    price: 699.99,
    rating: 4.7,
    image: "/images/products/grillz-top-open.jpg",
    category: "Top Grillz"
  }
];

// Filter options
const materials = ["10K Gold", "14K Gold", "18K Gold", "Rose Gold", "White Gold", "Diamond"];
const styles = ["6 Teeth", "8 Teeth", "Full Set", "Open Face", "Diamond-Cut", "Iced Out"];

export default function TopGrillzPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Top Grillz</h1>
          <p className="text-muted-foreground">
            Discover our premium collection of top grillz, featuring various styles and precious materials.
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
                <Slider defaultValue={[0, 2000]} max={5000} step={100} />
                <div className="flex items-center justify-between">
                  <span>$0</span>
                  <span>$5,000+</span>
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
                <Link href={`/products/grillz/top/${product.id}`} key={product.id}>
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