-- Create table for prompt mode change submissions
CREATE TABLE public.prompt_mode_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_info TEXT,
  prompt_desc TEXT,
  line_id TEXT,
  select_mode TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prompt_mode_changes ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (allow all for form submissions)
CREATE POLICY "Allow anonymous inserts" 
ON public.prompt_mode_changes 
FOR INSERT 
WITH CHECK (true);

-- Create policy for reading (service role only via edge function)
CREATE POLICY "Allow service role reads" 
ON public.prompt_mode_changes 
FOR SELECT 
USING (false);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompt_mode_changes_updated_at
BEFORE UPDATE ON public.prompt_mode_changes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();