import { createServerSupabaseClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from 'uuid'

export async function seedDatabase() {
  const supabase = await createServerSupabaseClient()
  
  // Seed categories first
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .insert([
      {
        id: uuidv4(),
        name: 'Grillz',
        slug: 'grillz',
        description: 'Custom fitted grillz'
      },
      {
        id: uuidv4(),
        name: 'Chains',
        slug: 'chains',
        description: 'Premium chains'
      }
    ])
    .select()

  if (categoriesError) {
    console.error('Error seeding categories:', categoriesError)
    return
  }

  // Get category IDs for reference
  const grillzCategory = categories?.[0]?.id
  const chainsCategory = categories?.[1]?.id

  // Seed products
  const { error: productsError } = await supabase
    .from('products')
    .insert([
      {
        id: uuidv4(),
        name: 'Custom Gold Grillz',
        slug: 'custom-gold-grillz',
        description: 'Handcrafted custom gold grillz',
        price: 999.99,
        category_id: grillzCategory,
        stock_quantity: 10,
        in_stock: true,
        featured: true
      },
      {
        id: uuidv4(),
        name: 'Diamond Chain',
        slug: 'diamond-chain',
        description: 'Premium diamond chain',
        price: 1499.99,
        category_id: chainsCategory,
        stock_quantity: 5,
        in_stock: true,
        featured: true
      }
    ])

  if (productsError) {
    console.error('Error seeding products:', productsError)
    return
  }

  console.log('Database seeded successfully')
} 