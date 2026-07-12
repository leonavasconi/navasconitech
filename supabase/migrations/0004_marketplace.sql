-- Vitrine — multi-vendor marketplace (cart, checkout, coupons, orders, seller panel).
-- Run this once in the Supabase SQL editor.

create type seller_status as enum ('pending', 'approved', 'suspended');
create type product_status as enum ('draft', 'active', 'inactive');
create type order_status as enum ('pending_payment', 'paid', 'shipped', 'delivered', 'cancelled');
create type payment_provider as enum ('mercado_pago', 'stripe', 'pix');
create type discount_type as enum ('percent', 'fixed');

-- ========== SELLERS ==========
create table sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  store_name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  status seller_status not null default 'approved',
  created_at timestamptz not null default now()
);

alter table sellers enable row level security;

create policy "approved sellers are publicly readable"
  on sellers for select
  using (status = 'approved' or auth.uid() = user_id);

create policy "sellers manage their own store"
  on sellers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== CATEGORIES ==========
create table product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

alter table product_categories enable row level security;

create policy "product_categories are publicly readable"
  on product_categories for select
  using (true);

insert into product_categories (name, slug) values
  ('Eletrônicos', 'eletronicos'),
  ('Moda', 'moda'),
  ('Casa e Decoração', 'casa-e-decoracao'),
  ('Esporte e Lazer', 'esporte-e-lazer'),
  ('Livros e Papelaria', 'livros-e-papelaria'),
  ('Beleza e Cuidados', 'beleza-e-cuidados'),
  ('Outros', 'outros');

-- ========== PRODUCTS ==========
create table products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references sellers (id) on delete cascade,
  category_id uuid references product_categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(14, 2) not null check (price >= 0),
  compare_at_price numeric(14, 2),
  stock integer not null default 0 check (stock >= 0),
  status product_status not null default 'active',
  created_at timestamptz not null default now()
);

create index products_seller_id_idx on products (seller_id);
create index products_category_id_idx on products (category_id);

alter table products enable row level security;

create policy "active products from approved sellers are publicly readable"
  on products for select
  using (
    (status = 'active' and exists (
      select 1 from sellers where sellers.id = products.seller_id and sellers.status = 'approved'
    ))
    or seller_id in (select id from sellers where user_id = auth.uid())
  );

create policy "sellers manage their own products"
  on products for all
  using (seller_id in (select id from sellers where user_id = auth.uid()))
  with check (seller_id in (select id from sellers where user_id = auth.uid()));

-- ========== PRODUCT IMAGES ==========
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  url text not null,
  position smallint not null default 0
);

create index product_images_product_id_idx on product_images (product_id);

alter table product_images enable row level security;

create policy "product images are publicly readable"
  on product_images for select
  using (true);

create policy "sellers manage their own product images"
  on product_images for all
  using (product_id in (
    select products.id from products
    join sellers on sellers.id = products.seller_id
    where sellers.user_id = auth.uid()
  ))
  with check (product_id in (
    select products.id from products
    join sellers on sellers.id = products.seller_id
    where sellers.user_id = auth.uid()
  ));

-- ========== CART ==========
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table cart_items enable row level security;

create policy "cart items are owner-only"
  on cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== COUPONS ==========
create table coupons (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers (id) on delete cascade,
  code text not null unique,
  discount_type discount_type not null default 'percent',
  discount_value numeric(14, 2) not null check (discount_value > 0),
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table coupons enable row level security;

create policy "active coupons are publicly readable"
  on coupons for select
  using (active = true or seller_id in (select id from sellers where user_id = auth.uid()));

create policy "sellers manage their own coupons"
  on coupons for insert
  with check (seller_id in (select id from sellers where user_id = auth.uid()));

create policy "sellers update their own coupons"
  on coupons for update
  using (seller_id in (select id from sellers where user_id = auth.uid()))
  with check (seller_id in (select id from sellers where user_id = auth.uid()));

create policy "sellers delete their own coupons"
  on coupons for delete
  using (seller_id in (select id from sellers where user_id = auth.uid()));

-- ========== ORDERS ==========
create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  status order_status not null default 'pending_payment',
  subtotal numeric(14, 2) not null,
  discount numeric(14, 2) not null default 0,
  shipping_cost numeric(14, 2) not null default 0,
  total numeric(14, 2) not null,
  coupon_id uuid references coupons (id) on delete set null,
  shipping_address jsonb not null,
  payment_provider payment_provider,
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index orders_buyer_id_idx on orders (buyer_id);

alter table orders enable row level security;

create policy "buyers read their own orders"
  on orders for select
  using (auth.uid() = buyer_id);

create policy "buyers create their own orders"
  on orders for insert
  with check (auth.uid() = buyer_id);

create policy "buyers update their own orders"
  on orders for update
  using (auth.uid() = buyer_id)
  with check (auth.uid() = buyer_id);

-- ========== ORDER ITEMS ==========
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  seller_id uuid not null references sellers (id) on delete restrict,
  product_name text not null,
  unit_price numeric(14, 2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(14, 2) not null
);

create index order_items_order_id_idx on order_items (order_id);
create index order_items_seller_id_idx on order_items (seller_id);

alter table order_items enable row level security;

create policy "order items are readable by buyer or seller"
  on order_items for select
  using (
    order_id in (select id from orders where buyer_id = auth.uid())
    or seller_id in (select id from sellers where user_id = auth.uid())
  );

create policy "buyers insert their own order items"
  on order_items for insert
  with check (order_id in (select id from orders where buyer_id = auth.uid()));

create policy "sellers update the status-relevant fields on their order items"
  on order_items for update
  using (seller_id in (select id from sellers where user_id = auth.uid()))
  with check (seller_id in (select id from sellers where user_id = auth.uid()));

-- ========== STORAGE (product photos) ==========
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "authenticated users can upload product photos"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "users can delete their own product photos"
  on storage.objects for delete
  using (bucket_id = 'product-images' and owner = auth.uid());
