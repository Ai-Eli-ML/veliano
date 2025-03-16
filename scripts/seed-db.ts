import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate UUIDs for our entities
const CATEGORY_IDS = {
  GRILLZ: '550e8400-e29b-41d4-a716-446655440000',
  JEWELRY: '550e8400-e29b-41d4-a716-446655440001',
  SINGLE_TOOTH: '550e8400-e29b-41d4-a716-446655440002',
  BOTTOM_GRILLZ: '550e8400-e29b-41d4-a716-446655440003',
  CHAINS: '550e8400-e29b-41d4-a716-446655440004',
  PENDANTS: '550e8400-e29b-41d4-a716-446655440005'
}

const PRODUCT_IDS = {
  SINGLE_TOOTH_GRILL: '550e8400-e29b-41d4-a716-446655440006',
  BOTTOM_GRILL: '550e8400-e29b-41d4-a716-446655440007',
  CUBAN_CHAIN: '550e8400-e29b-41d4-a716-446655440008',
  DIAMOND_PENDANT: '550e8400-e29b-41d4-a716-446655440009'
}

async function seedDatabase() {
  try {
    console.log('Starting database seed...')

    // Delete existing data
    console.log('Deleting existing data...')
    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .not('id', 'is', null)

    if (deleteProductsError) {
      throw deleteProductsError
    }

    const { error: deleteCategoriesError } = await supabase
      .from('categories')
      .delete()
      .not('id', 'is', null)

    if (deleteCategoriesError) {
      throw deleteCategoriesError
    }

    // Insert categories
    console.log('Inserting categories...')
    const { error: categoriesError } = await supabase
      .from('categories')
      .insert([
        {
          id: CATEGORY_IDS.GRILLZ,
          name: 'Grillz',
          slug: 'grillz',
          description: 'Custom gold grillz for your teeth'
        },
        {
          id: CATEGORY_IDS.JEWELRY,
          name: 'Jewelry',
          slug: 'jewelry',
          description: 'Premium gold jewelry collection'
        },
        {
          id: CATEGORY_IDS.SINGLE_TOOTH,
          name: 'Single Tooth',
          slug: 'single-tooth',
          description: 'Single tooth grillz'
        },
        {
          id: CATEGORY_IDS.BOTTOM_GRILLZ,
          name: 'Bottom Grillz',
          slug: 'bottom',
          description: 'Bottom row grillz'
        },
        {
          id: CATEGORY_IDS.CHAINS,
          name: 'Chains',
          slug: 'chains',
          description: 'Gold chains'
        },
        {
          id: CATEGORY_IDS.PENDANTS,
          name: 'Pendants',
          slug: 'pendants',
          description: 'Gold pendants'
        }
      ])

    if (categoriesError) {
      throw categoriesError
    }

    // Insert products
    console.log('Inserting products...')
    const { error: productsError } = await supabase
      .from('products')
      .insert([
        {
          id: PRODUCT_IDS.SINGLE_TOOTH_GRILL,
          name: '10K Gold Single Tooth Grill',
          slug: '10k-gold-single-tooth-grill',
          description: 'Premium 10K gold single tooth grill, custom fitted for comfort and style.',
          price: 199.99,
          sku: 'GRILL-10K-SINGLE',
          inventory_quantity: 15,
          is_published: true,
          featured: true
        },
        {
          id: PRODUCT_IDS.BOTTOM_GRILL,
          name: '14K Gold 6 Teeth Bottom Grill',
          slug: '14k-gold-6-teeth-bottom-grill',
          description: 'Luxurious 14K gold bottom grill covering 6 teeth, custom made to your specifications.',
          price: 599.99,
          sku: 'GRILL-14K-BOTTOM-6',
          inventory_quantity: 8,
          is_published: true,
          featured: true
        },
        {
          id: PRODUCT_IDS.CUBAN_CHAIN,
          name: '18K Gold Cuban Link Chain',
          slug: '18k-gold-cuban-link-chain',
          description: 'Premium 18K gold Cuban link chain, perfect for any occasion.',
          price: 1299.99,
          sku: 'CHAIN-18K-CUBAN',
          inventory_quantity: 5,
          is_published: true,
          featured: true
        },
        {
          id: PRODUCT_IDS.DIAMOND_PENDANT,
          name: 'Diamond Pendant',
          slug: 'diamond-pendant',
          description: 'Stunning diamond pendant with 14K gold chain.',
          price: 899.99,
          sku: 'PEND-DIAMOND',
          inventory_quantity: 7,
          is_published: true,
          featured: true
        }
      ])

    if (productsError) {
      throw productsError
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase() 