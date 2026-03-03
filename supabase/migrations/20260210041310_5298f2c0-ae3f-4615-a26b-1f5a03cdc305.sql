
-- Create allowed_users whitelist table
CREATE TABLE public.allowed_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated @fans.tw users can read (for login check)
CREATE POLICY "Authenticated users can check whitelist"
ON public.allowed_users
FOR SELECT
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_allowed_users_updated_at
BEFORE UPDATE ON public.allowed_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial admin account (you can add more later)
INSERT INTO public.allowed_users (email, display_name) VALUES
  ('admin@fans.tw', '管理員');
