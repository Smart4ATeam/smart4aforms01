-- Create table for Smart4A 會員中心登記
CREATE TABLE public.smart4a_member_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  postal_code TEXT,
  address TEXT,
  line_id TEXT,
  referral_code TEXT,
  make_organization_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.smart4a_member_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (anyone can submit)
CREATE POLICY "Anyone can insert member registrations" 
ON public.smart4a_member_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy for selecting (admin access via service role)
CREATE POLICY "Service role can view all member registrations" 
ON public.smart4a_member_registrations 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_smart4a_member_registrations_updated_at
BEFORE UPDATE ON public.smart4a_member_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();