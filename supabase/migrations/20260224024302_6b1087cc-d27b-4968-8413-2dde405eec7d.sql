
-- Create products table for automation marketplace
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id text NOT NULL,
  app_name text NOT NULL,
  category text NOT NULL,
  monthly_price_twd numeric NOT NULL DEFAULT 0,
  monthly_price_usd numeric NOT NULL DEFAULT 0,
  creator text NOT NULL,
  publish_date date NOT NULL,
  requires_official_api boolean NOT NULL DEFAULT false,
  requires_api_token_oauth boolean NOT NULL DEFAULT false,
  install_link text NOT NULL,
  doc_link text,
  app_image_filename text,
  has_scenario_attachment boolean NOT NULL DEFAULT false,
  scenario_attachment_filename text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read products
CREATE POLICY "Anyone can read products"
ON public.products FOR SELECT
USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update products"
ON public.products FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete products"
ON public.products FOR DELETE
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product files
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', true);

-- Storage policies
CREATE POLICY "Anyone can view product files"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-files');

CREATE POLICY "Authenticated users can upload product files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-files');

CREATE POLICY "Authenticated users can update product files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-files');

CREATE POLICY "Authenticated users can delete product files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-files');
