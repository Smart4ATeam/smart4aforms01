-- Create table for Tuesday Meetup registrations
CREATE TABLE public.tuesday_meetup_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_date TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  purposes TEXT,
  source TEXT,
  order_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tuesday_meetup_registrations ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Anyone can insert tuesday meetup registrations"
ON public.tuesday_meetup_registrations
FOR INSERT
WITH CHECK (true);

-- Create table for Venue Rental applications
CREATE TABLE public.venue_rental_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_days TEXT NOT NULL,
  rental_date1 TEXT NOT NULL,
  start_time1 TEXT NOT NULL,
  end_time1 TEXT NOT NULL,
  rental_date2 TEXT,
  start_time2 TEXT,
  end_time2 TEXT,
  discount_hours INTEGER DEFAULT 0,
  total_hours NUMERIC(5,2) NOT NULL,
  event_theme TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  invoice_type TEXT,
  invoice_title TEXT,
  invoice_tax_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venue_rental_applications ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Anyone can insert venue rental applications"
ON public.venue_rental_applications
FOR INSERT
WITH CHECK (true);