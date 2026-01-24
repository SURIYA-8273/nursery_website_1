-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Categories Table
create table public.categories (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  slug text not null,
  slug text not null,
  image text null,
  description text null,
  constraint categories_pkey primary key (id),
  constraint categories_slug_key unique (slug)
);

-- Plants Table
create table public.plants (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  name text not null,
  slug text not null,
  price numeric not null,
  discount numeric null,
  description text not null,
  care_instructions text null,
  category_id uuid null,
  images text[] null default '{}'::text[],
  stock integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  constraint plants_pkey primary key (id),
  constraint plants_slug_key unique (slug),
  constraint plants_category_id_fkey foreign key (category_id) references categories (id)
);

-- RLS Policies (Start open for read, restricted for write)
alter table public.plants enable row level security;
alter table public.categories enable row level security;

-- Allow public read access
create policy "Public Plants Read" on public.plants for select using (true);
create policy "Public Categories Read" on public.categories for select using (true);

-- Allow authenticated (admin) write access (Simple version, ideally check for admin role)
create policy "Admin Plants All" on public.plants for all using (auth.role() = 'authenticated');
create policy "Admin Categories All" on public.categories for all using (auth.role() = 'authenticated');

-- Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('plants', 'plants', true);

create policy "Public Image Read" on storage.objects for select using ( bucket_id = 'plants' );
create policy "Admin Image Upload" on storage.objects for insert with check ( bucket_id = 'plants' and auth.role() = 'authenticated' );
