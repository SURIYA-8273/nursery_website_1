-- Query to add a new Admin User (since all authenticated users are admins in this MVP)
-- 1. Enable pgcrypto extension if not already enabled (required for password hashing)
create extension if not exists pgcrypto;

-- 2. Insert the user into auth.users
-- REPLACE 'admin@example.com' and 'password123' with your desired credentials.
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- instance_id
  gen_random_uuid(), -- id
  'authenticated', -- aud
  'authenticated', -- role
  'admin@example.com', -- email
  crypt('password123', gen_salt('bf')), -- encrypted_password
  now(), -- email_confirmed_at
  now(), -- recovery_sent_at
  now(), -- last_sign_in_at
  '{"provider":"email","providers":["email"]}', -- raw_app_meta_data
  '{}', -- raw_user_meta_data
  now(), -- created_at
  now(), -- updated_at
  '', -- confirmation_token
  '', -- email_change
  '', -- email_change_token_new
  '' -- recovery_token
);

-- Note: In this architecture, we check `auth.role() = 'authenticated'` for admin access in RLS policies.
-- So simply existing in `auth.users` allows you to access the dashboard.
