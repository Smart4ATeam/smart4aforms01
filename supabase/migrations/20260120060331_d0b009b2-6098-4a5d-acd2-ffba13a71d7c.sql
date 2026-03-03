-- Create table for AI Digital Transform Course registrations
CREATE TABLE public.ai_digital_transform_course_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  session TEXT NOT NULL,
  participation_type TEXT NOT NULL,
  goals TEXT,
  ai_level TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  line_id TEXT,
  company_name TEXT,
  job_title TEXT,
  referrer TEXT,
  attendee_count INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  invoice_type TEXT NOT NULL,
  invoice_title TEXT,
  tax_id TEXT,
  subsidy_tax_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_digital_transform_course_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anonymous users can submit forms)
CREATE POLICY "Allow public insert" 
ON public.ai_digital_transform_course_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy for service role to read all data
CREATE POLICY "Allow service role to read all" 
ON public.ai_digital_transform_course_registrations 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_digital_transform_course_updated_at
BEFORE UPDATE ON public.ai_digital_transform_course_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();