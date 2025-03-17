# Veliano Admin Portal Guide

## Overview

The Veliano Admin Portal is a secure, feature-rich management interface designed specifically for the luxury jewelry business. This portal enables business owners and authorized staff to manage products, orders, customers, and website content efficiently.

## Key Features

1. **Dashboard**
   - Real-time sales analytics and metrics
   - Order status tracking
   - Inventory alerts
   - Recent customer activity

2. **Product Management**
   - Create, edit, and delete products
   - Manage product categories and collections
   - Upload and organize product images
   - Set pricing, discounts, and inventory levels
   - Manage product variants (sizes, materials, etc.)

3. **Order Management**
   - View and process incoming orders
   - Update order status and send notifications
   - View order history and details
   - Process refunds and exchanges
   - Generate invoices and packing slips

4. **Customer Management**
   - View customer profiles and order history
   - Manage customer communication
   - Handle customer support requests
   - Import/export customer data

5. **Custom Order System** (Grillz-specific)
   - Track custom order status
   - Manage impression kit process
   - Design approval workflow
   - Production status tracking

6. **Content Management**
   - Edit website content
   - Manage blog posts
   - Update FAQs and educational content
   - Control homepage featured products

7. **Settings**
   - User access management
   - Payment gateway configuration
   - Shipping options and rates
   - Tax settings
   - Email notification templates

## Implementation Architecture

The admin portal follows a secure, role-based architecture:

```
/app/admin/           # Admin portal root
  ├── layout.tsx      # Admin layout with navigation
  ├── page.tsx        # Dashboard/home
  ├── auth/           # Admin authentication
  ├── products/       # Product management
  ├── orders/         # Order management
  ├── customers/      # Customer management
  ├── custom-orders/  # Custom orders system
  ├── content/        # Content management
  └── settings/       # System settings
```

## Technical Components

1. **Authentication and Authorization**
   - Secure admin login with Supabase Auth
   - Role-based access control
   - Session management and security

2. **Data Management**
   - Server components for data fetching
   - Server actions for data mutations
   - Real-time updates with Supabase subscriptions
   - Data validation and error handling

3. **UI Components**
   - Responsive admin interface using shadcn/ui
   - Data tables with sorting, filtering, and pagination
   - Form components with validation
   - Interactive dashboards with charts

4. **API Integration**
   - Supabase for database operations
   - Stripe for payment processing
   - File storage for product images and assets

## Access Control Implementation

The admin portal implements a robust access control system with multiple user roles:

- **Owner**: Full access to all functionality
- **Admin**: Full access except user management and financial settings
- **Manager**: Access to products, orders, and customers
- **Support**: Limited access to orders and customer management

To implement this, the portal uses:
1. Supabase RLS (Row Level Security) policies
2. Role-based UI rendering
3. Server-side authorization checks

## Getting Started with the Admin Portal

1. **Accessing the Admin Portal**
   - Go to `https://yourdomain.com/admin`
   - Login with your admin credentials
   - First-time users will need to set up their account

2. **Initial Configuration**
   - Set up your business information
   - Configure payment and shipping options
   - Create product categories
   - Set up tax rules

3. **Adding Products**
   - Create product categories
   - Add products with detailed information
   - Upload high-quality images
   - Set up inventory tracking

4. **Managing Orders**
   - View incoming orders
   - Process payments
   - Update order status
   - Generate shipping labels

## Development Guidelines

When extending or modifying the admin portal:

1. **Security First**
   - Always validate input on both client and server
   - Use parameterized queries to prevent SQL injection
   - Keep admin routes protected with proper middleware
   - Regularly audit access logs

2. **Performance Considerations**
   - Implement pagination for large data sets
   - Use optimistic UI updates for better UX
   - Leverage caching for frequently accessed data
   - Optimize image uploads and processing

3. **Code Organization**
   - Follow the established pattern for new features
   - Keep business logic in server actions or repositories
   - Maintain separation of concerns
   - Document complex workflows

## Implementation Roadmap

The admin portal will be implemented in stages:

### Phase 1: Core Infrastructure
- Admin layout and navigation
- Authentication and authorization
- Dashboard with key metrics
- Basic product management

### Phase 2: Product & Order Management
- Complete product management
- Order processing workflow
- Inventory management
- Payment processing

### Phase 3: Customer & Content Management
- Customer profiles and history
- Communication tools
- Content editing capabilities
- Marketing features

### Phase 4: Advanced Features
- Custom order system for grillz
- Impression kit management
- Analytics and reporting
- Automation workflows

## Technical Dependencies

- Next.js 15
- Supabase (Database, Auth, Storage)
- Stripe API
- shadcn/ui Components
- React Hook Form with Zod validation
- TanStack Table for data tables
- Recharts for analytics visualizations
