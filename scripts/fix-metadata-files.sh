#!/bin/bash

# Initialize log file
LOG_FILE="metadata-files-fixes-log.txt"
echo "Starting metadata files fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Fix app/account/orders/[id]/metadata.ts
fix_account_orders_id_metadata() {
  local file="./app/account/orders/[id]/metadata.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper metadata structure
    cat > "$temp_file" << EOF
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details and status"
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix app/how-it-works/metadata.ts
fix_how_it_works_metadata() {
  local file="./app/how-it-works/metadata.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper metadata structure
    cat > "$temp_file" << EOF
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how our process works from start to finish"
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix app/returns-exchanges/metadata.ts
fix_returns_exchanges_metadata() {
  local file="./app/returns-exchanges/metadata.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper metadata structure
    cat > "$temp_file" << EOF
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Our policy on returns and exchanges for products purchased from our store"
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix app/warranty/metadata.ts
fix_warranty_metadata() {
  local file="./app/warranty/metadata.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper metadata structure
    cat > "$temp_file" << EOF
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Warranty Information",
  description: "Learn about our product warranty policies and coverage"
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix app/metadata.ts
fix_app_metadata() {
  local file="./app/metadata.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper metadata structure
    cat > "$temp_file" << EOF
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Veliano - Premium Products",
    template: "%s | Veliano"
  },
  description: "Discover high-quality products at Veliano, your destination for premium shopping",
  keywords: ["ecommerce", "premium", "quality", "products", "online shopping"],
  authors: [{ name: "Veliano Team" }],
  creator: "Veliano",
  publisher: "Veliano Inc.",
  robots: "index, follow",
  applicationName: "Veliano Store",
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: true
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veliano.com",
    title: "Veliano - Premium Products",
    description: "Discover high-quality products at Veliano, your destination for premium shopping",
    siteName: "Veliano",
    images: [
      {
        url: "https://veliano.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Veliano - Premium Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Veliano - Premium Products",
    description: "Discover high-quality products at Veliano, your destination for premium shopping",
    images: ["https://veliano.com/images/twitter-image.jpg"],
    creator: "@veliano"
  }
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix app/admin/layout.tsx
fix_admin_layout() {
  local file="./app/admin/layout.tsx"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Read the file content
    file_content=$(cat "$file")
    
    # Check if there's an unused expression error
    if grep -q "^import.*from" "$file"; then
      # Extract the imports
      imports=$(grep "^import" "$file")
      
      # First part: write use client and imports
      echo '"use client"' > "$temp_file"
      echo "" >> "$temp_file"
      echo "$imports" >> "$temp_file"
      echo "" >> "$temp_file"
      
      # Find the layout function and extract it
      if grep -q "export default function" "$file"; then
        # Extract from export default function to the end
        sed -n '/export default function/,$p' "$file" >> "$temp_file"
      else
        # Create a basic layout function
        cat >> "$temp_file" << EOF
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">{children}</div>
    </div>
  )
}
EOF
      fi
      
      # Replace the original file
      mv "$temp_file" "$file"
      log_message "Fixed $file"
    else
      log_message "No issues found in $file"
    fi
  else
    log_message "File not found: $file"
  fi
}

# Fix app/global-error.tsx
fix_global_error() {
  local file="./app/global-error.tsx"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper error component
    cat > "$temp_file" << EOF
"use client"
 
import { useEffect } from "react"
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
          <p className="mb-8 text-lg">We apologize for the inconvenience. Please try again later.</p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Run the fixes
log_message "Starting metadata file fixes..."
fix_account_orders_id_metadata
fix_how_it_works_metadata
fix_returns_exchanges_metadata
fix_warranty_metadata
fix_app_metadata
fix_admin_layout
fix_global_error
log_message "Completed metadata file fixes at $(date)" 