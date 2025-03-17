# Veliano Admin Portal Development Guide

## Overview

This document serves as a technical guide for developers working on the Veliano Admin Portal, a comprehensive management interface for the luxury jewelry business specializing in custom grillz. The admin portal provides tools for managing products, orders, customers, and the custom grillz order workflow.

## Tech Stack

The admin portal is built on:

- **Next.js 15** - App Router architecture
- **TypeScript** - For type safety
- **shadcn/ui** - Component library
- **Supabase** - Database, authentication, and storage
- **Stripe** - Payment processing
- **React Hook Form** - Form handling with Zod validation
- **TanStack Table** - Data tables with sorting, filtering, and pagination
- **Lucide Icons** - Icon library

## Getting Started

To work on the admin portal:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see .env.example)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Access the admin portal at http://localhost:3000/admin

## Folder Structure

The admin portal follows a well-structured organization:

```
/app/admin/                      # Admin portal root
  ├── layout.tsx                 # Admin layout with navigation
  ├── page.tsx                   # Dashboard/home
  ├── products/                  # Product management
  ├── orders/                    # Order management
  ├── customers/                 # Customer management
  ├── custom-orders/             # Custom orders system
  │   ├── page.tsx               # List view
  │   ├── [id]/                  # Detail views
  │   │   ├── page.tsx           # Detail page
  │   │   ├── edit/              # Edit pages
  │   │   └── timeline/          # Timeline views
  │   └── new/                   # New custom order form
  ├── content/                   # Content management
  └── settings/                  # System settings

/components/ui/                  # Shared UI components
/lib/repositories/               # Data access layer
/lib/supabase/                   # Supabase clients and utils
/types/                          # TypeScript type definitions
```

## Authentication & Authorization

The admin portal uses Supabase Authentication with:

- Email/password authentication
- Role-based access control
- Server-side session checks
- Secure middleware for protected routes

### Role Structure

- **Owner** - Full access to all features
- **Admin** - Complete access except settings
- **Manager** - Product, order, and customer management
- **Support** - Limited access to orders and customers

## Data Access Pattern

We use a repository pattern for data access:

```typescript
// Example repository function
export async function getCustomOrders(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('custom_orders')
    .select(`
      *,
      customer:customers(id, name, email, phone),
      order_items:custom_order_items(*)
    `);
    
  if (options?.status) {
    query = query.eq('status', options.status);
  }
  
  // Add pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching custom orders:', error);
    throw new Error('Failed to fetch custom orders');
  }
  
  return data;
}
```

## Server Actions

We use Next.js Server Actions for data mutations:

```typescript
// Example Server Action
"use server"

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type CustomOrder } from "@/types";

export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  note?: string
) {
  const supabase = await createServerSupabaseClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  // Perform update
  const { error } = await supabase
    .from('custom_orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
    
  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
  
  // Add timeline entry
  if (note) {
    await supabase
      .from('order_timeline')
      .insert({
        order_id: orderId,
        status: `Status Changed to ${status}`,
        note,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
      });
  }
  
  // Revalidate paths
  revalidatePath(`/admin/custom-orders/${orderId}`);
  revalidatePath('/admin/custom-orders');
  
  return { success: true };
}
```

## Custom Order Workflow

The custom grillz workflow has several stages:

1. **Order Creation** - Customer places order
2. **Impression Kit** - Kit sent, received, and validated
3. **Design Phase** - 3D modeling and design approval
4. **Manufacturing** - Production of the custom grillz
5. **Shipping** - Shipping and delivery
6. **Follow-up** - Post-purchase service

## UI Components

The admin portal uses shadcn/ui components with custom extensions:

- Form components with validation
- Data tables with filtering and pagination
- Dashboard metrics and charts
- Custom workflows specific to grillz business

## Development Guidelines

### Code Standards

- Use TypeScript for all new components
- Follow the repository pattern for data access
- Use Server Actions for mutations
- Implement proper error handling
- Add loading states for all async operations

### Security Best Practices

- Validate all inputs on server side
- Use Row Level Security (RLS) in Supabase
- Implement proper CSRF protection
- Never expose sensitive credentials

### Performance Considerations

- Use proper pagination for large datasets
- Implement caching where appropriate
- Optimize image loading and processing
- Use query optimization techniques

## Deployment

The admin portal is deployed via Vercel:

```bash
# Deploy to production
vercel --prod

# Deploy to staging environment
vercel
```

## Additional Resources

- [@admin-portal-guide.md](/@admin-portal-guide.md) - Complete guide to features and implementation
- [@supabase-integration-guide.md](/@supabase-integration-guide.md) - Database schema and queries
- [@phase1-implementation.md](/@phase1-implementation.md) - Implementation roadmap

## Support and Contact

For questions or support on admin portal development, contact the technical lead at dev@veliano.com. 