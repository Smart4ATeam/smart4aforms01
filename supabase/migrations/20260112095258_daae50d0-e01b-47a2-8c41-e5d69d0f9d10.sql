-- Create table for Automation Marketplace orders (中文版)
CREATE TABLE public.automation_marketplace_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Basic Info
  name_or_company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  postal_code TEXT,
  address TEXT,
  -- Hidden fields
  distributor_id TEXT,
  referral_code TEXT,
  original_expiry_date TEXT,
  original_key TEXT,
  app_id TEXT,
  -- Product Info
  make_organization_id TEXT,
  automation_module TEXT NOT NULL,
  plan TEXT NOT NULL,
  purchase_months TEXT,
  unit_price NUMERIC(10,2),
  total_cost NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'TWD',
  activation_date TEXT,
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
ALTER TABLE public.automation_marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Anyone can insert automation marketplace orders"
ON public.automation_marketplace_orders
FOR INSERT
WITH CHECK (true);

-- Create table for Automation Marketplace orders (英文版)
CREATE TABLE public.automation_marketplace_orders_en (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Basic Info
  name_or_company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  -- Hidden fields
  distributor_id TEXT,
  referral_code TEXT,
  original_expiry_date TEXT,
  original_key TEXT,
  app_id TEXT,
  -- Product Info
  make_organization_id TEXT,
  automation_module TEXT NOT NULL,
  plan TEXT NOT NULL,
  purchase_months TEXT,
  unit_price NUMERIC(10,2),
  total_cost NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  activation_date TEXT,
  -- Payment (static - PayPal)
  payment_method TEXT DEFAULT 'paypal',
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automation_marketplace_orders_en ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Anyone can insert automation marketplace orders EN"
ON public.automation_marketplace_orders_en
FOR INSERT
WITH CHECK (true);