import 'dotenv/config'
import { supabaseAdmin } from '@/lib/supabase/admin'

async function cleanupTestData() {
  console.log('🧹 Starting cleanup...')
  
  try {
    // Delete test products and related data (cascade will handle variants and images)
    console.log('\n🗑️ Cleaning up test products...')
    const { error: productsError } = await supabaseAdmin
      .from('products')
      .delete()
      .like('slug', 'premium-gold-grill-%')

    if (productsError) throw productsError
    console.log('✅ Test products deleted')

    // Delete test categories
    console.log('\n🗑️ Cleaning up test categories...')
    const { error: categoriesError } = await supabaseAdmin
      .from('categories')
      .delete()
      .or('slug.like.grillz-collection-%,slug.like.gold-grillz-%')

    if (categoriesError) throw categoriesError
    console.log('✅ Test categories deleted')

    console.log('\n✨ Cleanup completed successfully!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run the cleanup
cleanupTestData() 