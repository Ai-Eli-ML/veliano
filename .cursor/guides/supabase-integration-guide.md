# Supabase Integration Guide

## 1. Database Schema Design

### Product Schema
```sql
-- Products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric not null check (price >= 0),
  compare_at_price numeric check (compare_at_price >= 0),
  featured boolean default false,
  is_new boolean default false,
  in_stock boolean default true,
  stock_quantity integer default 0,
  category_id uuid references categories(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Product images
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt text,
  position integer default 0,
  created_at timestamp with time zone default now()
);

-- Product categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references categories(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Product variants (for different sizes, materials, etc.)
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  sku text,
  price numeric not null check (price >= 0),
  stock_quantity integer default 0,
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Product reviews
create table product_reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  content text,
  created_at timestamp with time zone default now()
);
```

### Order Schema
```sql
-- Orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  order_number text not null unique,
  status text not null check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric not null,
  tax numeric not null default 0,
  shipping_cost numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null,
  shipping_address jsonb,
  billing_address jsonb,
  payment_intent_id text,
  payment_status text not null check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Order items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null check (quantity > 0),
  price numeric not null,
  total numeric not null,
  created_at timestamp with time zone default now()
);
```

### Custom Order Schema for Grillz
```sql
-- Custom orders for grillz
create table custom_orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  order_id uuid references orders(id),
  order_number text not null unique,
  status text not null check (status in ('pending', 'design', 'manufacturing', 'shipped', 'delivered', 'cancelled')),
  teeth_selection jsonb not null,
  material text not null,
  design_details text,
  additional_instructions text,
  impression_kit_sent boolean default false,
  impression_kit_received boolean default false,
  impression_kit_tracking text,
  estimated_completion_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## 2. Setting Up Row Level Security (RLS)

### Enable RLS
```sql
-- Enable RLS on tables
alter table products enable row level security;
alter table product_images enable row level security;
alter table categories enable row level security;
alter table product_variants enable row level security;
alter table product_reviews enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table custom_orders enable row level security;
```

### Create Policies
```sql
-- Products: anyone can read, only admins can write
create policy "Products are viewable by everyone" on products
  for select using (true);

create policy "Products are editable by admins" on products
  for all using (auth.uid() in (select user_id from admin_users));

-- Orders: users can see their own orders, admins can see all
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);
  
create policy "Admins can view all orders" on orders
  for select using (auth.uid() in (select user_id from admin_users));

create policy "Admins can edit orders" on orders
  for all using (auth.uid() in (select user_id from admin_users));
```

## 3. Supabase Client Setup

### Create API Client
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Server Components Client
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

### Generate TypeScript Types
```bash
npx supabase gen types typescript --project-id <your-project-id> --schema public > types/supabase.ts
```

## 4. Data Access Layer

### Create Repository Pattern
```typescript
// lib/repositories/product-repository.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithImages } from '@/types/product';

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images(id, url, alt, position)
    `);
    
  if (options?.category) {
    query = query.eq('category.slug', options.category);
  }
  
  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
  
  return data as ProductWithImages[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images(id, url, alt, position),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Product not found
    }
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
  
  return data as ProductWithImages;
}
```

### Use Repository in Server Components
```typescript
// app/products/[category]/[slug]/page.tsx
import { getProductBySlug } from '@/lib/repositories/product-repository';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  
  return {
    title: `${product.name} | Veliano`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container px-4 py-10 mx-auto">
      {/* Product details rendering */}
    </div>
  );
}
```

## 5. Authentication Implementation

### Setup Auth Provider
```typescript
// components/providers/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Implement Auth Forms
```typescript
// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Successfully logged in!");
      router.push("/account");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
```

## 6. Authorization with RLS and Middleware

### Create Auth Middleware
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if accessing protected routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/account') ||
                          req.nextUrl.pathname.startsWith('/checkout');
                          
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/account/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // For admin routes, verify admin status
  if (isAdminRoute) {
    if (!session) {
      const redirectUrl = new URL('/account/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .single();
      
    if (!adminData) {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/checkout/:path*',
  ],
};
```

## 7. Migration from Mock Data to Real Data

