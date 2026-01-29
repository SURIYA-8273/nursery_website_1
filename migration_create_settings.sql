-- Create business_settings table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id text PRIMARY KEY DEFAULT '1',
    business_name text,
    logo_url text,
    instagram_url text,
    mobile_number text,
    address text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (Adjust as needed for your auth model)

-- Allow read access to everyone (public)
CREATE POLICY "Allow public read access" 
ON public.business_settings FOR SELECT 
USING (true);

-- Allow update access only to authenticated users (admin)
-- detailed RLS might be stricter, but for now allow authenticated
CREATE POLICY "Allow authenticated update access" 
ON public.business_settings FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Allow insert access only to authenticated users (initial setup)
CREATE POLICY "Allow authenticated insert access" 
ON public.business_settings FOR INSERT 
TO authenticated 
WITH CHECK (true);
