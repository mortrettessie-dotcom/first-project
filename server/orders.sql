alter table public.orders
  add column if not exists number text,
  add column if not exists last_name text,
  add column if not exists first_name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists delivery text,
  add column if not exists address text,
  add column if not exists slot text,
  add column if not exists payment text,
  add column if not exists comment text,
  add column if not exists promo text,
  add column if not exists items jsonb,
  add column if not exists delivery_cost numeric,
  add column if not exists goods_total numeric;

create unique index if not exists orders_number_key on public.orders (number);

notify pgrst, 'reload schema';
