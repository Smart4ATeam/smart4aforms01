-- Add original_order_number column to automation_marketplace_orders (Chinese version)
ALTER TABLE public.automation_marketplace_orders
ADD COLUMN IF NOT EXISTS original_order_number text;

-- Add original_order_number column to automation_marketplace_orders_en (English version)
ALTER TABLE public.automation_marketplace_orders_en
ADD COLUMN IF NOT EXISTS original_order_number text;