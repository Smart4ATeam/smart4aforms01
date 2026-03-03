-- Create quotation_submissions table for internal quotation forms
CREATE TABLE public.quotation_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- 報價人員資訊
  issuer_name TEXT NOT NULL,
  issuer_email TEXT NOT NULL,
  quotation_date DATE NOT NULL,
  inquiry_number TEXT,
  -- 客戶資料
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  invoice_title TEXT,
  tax_id TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  -- 方案選擇
  transformation_packages JSONB,
  consulting_plan TEXT,
  consulting_months INTEGER,
  training_services JSONB,
  -- 費用計算
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  discount_reason TEXT,
  total_amount INTEGER NOT NULL DEFAULT 0,
  -- 系統欄位
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotation_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous insert (form submissions)
CREATE POLICY "Allow anonymous insert for quotation submissions"
  ON public.quotation_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create policy for service role to read all
CREATE POLICY "Allow service role to read quotation submissions"
  ON public.quotation_submissions
  FOR SELECT
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quotation_submissions_updated_at
  BEFORE UPDATE ON public.quotation_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.quotation_submissions IS '內部報價單產生表單提交記錄';