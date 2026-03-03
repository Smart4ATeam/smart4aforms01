-- Create table for Template Store orders (中文版)
CREATE TABLE public.template_store_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Basic Info
  name_or_company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  postal_code TEXT,
  address TEXT,
  -- Product Info
  template TEXT NOT NULL,
  template_id TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'TWD',
  -- Hidden fields
  referral_code TEXT,
  dealer_code TEXT,
  -- Payment Info
  payment_method TEXT,
  invoice_type TEXT,
  invoice_title TEXT,
  tax_id TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.template_store_orders ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Anyone can insert template store orders"
ON public.template_store_orders
FOR INSERT
WITH CHECK (true);

-- Create table for Template Store orders (英文版)
CREATE TABLE public.template_store_orders_en (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Basic Info
  name_or_company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  -- Product Info
  template TEXT NOT NULL,
  template_id TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  -- Hidden fields
  referral_code TEXT,
  dealer_code TEXT,
  -- Payment (static - PayPal)
  payment_method TEXT DEFAULT 'paypal',
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.template_store_orders_en ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Anyone can insert template store orders EN"
ON public.template_store_orders_en
FOR INSERT
WITH CHECK (true);