-- Create course_retraining_registrations table
CREATE TABLE public.course_retraining_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL,
  course_date TEXT NOT NULL,
  attendance_days TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT,
  invoice_type TEXT,
  invoice_title TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_retraining_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can insert course retraining registrations"
  ON public.course_retraining_registrations
  FOR INSERT
  WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_course_retraining_registrations_updated_at
  BEFORE UPDATE ON public.course_retraining_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_form_options_updated_at();