-- Create form_options table to store form configurations
CREATE TABLE public.form_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_path TEXT UNIQUE NOT NULL,
  options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_options ENABLE ROW LEVEL SECURITY;

-- Anyone can read form options (including anonymous users)
CREATE POLICY "Anyone can read form options"
ON public.form_options FOR SELECT
TO anon, authenticated
USING (true);

-- Anyone can insert form options (for now, can add admin check later)
CREATE POLICY "Anyone can insert form options"
ON public.form_options FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can update form options (for now, can add admin check later)
CREATE POLICY "Anyone can update form options"
ON public.form_options FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for auto-updating updated_at
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