# Product Image Storage Implementation

## Overview

This document explains how image storage for products is implemented in the Veliano Jewelry E-commerce platform. The system uses Supabase Storage for file management and Supabase Database for maintaining references to the stored images.

## Architecture

The image storage system consists of the following components:

1. **Storage Layer:** Supabase Storage bucket `product-images`
2. **Database Layer:** `product_images` table in the Supabase database
3. **Server Actions:** API endpoints for image upload, update, and deletion
4. **Client Components:** UI components for image management

## Database Schema

The `product_images` table has the following structure:

```typescript
interface ProductImage {
  id: string        // UUID primary key
  url: string       // Full URL to the image in Supabase storage
  alt?: string      // Alternative text for the image (for accessibility)
  productId: string // Foreign key to the products table
  position?: number // Position/order of the image in the product gallery
}
```

## Server Actions

### Image Upload

The `uploadProductImage` server action in `/app/actions/admin/product-image.ts` handles image uploads:

1. Validates authentication (admin users only)
2. Validates the file (size limit: 5MB, allowed formats: JPG, JPEG, PNG, WebP)
3. Generates a unique filename using UUID
4. Uploads the file to Supabase Storage
5. Creates a record in the `product_images` table
6. Revalidates relevant paths to update the UI
7. Returns the image data or an error message

### Image Update

The `updateProductImage` server action allows updating image metadata:

1. Updates the `alt` text and/or `position` of an image
2. Revalidates relevant paths
3. Returns success status or an error message

### Image Deletion

The `deleteProductImage` server action:

1. Retrieves the image data to get the storage path
2. Deletes the file from Supabase Storage
3. Deletes the record from the `product_images` table
4. Revalidates relevant paths
5. Returns success status or an error message

## Client Components

### Product Image Upload Component

The `ProductImageUpload` component in `/components/admin/products/product-image-upload.tsx`:

1. Displays existing product images in a grid
2. Provides an upload zone for adding new images
3. Handles file selection and triggers the upload action
4. Provides delete functionality for each image
5. Shows loading states during uploads and deletions
6. Notifies users of success/failure using toast notifications

### Product Form Component

The `ProductForm` component in `/components/admin/products/product-form.tsx` integrates the image upload component into the product management interface.

## Usage in Product Pages

The product images are displayed in:

1. Product listing pages (`/products` and `/products/[category]`)
2. Product detail pages (`/products/[category]/[slug]`)
3. Admin product management (`/admin/products/[id]`)

## Security

1. **Authentication:** All image management actions require authenticated admin users
2. **Storage Access:** Public read access, admin-only write access
3. **Validation:** Server-side validation prevents uploading malicious files

## Integration with Supabase

The implementation leverages Supabase's Storage and Database capabilities:

1. **Storage bucket:** `product-images` with appropriate RLS policies
2. **Database table:** `product_images` with relationships to the `products` table
3. **Authentication:** Uses Supabase Auth for admin verification

## Best Practices

1. **Lazy Loading:** Images use Next.js Image component for optimized loading
2. **Alt Text:** All images support alternative text for accessibility
3. **Multiple Formats:** Support for various image formats
4. **Image Ordering:** Images can be ordered with position property
5. **Error Handling:** Comprehensive error handling throughout the system

## Future Enhancements

1. Image cropping and resizing tools
2. Bulk upload functionality
3. Image optimization pipeline
4. Drag-and-drop reordering of images
5. Automatic generation of product thumbnails 