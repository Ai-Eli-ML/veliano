import { createServerSupabaseClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import type { Database } from "@/types/supabase"

type Category = Database["public"]["Tables"]["categories"]["Insert"]
type Product = Database["public"]["Tables"]["products"]["Insert"]
type ProductImage = Omit<Database["public"]["Tables"]["product_images"]["Insert"], "product_id">
type ProductVariant = Omit<Database["public"]["Tables"]["product_variants"]["Insert"], "product_id">
type ProductCategory = Database["public"]["Tables"]["product_categories"]["Insert"]

export const categories: Category[] = [
  {
    id: "cat1",
    name: "All Grillz",
    slug: "all-grillz",
    description: "Custom gold grillz and teeth accessories"
  },
  {
    id: "cat2",
    name: "All Jewelry",
    slug: "all-jewelry",
    description: "Premium gold jewelry collection"
  },
  {
    id: "cat3",
    name: "Custom Grillz",
    slug: "custom-grillz",
    description: "Personalized custom grillz"
  },
  {
    id: "cat4",
    name: "Pre-Made Grillz",
    slug: "pre-made-grillz",
    description: "Ready-to-wear grillz"
  },
  {
    id: "cat5",
    name: "Chains",
    slug: "chains",
    description: "Gold chains and necklaces"
  },
  {
    id: "cat6",
    name: "Bracelets",
    slug: "bracelets",
    description: "Gold bracelets and bangles"
  },
  {
    id: "cat7",
    name: "Rings",
    slug: "rings",
    description: "Gold rings and bands"
  },
  {
    id: "cat8",
    name: "Pendants",
    slug: "pendants",
    description: "Gold pendants and charms"
  }
]

type ProductData = {
  product: Product
  images: ProductImage[]
  variants: ProductVariant[]
  categories: string[]
}

export const products: ProductData[] = [
  {
    product: {
      name: "Custom 10K Gold Grillz",
      slug: "custom-10k-gold-grillz",
      description: "Custom-made 10K gold grillz, perfect fit guaranteed. Includes dental impression kit and fitting instructions.",
      price: 199.99,
      compare_at_price: 249.99,
      sku: "GRILLZ-10K-CUSTOM",
      inventory_quantity: 100,
      is_published: true,
      featured: true,
      has_variants: true
    },
    images: [
      {
        url: "/images/products/custom-10k-gold-grillz.jpg",
        alt_text: "Custom 10K Gold Grillz",
        position: 0
      }
    ],
    variants: [
      {
        name: "Top 6 Teeth",
        sku: "GRILLZ-10K-TOP6",
        price: 199.99,
        inventory_quantity: 50,
        option1_name: "Style",
        option1_value: "Top 6",
        option2_name: "Material",
        option2_value: "10K Gold"
      },
      {
        name: "Bottom 6 Teeth",
        sku: "GRILLZ-10K-BOT6",
        price: 199.99,
        inventory_quantity: 50,
        option1_name: "Style",
        option1_value: "Bottom 6",
        option2_name: "Material",
        option2_value: "10K Gold"
      }
    ],
    categories: ["cat1", "cat3"]
  },
  {
    product: {
      name: "Premium 14K Gold Cuban Chain",
      slug: "premium-14k-gold-cuban-chain",
      description: "Solid 14K gold Cuban link chain, perfect for any occasion. Available in multiple lengths.",
      price: 999.99,
      compare_at_price: 1299.99,
      sku: "CHAIN-14K-CUBAN",
      inventory_quantity: 25,
      is_published: true,
      featured: true,
      has_variants: true
    },
    images: [
      {
        url: "/images/products/14k-gold-cuban-chain.jpg",
        alt_text: "14K Gold Cuban Chain",
        position: 0
      }
    ],
    variants: [
      {
        name: "20 inch",
        sku: "CHAIN-14K-20",
        price: 999.99,
        inventory_quantity: 10,
        option1_name: "Length",
        option1_value: "20 inch",
        option2_name: "Material",
        option2_value: "14K Gold"
      },
      {
        name: "24 inch",
        sku: "CHAIN-14K-24",
        price: 1199.99,
        inventory_quantity: 15,
        option1_name: "Length",
        option1_value: "24 inch",
        option2_name: "Material",
        option2_value: "14K Gold"
      }
    ],
    categories: ["cat2", "cat5"]
  },
  {
    product: {
      name: "Diamond Cut Rope Chain 10K",
      slug: "diamond-cut-rope-chain-10k",
      description: "10K gold diamond cut rope chain with high polish finish. Stunning brilliance and durability.",
      price: 599.99,
      compare_at_price: 799.99,
      sku: "CHAIN-10K-ROPE",
      inventory_quantity: 30,
      is_published: true,
      featured: false,
      has_variants: true
    },
    images: [
      {
        url: "/images/products/10k-rope-chain.jpg",
        alt_text: "10K Gold Rope Chain",
        position: 0
      }
    ],
    variants: [
      {
        name: "22 inch",
        sku: "CHAIN-10K-ROPE-22",
        price: 599.99,
        inventory_quantity: 15,
        option1_name: "Length",
        option1_value: "22 inch",
        option2_name: "Material",
        option2_value: "10K Gold"
      },
      {
        name: "26 inch",
        sku: "CHAIN-10K-ROPE-26",
        price: 699.99,
        inventory_quantity: 15,
        option1_name: "Length",
        option1_value: "26 inch",
        option2_name: "Material",
        option2_value: "10K Gold"
      }
    ],
    categories: ["cat2", "cat5"]
  }
]

export async function seedDatabase() {
  const supabase = supabaseAdmin

  try {
    // Insert categories
    const { error: categoriesError } = await supabase
      .from("categories")
      .upsert(categories)

    if (categoriesError) {
      throw new Error(`Error seeding categories: ${categoriesError.message}`)
    }

    // Insert products
    for (const productData of products) {
      // Insert base product
      const { data: product, error: productError } = await supabase
        .from("products")
        .upsert(productData.product)
        .select()
        .single()

      if (productError) {
        throw new Error(`Error seeding product ${productData.product.name}: ${productError.message}`)
      }

      // Insert product images
      const { error: imagesError } = await supabase
        .from("product_images")
        .upsert(
          productData.images.map(image => ({
            ...image,
            product_id: product.id
          }))
        )

      if (imagesError) {
        throw new Error(`Error seeding images for ${productData.product.name}: ${imagesError.message}`)
      }

      // Insert product variants
      const { error: variantsError } = await supabase
        .from("product_variants")
        .upsert(
          productData.variants.map(variant => ({
            ...variant,
            product_id: product.id
          }))
        )

      if (variantsError) {
        throw new Error(`Error seeding variants for ${productData.product.name}: ${variantsError.message}`)
      }

      // Insert product categories
      const { error: categoriesError } = await supabase
        .from("product_categories")
        .upsert(
          productData.categories.map(categoryId => ({
            product_id: product.id,
            category_id: categoryId
          }))
        )

      if (categoriesError) {
        throw new Error(`Error seeding categories for ${productData.product.name}: ${categoriesError.message}`)
      }
    }

    console.log("Database seeded successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
} 