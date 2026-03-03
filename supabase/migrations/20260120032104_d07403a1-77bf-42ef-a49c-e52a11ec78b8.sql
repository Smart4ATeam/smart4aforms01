-- First create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for payment notification submissions (without base64 storage)
CREATE TABLE public.payment_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT,
  name_or_company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_service TEXT NOT NULL,
  payment_amount NUMERIC NOT NULL,
  payment_date TEXT NOT NULL,
  bank_last_5_digits TEXT NOT NULL,
  payment_proof_filename TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for insert (public access)
CREATE POLICY "Anyone can insert payment_notifications" 
ON public.payment_notifications 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_notifications_updated_at
BEFORE UPDATE ON public.payment_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.payment_notifications IS 'Stores payment notification form submissions';