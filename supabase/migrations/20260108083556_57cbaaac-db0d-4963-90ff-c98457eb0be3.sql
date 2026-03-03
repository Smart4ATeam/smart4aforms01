-- Add unique constraint to prevent duplicate (form_id, option_key) pairs
ALTER TABLE public.form_options ADD CONSTRAINT form_options_form_id_option_key_unique UNIQUE (form_id, option_key);