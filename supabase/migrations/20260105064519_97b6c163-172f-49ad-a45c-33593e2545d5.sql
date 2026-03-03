-- Create form_options table for storing form configuration options
CREATE TABLE public.form_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id TEXT NOT NULL,
  option_key TEXT NOT NULL,
  option_value JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(form_id, option_key)
);

-- Enable Row Level Security
ALTER TABLE public.form_options ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (forms need to read options)
CREATE POLICY "Anyone can read form options" 
ON public.form_options 
FOR SELECT 
USING (true);

-- Create policy for public insert (for initial creation)
CREATE POLICY "Anyone can insert form options" 
ON public.form_options 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update (for dashboard updates)
CREATE POLICY "Anyone can update form options" 
ON public.form_options 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_form_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_form_options_updated_at
BEFORE UPDATE ON public.form_options
FOR EACH ROW
EXECUTE FUNCTION public.update_form_options_updated_at();