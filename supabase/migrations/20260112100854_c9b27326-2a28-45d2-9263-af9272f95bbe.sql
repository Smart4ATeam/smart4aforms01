-- Create learning_video_confidentiality table
CREATE TABLE public.learning_video_confidentiality (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  signature TEXT,
  signing_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_video_confidentiality ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for public access
CREATE POLICY "Anyone can insert learning video confidentiality"
  ON public.learning_video_confidentiality
  FOR INSERT
  WITH CHECK (true);

-- Create consulting_service_orders table
CREATE TABLE public.consulting_service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name_company TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  zip_code TEXT,
  address TEXT,
  referral_code TEXT,
  reseller_code TEXT,
  service_category TEXT NOT NULL,
  training_level TEXT,
  coaching_mode TEXT,
  consulting_plan TEXT,
  pricing_tier TEXT,
  units INTEGER DEFAULT 1,
  sessions INTEGER DEFAULT 1,
  months INTEGER DEFAULT 1,
  rag_addon BOOLEAN DEFAULT false,
  specified_person TEXT,
  preferred_time_slots TEXT,
  payment_method TEXT,
  invoice_type TEXT,
  invoice_title TEXT,
  invoice_tax_id TEXT,
  notes TEXT,
  unit_price TEXT,
  standard_service_hours TEXT,
  total_price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consulting_service_orders ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for public access
CREATE POLICY "Anyone can insert consulting service orders"
  ON public.consulting_service_orders
  FOR INSERT
  WITH CHECK (true);