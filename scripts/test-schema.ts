import 'dotenv/config'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/admin'

async function testSchema() {
  console.log('🔍 Starting schema test...')
  
  // Generate unique identifiers
  const timestamp = Date.now()
  const uniqueId = Math.random().toString(36).substring(7)
  
  try {
    // 1. Create parent category
    console.log('\n📁 Creating parent category...')
    const { data: parentCategory, error: parentError } = await supabaseAdmin
      .from('categories')
      .insert({
        name: 'Grillz Collection',
        slug: `grillz-collection-${timestamp}`,
        description: 'Custom grillz collection',
        image_url: 'https://example.com/grillz.jpg'
      })
      .select()
      .single()

    if (parentError) throw parentError
    console.log('✅ Parent category created:', parentCategory.id)

    // 2. Create child category
    console.log('\n📁 Creating child category...')
    const { data: childCategory, error: childError } = await supabaseAdmin
      .from('categories')
      .insert({
        name: 'Gold Grillz',
        slug: `gold-grillz-${timestamp}`,
        description: 'Premium gold grillz',
        image_url: 'https://example.com/gold-grillz.jpg',
        parent_id: parentCategory.id
      })
      .select()
      .single()

    if (childError) throw childError
    console.log('✅ Child category created:', childCategory.id)

    // 3. Create product with new fields
    console.log('\n📦 Creating product...')
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        name: 'Premium Gold Grill',
        slug: `premium-gold-grill-${timestamp}`,
        description: 'Custom 18k gold grill',
        price: 999.99,
        compare_at_price: 1299.99,
        sku: `GRILL-${uniqueId}`,
        is_featured: true,
        inventory_quantity: 5,
        category_id: childCategory.id
      })
      .select()
      .single()

    if (productError) throw productError
    console.log('✅ Product created:', product.id)

    // 4. Create product variants
    console.log('\n🔄 Creating product variants...')
    const { data: variant, error: variantError } = await supabaseAdmin
      .from('product_variants')
      .insert({
        product_id: product.id,
        name: '18k Gold - 6 Teeth',
        sku: `${product.sku}-6T`,
        price: 999.99,
        compare_at_price: 1299.99,
        inventory_quantity: 3,
        option1_name: 'Material',
        option1_value: '18k Gold',
        option2_name: 'Size',
        option2_value: '6 Teeth'
      })
      .select()
      .single()

    if (variantError) throw variantError
    console.log('✅ Product variant created:', variant.id)

    // 5. Create product images
    console.log('\n🖼️ Creating product images...')
    const { data: image, error: imageError } = await supabaseAdmin
      .from('product_images')
      .insert({
        product_id: product.id,
        url: 'https://example.com/gold-grill.jpg',
        alt_text: 'Premium 18k gold grill front view',
        is_primary: true,
        display_order: 1
      })
      .select()
      .single()

    if (imageError) throw imageError
    console.log('✅ Product image created:', image.id)

    // 6. Test reading data as public user
    console.log('\n👤 Testing public read access...')
    const { data: publicProduct, error: publicError } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        category:categories(*)
      `)
      .eq('id', product.id)
      .single()

    if (publicError) throw publicError
    console.log('✅ Public read access working')
    console.log('📝 Product data:', {
      name: publicProduct.name,
      price: publicProduct.price,
      compare_at_price: publicProduct.compare_at_price,
      sku: publicProduct.sku,
      is_featured: publicProduct.is_featured,
      inventory_quantity: publicProduct.inventory_quantity,
      category: publicProduct.category?.name
    })

    console.log('\n✨ All tests passed successfully!')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test
testSchema() 