export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          sku: string
          inventory_quantity: number
          is_available: boolean
          is_featured: boolean
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          sku?: string
          inventory_quantity?: number
          is_available?: boolean
          is_featured?: boolean
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          sku?: string
          inventory_quantity?: number
          is_available?: boolean
          is_featured?: boolean
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          is_primary: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      affiliates: {
        Row: {
          id: string
          user_id: string
          code: string
          commission_rate: number
          status: "active" | "pending" | "inactive"
          total_earnings: number | null
          total_paid: number | null
          payment_method: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          commission_rate: number
          status?: "active" | "pending" | "inactive"
          total_earnings?: number | null
          total_paid?: number | null
          payment_method?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          commission_rate?: number
          status?: "active" | "pending" | "inactive"
          total_earnings?: number | null
          total_paid?: number | null
          payment_method?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ambassadors: {
        Row: {
          id: string
          user_id: string
          name: string
          bio: string | null
          status: "active" | "pending" | "inactive"
          commission_rate: number
          total_earnings: number | null
          total_paid: number | null
          payment_method: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          bio?: string | null
          status?: "active" | "pending" | "inactive"
          commission_rate: number
          total_earnings?: number | null
          total_paid?: number | null
          payment_method?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          bio?: string | null
          status?: "active" | "pending" | "inactive"
          commission_rate?: number
          total_earnings?: number | null
          total_paid?: number | null
          payment_method?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassadors_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          email: string
          total_price: number
          subtotal_price: number
          shipping_price: number | null
          tax_price: number | null
          discount_price: number | null
          shipping_address: Json
          billing_address: Json
          payment_status: string
          fulfillment_status: string
          currency: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          total_price: number
          subtotal_price: number
          shipping_price?: number | null
          tax_price?: number | null
          discount_price?: number | null
          shipping_address: Json
          billing_address: Json
          payment_status?: string
          fulfillment_status?: string
          currency?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          total_price?: number
          subtotal_price?: number
          shipping_price?: number | null
          tax_price?: number | null
          discount_price?: number | null
          shipping_address?: Json
          billing_address?: Json
          payment_status?: string
          fulfillment_status?: string
          currency?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string | null
          barcode: string | null
          price: number
          compare_at_price: number | null
          inventory_quantity: number | null
          option1_name: string | null
          option1_value: string | null
          option2_name: string | null
          option2_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku?: string | null
          barcode?: string | null
          price: number
          compare_at_price?: number | null
          inventory_quantity?: number | null
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string | null
          barcode?: string | null
          price?: number
          compare_at_price?: number | null
          inventory_quantity?: number | null
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          address: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          address?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      referrals: {
        Row: {
          id: string
          affiliate_id: string
          order_id: string
          commission_amount: number
          status: "pending" | "paid" | "cancelled"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          order_id: string
          commission_amount: number
          status?: "pending" | "paid" | "cancelled"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          order_id?: string
          commission_amount?: number
          status?: "pending" | "paid" | "cancelled"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      error_logs: {
        Row: {
          id: string
          error_message: string
          error_stack: string | null
          user_id: string | null
          path: string
          browser: string
          os: string
          created_at: string
        }
        Insert: {
          id?: string
          error_message: string
          error_stack?: string | null
          user_id?: string | null
          path: string
          browser: string
          os: string
          created_at?: string
        }
        Update: {
          id?: string
          error_message?: string
          error_stack?: string | null
          user_id?: string | null
          path?: string
          browser?: string
          os?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      performance_metrics: {
        Row: {
          id: string
          page: string
          load_time: number
          ttfb: number
          fcp: number
          lcp: number
          cls: number
          fid: number
          created_at: string
        }
        Insert: {
          id?: string
          page: string
          load_time: number
          ttfb: number
          fcp?: number
          lcp?: number
          cls?: number
          fid?: number
          created_at?: string
        }
        Update: {
          id?: string
          page?: string
          load_time?: number
          ttfb?: number
          fcp?: number
          lcp?: number
          cls?: number
          fid?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

