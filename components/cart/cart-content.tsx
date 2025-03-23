"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/cart-item";
import { CartEmpty } from "@/components/cart/cart-empty";
import { useCart } from "@/hooks/use-cart";
import { CartItem as CartItemType } from "@/hooks/use-cart";
import { getCartItems } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/utils";

interface CartContentProps {
  onClose?: () => void;
}

export function CartContent({ onClose }: CartContentProps) {
  const router = useRouter();
  const { items, subtotal, clearCart, addItem } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [serverItems, setServerItems] = useState<any[]>([]);
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        // Fetch server-side cart items
        const serverCartItems = await getCartItems();
        
        // Store the server items
        setServerItems(serverCartItems);
        
        // Merge client and server items if needed
        if (items.length === 0 && serverCartItems.length > 0) {
          setMerging(true);
          
          // Add server items to client cart for seamless experience
          for (const item of serverCartItems) {
            // Check if already in cart to avoid duplicates
            const existingItem = items.find(i => 
              i.productId === item.productId && 
              i.variantId === item.variantId
            );
            
            if (!existingItem) {
              // Add to client cart
              addItem({
                productId: item.productId,
                name: item.name || "Product",
                price: item.price,
                quantity: item.quantity,
                image: item.image || "/images/placeholder.jpg",
                variantId: item.variantId,
              });
            }
          }
          
          setMerging(false);
        }
      } catch (error) {
        console.error("Failed to fetch cart items from server:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [items, addItem]);

  const handleCheckout = () => {
    if (onClose) onClose();
    router.push("/checkout");
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      router.refresh();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Display loading state while fetching or merging
  if (isLoading || merging) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  // Show empty state if no items
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-6 w-6 text-primary"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
        <p className="mb-6 text-center text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button asChild className="metallic-button" onClick={onClose}>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.variantId || ''}`} item={item} />
          ))}
        </div>
      </div>
      
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="text-sm font-semibold">{formatCurrency(subtotal())}</span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium">Shipping</span>
          <span className="text-sm text-muted-foreground">Calculated at checkout</span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-base font-medium">Total</span>
          <span className="text-base font-bold">{formatCurrency(subtotal())}</span>
        </div>
        
        <div className="mt-4 space-y-2">
          <Button onClick={handleCheckout} className="w-full">
            Proceed to Checkout
          </Button>
          
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              className="w-1/2"
            >
              Clear Cart
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-1/2"
              onClick={onClose}
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

