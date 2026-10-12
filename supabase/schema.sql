-- ==========================================================
-- ShineDe Nails — Supabase Database & Storage Schema
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  saved_measurements JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Custom Orders Table
CREATE TABLE IF NOT EXISTS public.custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  image_url TEXT NOT NULL,
  shape TEXT NOT NULL CHECK (shape IN ('almond', 'coffin', 'square', 'stiletto', 'oval')),
  length TEXT NOT NULL CHECK (length IN ('short', 'medium', 'long', 'extra_long')),
  finish TEXT NOT NULL DEFAULT 'glossy' CHECK (finish IN ('glossy', 'matte', 'mixed')),
  sizing_type TEXT NOT NULL CHECK (sizing_type IN ('standard', 'custom')),
  size_data JSONB NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Designing', 'Shipped', 'Delivered', 'Cancelled')),
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_custom_orders_user_id ON public.custom_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_orders_order_number ON public.custom_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_custom_orders_created_at ON public.custom_orders(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile when auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Custom Orders RLS Policies
-- Users can view their own orders
CREATE POLICY "Users can view their own custom orders"
  ON public.custom_orders
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL) -- Allow guest confirmation lookup if matching order_number handled via server
  );

-- Anyone (authenticated or guest) can create a custom order
CREATE POLICY "Anyone can create custom orders"
  ON public.custom_orders
  FOR INSERT
  WITH CHECK (true);

-- Users can update their own orders (e.g. adding notes before designing)
CREATE POLICY "Users can update their own pending orders"
  ON public.custom_orders
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'Pending');

-- 7. Supabase Storage Bucket Setup for Nail Inspirations
-- Create the bucket for user uploaded nail photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('nail-inspirations', 'nail-inspirations', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can read uploaded inspiration images
CREATE POLICY "Public Access for nail inspirations"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'nail-inspirations');

-- Storage Policy: Anyone can upload nail inspirations
CREATE POLICY "Anyone can upload nail inspirations"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'nail-inspirations');
