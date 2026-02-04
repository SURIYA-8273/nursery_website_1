-- Google Reviews Table
create table public.google_reviews (
  id uuid not null default gen_random_uuid (),
  name text not null,          -- Reviewer Name (e.g., "John Doe")
  timeline text null,          -- Display time (e.g., "2 weeks ago")
  rating numeric not null,     -- Star rating (e.g., 5, 4.5)
  review text null,            -- Review content
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint google_reviews_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.google_reviews enable row level security;

-- Policies
create policy "Public Google Reviews Read" on public.google_reviews 
  for select using (true);

create policy "Admin Google Reviews All" on public.google_reviews 
  for all using (auth.role() = 'authenticated');
