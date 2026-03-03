-- Add lovable_email column for Lovable Migration Tool orders
ALTER TABLE public.automation_marketplace_orders
ADD COLUMN lovable_email text NULL;