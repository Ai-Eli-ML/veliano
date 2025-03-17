#!/bin/bash

# Initialize log file
LOG_FILE="remaining-errors-fixes-log.txt"
echo "Starting remaining errors fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Fix components/affiliate/affiliate-transactions.tsx
fix_affiliate_transactions() {
  local file="./components/affiliate/affiliate-transactions.tsx"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper structure
    cat > "$temp_file" << EOF
"use client"

import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { formatDate } from "@/lib/format-date"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface AffiliateTransactionsProps {
  userId: string;
}

export function AffiliateTransactions({ userId }: AffiliateTransactionsProps) {
  const [transactions, setTransactions] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchTransactions() {
      if (!userId) return

      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('affiliate_transactions')
          .select()
          .eq('affiliate_id', userId)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching transactions:', error)
          return
        }
        
        setTransactions(data || [])
      } catch (err) {
        console.error('Error in transaction fetch:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p>Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No transactions found. Transactions will appear here when you start earning commissions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.created_at)}</TableCell>
                  <TableCell>{transaction.order_id}</TableCell>
                  <TableCell>
                    <span className={
                      transaction.status === 'paid' 
                        ? 'text-green-600' 
                        : transaction.status === 'pending' 
                          ? 'text-amber-600' 
                          : 'text-red-600'
                    }>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
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

# Fix lib/supabase-server.ts
fix_supabase_server() {
  local file="./lib/supabase-server.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper structure
    cat > "$temp_file" << EOF
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies in middleware
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies in middleware
          }
        },
      },
    }
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

# Fix lib/supabase.ts
fix_supabase() {
  local file="./lib/supabase.ts"
  if [ -f "$file" ]; then
    log_message "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Create proper structure
    cat > "$temp_file" << EOF
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Create a single supabase client for interop in utilities
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase
EOF
    
    # Replace the original file
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  else
    log_message "File not found: $file"
  fi
}

# Fix unused expression errors
fix_unused_expressions() {
  for file in $(grep -l "@typescript-eslint/no-unused-expressions" "$LOG_FILE" | grep -o './[^ ]*'); do
    if [ -f "$file" ]; then
      log_message "Fixing unused expression in $file"
      
      # Create a temporary file
      temp_file=$(mktemp)
      
      # Extract the imports
      grep "^import" "$file" > "$temp_file"
      echo "" >> "$temp_file"
      
      # Check if it's a component
      if grep -q "export.*function" "$file"; then
        # Extract from export function to the end
        sed -n '/export.*function/,$p' "$file" >> "$temp_file"
      elif grep -q "export default" "$file"; then
        # Extract from export default to the end
        sed -n '/export default/,$p' "$file" >> "$temp_file"
      else
        # If it's a utility file, just extract everything after imports
        awk 'BEGIN{found=0} /^import/ { if(!found) found=1 } { if(found && !/^import/ && !/^\/\//) print }' "$file" >> "$temp_file"
      fi
      
      # Replace the original file
      mv "$temp_file" "$file"
      log_message "Fixed unused expression in $file"
    fi
  done
}

# Run the fixes
log_message "Starting remaining error fixes..."
fix_affiliate_transactions
fix_supabase_server
fix_supabase
fix_unused_expressions
log_message "Completed remaining error fixes at $(date)" 