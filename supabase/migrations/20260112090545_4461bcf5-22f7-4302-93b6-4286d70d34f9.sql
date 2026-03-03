-- Create student_club_registrations table
CREATE TABLE public.student_club_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_date TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  is_student BOOLEAN NOT NULL,
  student_id TEXT,
  points_status TEXT,
  amount INTEGER NOT NULL,
  payment_method TEXT,
  invoice_type TEXT,
  invoice_title TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_club_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can insert registrations"
  ON public.student_club_registrations
  FOR INSERT
  WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_student_club_registrations_updated_at
  BEFORE UPDATE ON public.student_club_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_form_options_updated_at();