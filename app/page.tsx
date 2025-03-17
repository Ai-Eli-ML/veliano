"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Package, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock function to provide sample featured products
const getFeaturedProducts = () => {
  return [
    {
      id: "prod_1",
      name: "Diamond Eternity Ring",
      price: 3999.99,
      category: "Rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
      isFeatured: true,
      isNew: true,
      rating: 4.9,
      reviewCount: 42
    },
    {
      id: "prod_2",
      name: "Sapphire Tennis Bracelet",
      price: 2499.99,
      category: "Bracelets",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1588&auto=format&fit=crop",
      isFeatured: true,
      isNew: false,
      rating: 4.8,
      reviewCount: 36
    },
    {
      id: "prod_3",
      name: "Rose Gold Necklace",
      price: 1899.99,
      category: "Necklaces",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1587&auto=format&fit=crop",
      isFeatured: true,
      isNew: true,
      rating: 4.7,
      reviewCount: 58
    },
    {
      id: "prod_4",
      name: "Platinum Watch",
      price: 7999.99,
      category: "Watches",
      image: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?q=80&w=1587&auto=format&fit=crop",
      isFeatured: true,
      isNew: false,
      rating: 5.0,
      reviewCount: 23
    }
  ]
}

// Mock function to provide sample collections
const getCollections = () => {
  return [
    {
      id: "col_1",
      name: "Summer Elegance",
      description: "Light and vibrant pieces for the summer season.",
      image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1564&auto=format&fit=crop"
    },
    {
      id: "col_2",
      name: "Classic Diamond",
      description: "Timeless diamond pieces for every occasion.",
      image: "https://images.unsplash.com/photo-1585644156286-f4b0c0977454?q=80&w=1587&auto=format&fit=crop"
    },
    {
      id: "col_3",
      name: "Royal Sapphire",
      description: "Luxurious sapphire jewelry fit for royalty.",
      image: "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?q=80&w=1528&auto=format&fit=crop"
    }
  ]
}

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
  const collections = getCollections()
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative h-[80vh]">
        <Image
          src="https://images.unsplash.com/photo-1581394579918-1d91306f8b8a?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury jewelry showcase"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex items-center">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Timeless Elegance, Exceptional Craftsmanship
              </h1>
              <p className="text-xl text-white/90">
                Discover our exclusive collection of luxury jewelry and watches, 
                meticulously crafted for those who appreciate the extraordinary.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Collection
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link href="/about">
                    Our Story
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured categories */}
      <section className="py-16 bg-muted/40">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Rings', 'Necklaces', 'Bracelets', 'Watches'].map((category) => (
              <Link 
                key={category} 
                href={`/categories/${category.toLowerCase()}`}
                className="group"
              >
                <div className="rounded-lg overflow-hidden bg-muted aspect-square relative">
                  <Image
                    src={`https://source.unsplash.com/random/300x300/?jewelry,${category.toLowerCase()}`}
                    alt={category}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                    <h3 className="text-xl font-medium text-white">{category}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured products */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <AspectRatio ratio={1/1}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </AspectRatio>
                    {product.isNew && (
                      <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        ${product.price.toLocaleString()}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
                        <span>{product.rating}</span>
                        <span className="ml-1">({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Collections */}
      <section className="py-16 bg-muted/40">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Curated Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden">
                <div className="relative h-56">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
                  <p className="text-muted-foreground mb-4">{collection.description}</p>
                  <Button variant="outline" asChild>
                    <Link href={`/collections/${collection.id}`}>
                      Explore
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            What Our Customers Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Emily Watson",
                avatar: "https://randomuser.me/api/portraits/women/34.jpg",
                review: "The craftsmanship of my engagement ring is exceptional. I've received countless compliments on the design and quality."
              },
              {
                name: "James Anderson",
                avatar: "https://randomuser.me/api/portraits/men/54.jpg",
                review: "I purchased a watch for my 10th anniversary, and I couldn't be happier. The attention to detail and customer service were outstanding."
              },
              {
                name: "Sarah Miller",
                avatar: "https://randomuser.me/api/portraits/women/67.jpg",
                review: "Veliano's pieces are truly timeless. I've been collecting their jewelry for years, and each piece holds its beauty and value."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="relative pt-8">
                <div className="absolute -top-6 left-6">
                  <div className="rounded-full border-4 border-background w-12 h-12 overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <Separator className="mb-4" />
                  <p className="font-medium">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Package className="h-10 w-10 text-primary" />,
                title: "Free Shipping",
                description: "Free worldwide shipping on all orders over $500."
              },
              {
                icon: <ShieldCheck className="h-10 w-10 text-primary" />,
                title: "Lifetime Warranty",
                description: "All our pieces come with a lifetime warranty."
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "30-Day Returns",
                description: "Not satisfied? Return within 30 days for a full refund."
              },
              {
                icon: <Star className="h-10 w-10 text-primary" />,
                title: "Expert Craftsmanship",
                description: "Each piece is handcrafted by master jewelers."
              }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">Join Our Newsletter</h2>
            <p className="text-white/80">
              Subscribe to receive updates on new collections, exclusive offers, and jewelry care tips.
            </p>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
