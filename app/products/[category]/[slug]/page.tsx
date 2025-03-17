import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function ProductPage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const { category, slug } = params
  
  // This would be a database or API call in a real app
  const product = {
    name: "Diamond Eternity Ring",
    price: 3999.99,
    description: "This stunning diamond eternity ring features 2 carats of brilliant-cut diamonds set in 18k white gold.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 42
  }
  
  return (
    <div className="container px-4 py-10 mx-auto">
      <div className="flex items-center space-x-2 text-sm mb-6">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/products" className="text-muted-foreground hover:text-foreground">
          Products
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link 
          href={`/products/${category}`} 
          className="text-muted-foreground hover:text-foreground capitalize"
        >
          {category}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative rounded-lg overflow-hidden bg-muted">
          <AspectRatio ratio={1/1}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </AspectRatio>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-3xl font-bold">
              ${product.price.toLocaleString()}
            </span>
          </div>
          
          <p className="text-muted-foreground">{product.description}</p>
          
          <Button size="lg" className="w-full">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
