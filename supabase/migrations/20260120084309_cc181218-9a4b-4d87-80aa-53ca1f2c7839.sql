-- Add submission_id column to smart4a_member_registrations
ALTER TABLE public.smart4a_member_registrations 
ADD COLUMN submission_id TEXT;