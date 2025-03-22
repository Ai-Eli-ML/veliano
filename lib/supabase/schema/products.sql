-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Product status enum
create type product_status as enum ('draft', 'active', 'archived');

-- Grillz material enum
create type grillz_material as enum ('gold_10k', 'gold_14k', 'gold_18k', 'silver_925', 'platinum');

-- Grillz style enum
create type grillz_style as enum ('open_face', 'closed_face', 'diamond_cut', 'custom');

-- Teeth position enum
create type teeth_position as enum ('top', 'bottom');

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
  status product_status not null default 'draft',
  category_id uuid references categories(id),
  metadata jsonb default '{}',
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Product variants table
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  name text not null,
  sku text not null unique,
  price numeric not null check (price >= 0),
  compare_at_price numeric check (compare_at_price >= 0),
  in_stock boolean default true,
  stock_quantity integer default 0,
  metadata jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Product images table
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  alt_text text,
  position integer not null default 0,
  is_thumbnail boolean default false,
  created_at timestamp with time zone default now()
);

-- Grillz specifications table
create table grillz_specifications (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  material grillz_material not null,
  style grillz_style not null,
  teeth_position teeth_position not null,
  teeth_count integer not null check (teeth_count > 0),
  diamond_options jsonb,
  customization_options jsonb not null default '{
    "available_materials": ["gold_10k", "gold_14k"],
    "available_styles": ["open_face", "closed_face"],
    "custom_text_available": false
  }',
  base_production_time_days integer not null default 14,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint unique_product_spec unique (product_id)
);

-- Indexes
create index idx_products_category on products(category_id);
create index idx_products_status on products(status);
create index idx_product_variants_product on product_variants(product_id);
create index idx_product_images_product on product_images(product_id);
create index idx_grillz_specs_product on grillz_specifications(product_id);

-- Update timestamps trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers for updating timestamps
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

create trigger update_product_variants_updated_at
  before update on product_variants
  for each row
  execute function update_updated_at_column();

create trigger update_grillz_specifications_updated_at
  before update on grillz_specifications
  for each row
  execute function update_updated_at_column();

-- RLS Policies
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table grillz_specifications enable row level security;

-- Public read access
create policy "Public read access for active products"
  on products for select
  using (status = 'active');

create policy "Public read access for product variants"
  on product_variants for select
  using (true);

create policy "Public read access for product images"
  on product_images for select
  using (true);

create policy "Public read access for grillz specifications"
  on grillz_specifications for select
  using (true);

-- Admin access
create policy "Admin full access for products"
  on products for all
  using (auth.role() = 'admin')
  with check (auth.role() = 'admin');

create policy "Admin full access for product variants"
  on product_variants for all
  using (auth.role() = 'admin')
  with check (auth.role() = 'admin');

create policy "Admin full access for product images"
  on product_images for all
  using (auth.role() = 'admin')
  with check (auth.role() = 'admin');

create policy "Admin full access for grillz specifications"
  on grillz_specifications for all
  using (auth.role() = 'admin')
  with check (auth.role() = 'admin'); 