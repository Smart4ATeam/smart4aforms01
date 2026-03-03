-- Add lovable_email column for Lovable Migration Tool orders (EN version)
ALTER TABLE public.automation_marketplace_orders_en
ADD COLUMN lovable_email text NULL;