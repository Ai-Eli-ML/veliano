'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { addToCart } from '@/actions/cart';
import { addToWishlist } from '@/actions/wishlist';
import { Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  inventory_count: number;
  category: {
    id: string;
    name: string;
  };
  material?: string;
  style_tags?: string[];
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setIsAddingToWishlist(true);
      await addToWishlist(product.id);
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error('Failed to add to wishlist');
      console.error('Error adding to wishlist:', error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold">{formatCurrency(product.price)}</p>
        </div>

        <div className="space-y-2">
          <Badge variant="secondary">{product.category.name}</Badge>
          {product.material && <Badge variant="outline">{product.material}</Badge>}
          {product.style_tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="ml-2">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-gray-600">{product.description}</p>

        <div className="space-y-4">
          {product.inventory_count > 0 ? (
            <p className="text-sm text-green-600">In Stock ({product.inventory_count} available)</p>
          ) : (
            <p className="text-sm text-red-600">Out of Stock</p>
          )}

          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.inventory_count === 0}
              className="flex-1"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 