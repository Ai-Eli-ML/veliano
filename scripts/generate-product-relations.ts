import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Database } from '@/types/supabase';

dotenv.config();

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  style_tags: string[];
  material: string;
}

async function generateProductRelations() {
  try {
    console.log('Fetching products...');
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    if (!products?.length) {
      console.log('No products found');
      return;
    }

    console.log(`Found ${products.length} products. Generating relations...`);

    // Delete existing relations
    await supabase.from('product_relations').delete().neq('id', 'none');

    const relations: {
      product_id: string;
      related_product_id: string;
      relation_type: string;
      strength: number;
    }[] = [];

    // Generate relations based on various factors
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      for (let j = 0; j < products.length; j++) {
        if (i === j) continue;
        const relatedProduct = products[j];

        // Calculate similarity based on different factors
        const similarities = {
          category: product.category_id === relatedProduct.category_id ? 0.3 : 0,
          price: calculatePriceSimilarity(product.price, relatedProduct.price),
          style: calculateStyleSimilarity(
            product.style_tags || [],
            relatedProduct.style_tags || []
          ),
          material: product.material === relatedProduct.material ? 0.2 : 0,
        };

        const totalSimilarity = Object.values(similarities).reduce((a, b) => a + b, 0);
        
        // Only create relations if similarity is above threshold
        if (totalSimilarity > 0.3) {
          relations.push({
            product_id: product.id,
            related_product_id: relatedProduct.id,
            relation_type: 'similar_style',
            strength: Math.min(totalSimilarity, 1), // Cap at 1
          });
        }
      }

      // Log progress
      if ((i + 1) % 10 === 0) {
        console.log(`Processed ${i + 1}/${products.length} products`);
      }
    }

    // Insert relations in batches
    const batchSize = 100;
    for (let i = 0; i < relations.length; i += batchSize) {
      const batch = relations.slice(i, i + batchSize);
      const { error } = await supabase.from('product_relations').insert(batch);
      if (error) throw error;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(relations.length / batchSize)}`);
    }

    console.log('Successfully generated product relations!');
    console.log(`Total relations created: ${relations.length}`);
  } catch (error) {
    console.error('Error generating product relations:', error);
  }
}

function calculatePriceSimilarity(price1: number, price2: number): number {
  const priceDiff = Math.abs(price1 - price2);
  const avgPrice = (price1 + price2) / 2;
  const percentDiff = priceDiff / avgPrice;

  // Return a similarity score between 0 and 0.25 based on price difference
  if (percentDiff <= 0.1) return 0.25; // Very similar prices
  if (percentDiff <= 0.2) return 0.2;
  if (percentDiff <= 0.3) return 0.15;
  if (percentDiff <= 0.4) return 0.1;
  if (percentDiff <= 0.5) return 0.05;
  return 0; // Prices too different
}

function calculateStyleSimilarity(tags1: string[], tags2: string[]): number {
  if (!tags1.length || !tags2.length) return 0;

  const intersection = tags1.filter(tag => tags2.includes(tag));
  const union = new Set([...tags1, ...tags2]);

  // Jaccard similarity coefficient
  return (intersection.length / union.size) * 0.25;
}

// Run the script
generateProductRelations(); 