### Step 1: Identify Components Using Mock Data
- Product listing pages
- Product detail pages
- Search functionality
- Cart system
- Checkout process
- Account order history

### Step 2: Create Migration Plan for Each Component

#### Example: Product Grid Migration
1. Identify the mock data source: `getProducts()` function
2. Create a new repository function that fetches from Supabase
3. Update component to use the new data source
4. Update types to match database schema
5. Test the component with real data
6. Add error handling and loading states

### Step 3: Implement Caching and Optimization

#### Server Component Caching
```typescript
// lib/repositories/product-repository.ts
import { unstable_cache } from 'next/cache';

export const getProducts = unstable_cache(
  async (options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const supabase = await createServerSupabaseClient();
    // ... existing query code
    return data as ProductWithImages[];
  },
  ['products'],
  { revalidate: 60 } // Cache for 60 seconds
);
```

#### Optimistic Updates for Client Components
```typescript
// hooks/use-cart.ts
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        
        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, id: `${item.productId}-${Date.now()}` }],
          });
        }
        
        toast.success(`${item.name} added to cart`);
        
        // If user is logged in, sync with server
        syncCartWithServer(get().items);
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        // Sync with server
        syncCartWithServer(get().items);
      },
      
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
        // Sync with server
        syncCartWithServer(get().items);
      },
      
      clearCart: () => {
        set({ items: [] });
        // Sync with server
        syncCartWithServer([]);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

// Helper function to sync cart with server
async function syncCartWithServer(items: CartItem[]) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    try {
      // Upsert cart data to user's cart table
      await supabase
        .from('user_carts')
        .upsert({
          user_id: session.user.id,
          cart_items: items,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  }
}
```

## 8. Server Actions for Data Mutations

### Create Product
```typescript
// app/admin/products/actions.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  inStock: z.boolean().default(true),
  stockQuantity: z.coerce.number().min(0).default(0),
});

export async function createProduct(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  
  // Verify admin status
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  // Check if user is admin
  const { data: adminData } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', session.user.id)
    .single();
    
  if (!adminData) {
    throw new Error("Unauthorized - Admin access required");
  }
  
  // Parse and validate form data
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "true",
    isNew: formData.get("isNew") === "true",
    inStock: formData.get("inStock") === "true",
    stockQuantity: formData.get("stockQuantity"),
  });
  
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }
  
  // Insert product
  const { data: product, error } = await supabase
    .from('products')
    .insert(parsed.data)
    .select()
    .single();
    
  if (error) {
    return { error: { form: error.message } };
  }
  
  // Handle image uploads
  const imageUrls = await handleImageUploads(formData, product.id);
  
  // Insert product images
  if (imageUrls.length > 0) {
    const imageInserts = imageUrls.map((url, index) => ({
      product_id: product.id,
      url,
      position: index,
    }));
    
    await supabase.from('product_images').insert(imageInserts);
  }
  
  // Revalidate product pages
  revalidatePath("/products");
  revalidatePath(`/admin/products/${product.id}`);
  
  return { product };
}

async function handleImageUploads(formData: FormData, productId: string) {
  const supabase = await createServerSupabaseClient();
  const imageUrls: string[] = [];
  
  // Get all files from the form
  const files = formData.getAll("images") as File[];
  
  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      const fileName = `${productId}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });
        
      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);
        
      imageUrls.push(publicUrl);
    }
  }
  
  return imageUrls;
}
```

### Use Server Action in Admin Form
```tsx
// app/admin/products/new/page.tsx
import { createProduct } from "@/app/admin/products/actions";

export default function NewProductPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      
      <form action={createProduct} className="space-y-6">
        {/* Form fields... */}
        <button type="submit" className="btn btn-primary">
          Create Product
        </button>
      </form>
    </div>
  );
}
```

## 9. Testing the Migration

### Test Plan
1. Start with non-critical pages (e.g., product listings)
2. Test each component individually after migration
3. Use feature flags to enable/disable real data for specific components
4. Maintain mock data as fallbacks during development
5. Test with small datasets before full migration

### Tips for Smooth Migration
- Implement graceful error handling
- Add proper loading states for all async operations
- Use React Suspense boundaries for async components
- Monitor for performance issues with larger datasets
- Test on both development and production environments
- Create a rollback plan for each migration step 