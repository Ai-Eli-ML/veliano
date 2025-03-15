import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/products/product-card"

// Mock function to provide sample featured products
function getMockFeaturedProducts(limit = 4) {
  return [
    {
      id: "1",
      name: "10K Gold Single Tooth Grill",
      slug: "10k-gold-single-tooth-grill",
      price: 199.99,
      compare_at_price: 249.99,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      categories: [{ slug: "grillz" }]
    },
    {
      id: "2",
      name: "14K Gold 6 Teeth Bottom Grill",
      slug: "14k-gold-6-teeth-bottom-grill",
      price: 599.99,
      compare_at_price: 699.99,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      categories: [{ slug: "grillz" }]
    },
    {
      id: "3",
      name: "18K Gold Cuban Link Chain",
      slug: "18k-gold-cuban-link-chain",
      price: 1299.99,
      compare_at_price: 1499.99,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      categories: [{ slug: "jewelry" }]
    },
    {
      id: "4",
      name: "Diamond Pendant",
      slug: "diamond-pendant",
      price: 899.99,
      compare_at_price: 999.99,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      categories: [{ slug: "jewelry" }]
    }
  ];
}

// Define the product type
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  images: { url: string }[];
  categories: { slug: string }[];
}

export default async function HomePage() {
  const featuredProducts = getMockFeaturedProducts(4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image
          src="/hero-image.jpg"
          alt="Hero image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="gold-text mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Premium Custom Gold Grillz
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-white">
            Handcrafted luxury for your smile. Custom-fitted and made with the finest materials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="metallic-button">
              <Link href="/products/grillz">Shop Grillz</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-black/50 text-white hover:bg-black/70">
              <Link href="/products/jewelry">Shop Jewelry</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Featured Products</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts && featuredProducts.length > 0
              ? featuredProducts.map((product) => {
                  // Get the primary category for the product URL
                  const primaryCategory = product.categories && product.categories.length > 0 ? product.categories[0] : null
                  const productUrl = primaryCategory
                    ? `/products/${primaryCategory.slug}/${product.slug}`
                    : `/products/uncategorized/${product.slug}`

                  // Get the primary image
                  const primaryImage =
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : "/placeholder.svg?height=400&width=400"

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      compareAtPrice={product.compare_at_price}
                      imageSrc={primaryImage}
                      category={primaryCategory?.slug || "uncategorized"}
                      url={productUrl}
                    />
                  )
                })
              : [1, 2, 3, 4].map((item) => (
                  <div key={item} className="product-card group rounded-lg border p-4 transition-all">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-md">
                      <Image
                        src={`/placeholder.svg?height=400&width=400`}
                        alt={`Featured product ${item}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Premium Gold Grill</h3>
                    <p className="mb-2 text-sm text-muted-foreground">Custom 10K Gold 6 Teeth Set</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">$599.99</span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild className="metallic-button">
              <Link href="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-black py-16 text-white">
        <div className="container">
          <h2 className="gold-text mb-12 text-center text-3xl font-bold">Why Choose Us</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/20 p-4">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Premium Quality</h3>
              <p className="text-gray-300">
                We use only the finest materials, including 10K, 14K, and 18K gold, ensuring durability and a luxurious
                finish.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/20 p-4">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-4-9h8v2H8v-2zm0-4h8v2H8V9zm2-4h4v2h-4V5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Custom Fitted</h3>
              <p className="text-gray-300">
                Each piece is custom-made to fit your teeth perfectly, ensuring comfort and a natural look.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/20 p-4">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-5-7h10v2H7v-2zm0-3h10v2H7v-2zm0-3h10v2H7V7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Satisfaction Guaranteed</h3>
              <p className="text-gray-300">
                We stand behind our products with a satisfaction guarantee and excellent customer service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

