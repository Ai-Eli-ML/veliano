export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      carts: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean
          metadata: Json | null
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean
          metadata?: Json | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean
          metadata?: Json | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          metadata: Json | null
          price: number
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          price: number
          product_id: string
          quantity: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          price?: number
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_orders: {
        Row: {
          created_at: string | null
          customer_id: string
          design_details: string | null
          estimated_completion_date: string | null
          id: string
          impression_kit_status: string
          impression_kit_tracking: string | null
          material: string
          notes: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          teeth_selection: Json
          total_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          design_details?: string | null
          estimated_completion_date?: string | null
          id?: string
          impression_kit_status?: string
          impression_kit_tracking?: string | null
          material: string
          notes?: string | null
          order_number: string
          status?: Database["public"]["Enums"]["order_status"]
          teeth_selection: Json
          total_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          design_details?: string | null
          estimated_completion_date?: string | null
          id?: string
          impression_kit_status?: string
          impression_kit_tracking?: string | null
          material?: string
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          teeth_selection?: Json
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          browser: string
          created_at: string
          error_message: string
          error_stack: string | null
          id: string
          os: string
          path: string
          user_id: string | null
        }
        Insert: {
          browser: string
          created_at?: string
          error_message: string
          error_stack?: string | null
          id?: string
          os: string
          path: string
          user_id?: string | null
        }
        Update: {
          browser?: string
          created_at?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          os?: string
          path?: string
          user_id?: string | null
        }
        Relationships: []
      }
      grillz_specifications: {
        Row: {
          base_production_time_days: number
          created_at: string | null
          customization_options: Json
          diamond_options: Json | null
          id: string
          material: Database["public"]["Enums"]["grillz_material"]
          product_id: string
          style: Database["public"]["Enums"]["grillz_style"]
          teeth_count: number
          teeth_position: Database["public"]["Enums"]["teeth_position"]
          updated_at: string | null
        }
        Insert: {
          base_production_time_days: number
          created_at?: string | null
          customization_options: Json
          diamond_options?: Json | null
          id?: string
          material: Database["public"]["Enums"]["grillz_material"]
          product_id: string
          style: Database["public"]["Enums"]["grillz_style"]
          teeth_count: number
          teeth_position: Database["public"]["Enums"]["teeth_position"]
          updated_at?: string | null
        }
        Update: {
          base_production_time_days?: number
          created_at?: string | null
          customization_options?: Json
          diamond_options?: Json | null
          id?: string
          material?: Database["public"]["Enums"]["grillz_material"]
          product_id?: string
          style?: Database["public"]["Enums"]["grillz_style"]
          teeth_count?: number
          teeth_position?: Database["public"]["Enums"]["teeth_position"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grillz_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          cls: number
          created_at: string
          fcp: number
          fid: number
          id: string
          lcp: number
          load_time: number
          page: string
          ttfb: number
        }
        Insert: {
          cls: number
          created_at?: string
          fcp: number
          fid: number
          id?: string
          lcp: number
          load_time: number
          page: string
          ttfb: number
        }
        Update: {
          cls?: number
          created_at?: string
          fcp?: number
          fid?: number
          id?: string
          lcp?: number
          load_time?: number
          page?: string
          ttfb?: number
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          product_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          product_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          product_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          compare_at_price: number | null
          created_at: string
          id: string
          inventory_quantity: number | null
          name: string
          option1_name: string | null
          option1_value: string | null
          option2_name: string | null
          option2_value: string | null
          option3_name: string | null
          option3_value: string | null
          price: number
          product_id: string | null
          sku: string | null
          updated_at: string
        }
        Insert: {
          compare_at_price?: number | null
          created_at?: string
          id?: string
          inventory_quantity?: number | null
          name: string
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          price: number
          product_id?: string | null
          sku?: string | null
          updated_at?: string
        }
        Update: {
          compare_at_price?: number | null
          created_at?: string
          id?: string
          inventory_quantity?: number | null
          name?: string
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          price?: number
          product_id?: string | null
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_production_time: number | null
          category_id: string | null
          compare_at_price: number | null
          created_at: string | null
          description: string | null
          id: string
          inventory_quantity: number | null
          is_available: boolean | null
          is_custom_order: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          requires_impression_kit: boolean | null
          sku: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          base_production_time?: number | null
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          inventory_quantity?: number | null
          is_available?: boolean | null
          is_custom_order?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          requires_impression_kit?: boolean | null
          sku?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          base_production_time?: number | null
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          inventory_quantity?: number | null
          is_available?: boolean | null
          is_custom_order?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          requires_impression_kit?: boolean | null
          sku?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total: number
          payment_intent_id: string | null
          checkout_session_id: string | null
          shipping_address: Json | null
          billing_address: Json | null
          created_at: string
          updated_at: string
          customer_email: string | null
          customer_name: string | null
          notes: string | null
          payment_status: string
          shipping_status: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status: string
          total: number
          payment_intent_id?: string | null
          checkout_session_id?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          created_at?: string
          updated_at?: string
          customer_email?: string | null
          customer_name?: string | null
          notes?: string | null
          payment_status: string
          shipping_status?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total?: number
          payment_intent_id?: string | null
          checkout_session_id?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          created_at?: string
          updated_at?: string
          customer_email?: string | null
          customer_name?: string | null
          notes?: string | null
          payment_status?: string
          shipping_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
          name: string
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          price: number
          name: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          price?: number
          name?: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      grillz_material:
        | "gold"
        | "silver"
        | "platinum"
        | "rainbow_gold"
        | "diamond_encrusted"
      grillz_style: "full_set" | "top_only" | "bottom_only" | "fangs" | "custom"
      order_status:
        | "pending"
        | "impression_kit_sent"
        | "impression_received"
        | "in_design"
        | "in_production"
        | "completed"
      teeth_position: "top" | "bottom" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
