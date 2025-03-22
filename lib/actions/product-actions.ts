'use server';

import { revalidatePath } from 'next/cache';
import { ProductRepository } from '@/lib/repositories/product-repository';
import type { 
  ProductCreateInput, 
  ProductUpdateInput, 
  ProductStatus
} from '@/types/product';

export async function createProduct(data: ProductCreateInput) {
  try {
    const product = await ProductRepository.createProduct(data);
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, product };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  try {
    const product = await ProductRepository.updateProduct(id, data);
    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, product };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await ProductRepository.deleteProduct(id);
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function updateProductStatus(id: string, status: ProductStatus) {
  try {
    await ProductRepository.updateProductStatus(id, status);
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error('Failed to update product status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function searchProducts(query: string, options?: {
  limit?: number;
  offset?: number;
}) {
  try {
    const result = await ProductRepository.searchProducts(query, options);
    return { success: true, ...result };
  } catch (error) {
    console.error('Failed to search products:', error);
    return { 
      success: false, 
      products: [],
      total: 0,
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
} 