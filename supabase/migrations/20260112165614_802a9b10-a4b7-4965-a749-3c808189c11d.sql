-- Create revenue_sharing_recipients table for storing text data only (no images)
CREATE TABLE public.revenue_sharing_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Recipient type
  recipient_type TEXT NOT NULL, -- 'company' or 'individual'
  
  -- Company fields (nullable for individual type)
  company_name TEXT,
  company_tax_id TEXT,
  company_contact_name TEXT,
  company_address TEXT,
  
  -- Individual fields (nullable for company type)
  recipient_name TEXT,
  recipient_id_number TEXT,
  recipient_address TEXT,
  
  -- Common fields
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Bank account info
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  branch_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.revenue_sharing_recipients ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit the form)
CREATE POLICY "Anyone can insert revenue sharing recipients"
ON public.revenue_sharing_recipients
FOR INSERT
WITH CHECK (true);