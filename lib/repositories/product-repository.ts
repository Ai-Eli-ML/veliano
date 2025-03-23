import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type {
  ProductBase,
  ProductVariant,
  ProductImage,
  GrillzSpecification,
  ProductWithRelations,
  ProductCreateInput,
  ProductUpdateInput,
} from '@/types/product';
import { Database } from '@/types/supabase';

export class ProductRepository {
  static async createProduct(input: ProductCreateInput): Promise<ProductWithRelations> {
    const supabase = createServerActionClient<Database>({ cookies });

    // Start a transaction
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price,
        compare_at_price: input.compare_at_price,
        featured: input.featured,
        is_new: input.is_new,
        in_stock: input.in_stock,
        stock_quantity: input.stock_quantity,
        status: input.status,
        category_id: input.category_id,
        metadata: input.metadata,
        seo_title: input.seo_title,
        seo_description: input.seo_description,
      })
      .select()
      .single();

    if (productError) throw new Error(`Failed to create product: ${productError.message}`);

    // Create variants if provided
    if (input.variants?.length) {
      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(
          input.variants.map(variant => ({
            ...variant,
            product_id: product.id,
          }))
        );

      if (variantsError) throw new Error(`Failed to create variants: ${variantsError.message}`);
    }

    // Create images if provided
    if (input.images?.length) {
      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(
          input.images.map(image => ({
            ...image,
            product_id: product.id,
          }))
        );

      if (imagesError) throw new Error(`Failed to create images: ${imagesError.message}`);
    }

    // Create grillz specification if provided
    if (input.grillz_specification) {
      // Using a type assertion to work around the type error until
      // the Supabase schema is updated to include grillz_specifications
      const { error: specError } = await (supabase
        .from('grillz_specifications') as any)
        .insert({
          ...input.grillz_specification,
          product_id: product.id,
        });

      if (specError) throw new Error(`Failed to create grillz specification: ${specError.message}`);
    }

    return ProductRepository.getProductById(product.id);
  }

  static async updateProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<ProductWithRelations> {
    const supabase = createServerActionClient<Database>({ cookies });

    const { error } = await supabase
      .from('products')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw new Error(`Failed to update product: ${error.message}`);

    return ProductRepository.getProductById(id);
  }

  static async getProductById(id: string): Promise<ProductWithRelations> {
    const supabase = createServerActionClient<Database>({ cookies });

    // Use a string for the select query to avoid issues
    const selectQuery = `
      *,
      variants:product_variants(*),
      images:product_images(*),
      category:categories(id, name, slug),
      grillz_specification:grillz_specifications(*)
    `;
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(selectQuery)
      .eq('id', id)
      .single();

    if (productError) throw new Error(`Failed to fetch product: ${productError.message}`);
    if (!product) throw new Error(`Product not found: ${id}`);

    return product as unknown as ProductWithRelations;
  }

  static async getProducts(options?: {
    category_id?: string;
    status?: 'draft' | 'active' | 'archived';
    featured?: boolean;
    is_new?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    products: ProductWithRelations[];
    total: number;
  }> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    // Use a string for the select query to avoid issues with replace
    const selectQuery = `
      *,
      variants:product_variants(*),
      images:product_images(*),
      category:categories(id, name, slug),
      grillz_specification:grillz_specifications(*)
    `;
    
    // Create the query with the full select statement
    let query = supabase
      .from('products')
      .select(selectQuery, { count: 'exact' });

    if (options?.category_id) {
      query = query.eq('category_id', options.category_id);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }

    if (options?.is_new !== undefined) {
      query = query.eq('is_new', options.is_new);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
    }

    const { data: products, error, count } = await query;

    if (error) throw new Error(`Failed to fetch products: ${error.message}`);

    return {
      products: products as unknown as ProductWithRelations[],
      total: count || 0,
    };
  }

  static async deleteProduct(id: string): Promise<void> {
    const supabase = createServerActionClient<Database>({ cookies });

    const { error } = await supabase
        .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete product: ${error.message}`);
  }

  static async updateProductStatus(
    id: string,
    status: 'draft' | 'active' | 'archived'
  ): Promise<void> {
    const supabase = createServerActionClient<Database>({ cookies });

    const { error } = await supabase
        .from('products')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Failed to update product status: ${error.message}`);
  }

  static async searchProducts(query: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<{
    products: ProductWithRelations[];
    total: number;
  }> {
    const supabase = createServerActionClient<Database>({ cookies });

    // Use a string for the select query to avoid issues with replace
    const selectQuery = `
      *,
      variants:product_variants(*),
      images:product_images(*),
      category:categories(id, name, slug),
      grillz_specification:grillz_specifications(*)
    `;
    
    // Create the query with the full select statement
    let searchQuery = supabase
      .from('products')
      .select(selectQuery, { count: 'exact' })
      .textSearch('name', query, {
        type: 'websearch',
        config: 'english'
      })
      .eq('status', 'active')
      .limit(options?.limit || 10);

    if (options?.offset) {
      searchQuery = searchQuery.range(options.offset, (options.offset + (options.limit || 10)) - 1);
    }

    const { data: products, error, count } = await searchQuery;

    if (error) throw new Error(`Failed to search products: ${error.message}`);

    return {
      products: products as unknown as ProductWithRelations[],
      total: count || 0,
    };
  }

  static async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    const supabase = createServerActionClient<Database>({ cookies });

    // Use a string for the select query to avoid issues
    const selectQuery = `
      *,
      variants:product_variants(*),
      images:product_images(*),
      category:categories(id, name, slug),
      grillz_specification:grillz_specifications(*)
    `;
    
    const { data: product, error } = await supabase
      .from('products')
      .select(selectQuery)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Product not found
        return null;
      }
      throw new Error(`Failed to fetch product by slug: ${error.message}`);
    }
    
    return product as unknown as ProductWithRelations;
  }

  static async getCategories() {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data: categoriesRaw, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
    
    const categories = categoriesRaw.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      parent_id: cat.parent_id || '',
      created_at: cat.created_at || new Date().toISOString(),
      updated_at: cat.updated_at || new Date().toISOString(),
    }));
    
    return categories;
  }
} 