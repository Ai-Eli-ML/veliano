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
  title: "Custom Grillz Collection | Veliano Jewelry",
  description: "Explore our premium custom grillz collection. From solid gold to iced-out diamond grillz, find your perfect style.",
};

// Mock data for products
const products = [
  {
    id: "1",
    name: "Diamond Top 6 Grillz",
    price: 2999.99,
    rating: 4.9,
    image: "/images/products/grillz-diamond-top-6.jpg",
    category: "Premium"
  },
  {
    id: "2",
    name: "Solid Gold Bottom 8 Grillz",
    price: 1799.99,
    rating: 4.8,
    image: "/images/products/grillz-gold-bottom-8.jpg",
    category: "Classic"
  },
  {
    id: "3",
    name: "Custom Two-Tone Grillz",
    price: 2499.99,
    rating: 4.7,
    image: "/images/products/grillz-two-tone.jpg",
    category: "Custom"
  },
  {
    id: "4",
    name: "Full Set Diamond Dust Grillz",
    price: 3999.99,
    rating: 5.0,
    image: "/images/products/grillz-full-set-diamond.jpg",
    category: "Premium"
  },
  {
    id: "5",
    name: "Rose Gold Open Face Grillz",
    price: 1599.99,
    rating: 4.6,
    image: "/images/products/grillz-rose-gold-open.jpg",
    category: "Classic"
  },
  {
    id: "6",
    name: "Custom Fangs Grillz",
    price: 1899.99,
    rating: 4.8,
    image: "/images/products/grillz-fangs.jpg",
    category: "Custom"
  },
];

// Mock data for categories
const categories = [
  "All",
  "Premium",
  "Classic",
  "Custom",
  "New Arrivals",
  "Best Sellers"
];

export default function GrillzPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Custom Grillz</h1>
          <p className="text-muted-foreground">
            Explore our handcrafted custom grillz collection, made with the finest materials and expert craftsmanship.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Button 
                      variant={category === "All" ? "default" : "ghost"}
                      className="justify-start w-full font-normal"
                    >
                      {category}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Price Range</h3>
              <div className="space-y-4">
                <Slider defaultValue={[0, 5000]} max={10000} step={100} />
                <div className="flex items-center justify-between">
                  <span>$0</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Materials</h3>
              <div className="space-y-2">
                {["10K Gold", "14K Gold", "18K Gold", "Platinum", "Silver", "Diamond"].map((material) => (
                  <div key={material} className="flex items-center">
                    <Button variant="ghost" className="justify-start w-full font-normal">
                      {material}
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
                <Link href={`/products/grillz/${product.id}`} key={product.id}>
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