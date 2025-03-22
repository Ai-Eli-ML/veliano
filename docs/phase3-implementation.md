# Phase 3: Product Features Implementation Guide

## 1. Product Database Schema Design

### A. Core Product Tables

#### Products Table
- Essential Fields:
  - `id`: UUID (primary key)
  - `name`: String (product name)
  - `description`: Text (full product description)
  - `short_description`: String (summary for listings)
  - `price`: Decimal (current price)
  - `compare_at_price`: Decimal (optional, for sale pricing)
  - `sku`: String (stock keeping unit)
  - `inventory_quantity`: Integer (stock level)
  - `is_featured`: Boolean (for homepage/featured sections)
  - `is_active`: Boolean (product visibility)
  - `metadata`: JSONB (flexible additional data)
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

#### Categories Table
- Essential Fields:
  - `id`: UUID (primary key)
  - `name`: String (category name)
  - `slug`: String (URL-friendly identifier)
  - `description`: Text (category description)
  - `image_url`: String (optional category image)
  - `parent_id`: UUID (self-reference for hierarchy, nullable)
  - `sort_order`: Integer (for custom ordering)
  - `is_active`: Boolean (category visibility)
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

#### Product Categories (Junction Table)
- Fields:
  - `product_id`: UUID (foreign key to products)
  - `category_id`: UUID (foreign key to categories)
  - Primary key: Composite (`product_id`, `category_id`)

#### Product Images Table
- Fields:
  - `id`: UUID (primary key)
  - `product_id`: UUID (foreign key to products)
  - `url`: String (image URL)
  - `alt_text`: String (accessibility text)
  - `is_primary`: Boolean (main product image)
  - `sort_order`: Integer (for ordering)
  - `created_at`: Timestamp

### B. RLS Policies

#### Products Table
```sql
-- Public read access
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT USING (is_active = true);

-- Admin write access
CREATE POLICY "Products are editable by admins only" 
  ON products FOR ALL 
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
```

#### Similar policies for categories and product images

### C. Implementation Steps

1. Design and validate schema with team
2. Create migration files for each table
3. Implement and test RLS policies
4. Seed database with sample data
5. Create type definitions for TypeScript integration
6. Document schema and relationships

## 2. Product Component Implementation

### A. Product Listing Components

#### ProductGrid Component
- Responsibilities:
  - Display grid of product cards
  - Handle filtering and sorting
  - Support pagination
  - Show loading states

#### ProductCard Component
- Responsibilities:
  - Display product image
  - Show product name and price
  - Handle hover states
  - Support quick-view functionality

#### Implementation Pattern
```tsx
// components/products/product-grid.tsx
export const ProductGrid = async ({ 
  categoryId, 
  filters, 
  sort 
}: ProductGridProps) => {
  const products = await getProducts({ categoryId, filters, sort });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

// components/products/product-card.tsx
export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <Image
          src={product.primaryImage || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
    </Link>
  );
};
```

### B. Product Detail Page

#### ProductDetail Component
- Responsibilities:
  - Display product images (gallery)
  - Show product information
  - Handle variant selection
  - Support "Add to Cart" functionality
  - Show related products

#### Implementation Pattern
```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts productId={product.id} categoryIds={product.categories.map(c => c.id)} />
    </div>
  );
}
```

## 3. Search Functionality

### A. Search Infrastructure

#### Supabase Full-Text Search
```sql
-- Enable full-text search on products
ALTER TABLE products ADD COLUMN fts tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) STORED;

-- Create search index
CREATE INDEX products_fts_idx ON products USING GIN (fts);
```

#### Search Repository Implementation
```typescript
// lib/repositories/search-repository.ts
export class SearchRepository {
  private supabase = createClient();
  
  async searchProducts(query: string, options?: SearchOptions) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, categories(*)')
      .textSearch('fts', query)
      .eq('is_active', true)
      .order('name')
      .limit(options?.limit || 20);
      
    if (error) throw error;
    return data;
  }
}
```

### B. Search UI Components

#### SearchBar Component
- Responsibilities:
  - Display search input
  - Handle form submission
  - Support autocomplete
  - Show recent searches

#### SearchResults Component
- Responsibilities:
  - Display search results
  - Support filtering and sorting
  - Handle "No results" state
  - Support pagination

## 4. Admin Interface

### A. Product Management

#### ProductList Component
- Responsibilities:
  - Display product table with sorting and filtering
  - Handle bulk actions
  - Support quick editing

#### ProductForm Component
- Responsibilities:
  - Create/edit product details
  - Manage product images
  - Handle category assignments
  - Validate data before submission

### B. Implementation Steps

1. Create admin layout with sidebar navigation
2. Implement data tables with TanStack Table
3. Create forms with React Hook Form and Zod validation
4. Implement image upload with Supabase Storage
5. Add server actions for data mutations
6. Set up proper error handling and success notifications

## Testing Strategy

### Unit Tests

- Test individual components for rendering and interactions
- Test repositories for proper data access
- Test validation functions

### Integration Tests

- Test product listing and filtering
- Test search functionality
- Test admin CRUD operations
- Test image uploads
- Test category relationships

### Performance Tests

- Test image loading optimizations
- Test search response times
- Test bulk product operations

## Documentation Requirements

- Update API documentation with new endpoints
- Document database schema changes
- Create component documentation
- Update developer guidelines 