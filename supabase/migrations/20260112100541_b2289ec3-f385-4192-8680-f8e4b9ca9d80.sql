-- Create student_product_claims table
CREATE TABLE public.student_product_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_or_company TEXT NOT NULL,
  student_id TEXT,
  email TEXT NOT NULL,
  make_organization_id TEXT NOT NULL,
  packages TEXT,
  template TEXT,
  claim_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_product_claims ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for public access
CREATE POLICY "Anyone can insert student product claims"
  ON public.student_product_claims
  FOR INSERT
  WITH CHECK (true);

-- Create instructor_payment_applications table
CREATE TABLE public.instructor_payment_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  activity_days TEXT NOT NULL,
  activity_date1 TEXT NOT NULL,
  start_time1 TEXT NOT NULL,
  end_time1 TEXT NOT NULL,
  activity_date2 TEXT,
  start_time2 TEXT,
  end_time2 TEXT,
  break_hours NUMERIC DEFAULT 0,
  total_hours NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instructor_payment_applications ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for public access
CREATE POLICY "Anyone can insert instructor payment applications"
  ON public.instructor_payment_applications
  FOR INSERT
  WITH CHECK (true);