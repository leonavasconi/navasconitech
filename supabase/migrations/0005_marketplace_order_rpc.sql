-- Vitrine — RPC functions so a buyer's checkout can decrement stock and bump
-- coupon usage, which RLS otherwise blocks (those tables are seller-owned).

create or replace function decrement_product_stock(p_product_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update products
  set stock = stock - p_quantity
  where id = p_product_id and stock >= p_quantity;
end;
$$;

create or replace function increment_coupon_usage(p_coupon_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update coupons
  set used_count = used_count + 1
  where id = p_coupon_id;
end;
$$;

grant execute on function decrement_product_stock(uuid, integer) to authenticated;
grant execute on function increment_coupon_usage(uuid) to authenticated;
