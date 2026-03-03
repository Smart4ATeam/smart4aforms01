-- 建立服務詢價與需求確認單資料表
CREATE TABLE public.service_inquiry_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- 客戶聯絡資訊
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  -- 發票資訊（選填）
  tax_id TEXT,
  invoice_title TEXT,
  company_address TEXT,
  -- 陪跑與轉型方案（單選）
  transformation_package TEXT,
  custom_description TEXT,
  -- 顧問服務
  consulting_plan TEXT,
  consulting_type TEXT,
  consulting_months INTEGER,
  consulting_rag TEXT,
  consulting_designated_name TEXT,
  -- 技術指導 & 教育訓練
  training_category TEXT,
  training_option TEXT,
  training_sessions INTEGER,
  training_designated_name TEXT,
  -- 其他需求或備註
  notes TEXT,
  -- 預估參考金額
  estimated_amount INTEGER DEFAULT 0,
  -- 時間戳記
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE public.service_inquiry_submissions ENABLE ROW LEVEL SECURITY;

-- 建立觸發器更新 updated_at
CREATE TRIGGER update_service_inquiry_submissions_updated_at
  BEFORE UPDATE ON public.service_inquiry_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 添加註解
COMMENT ON TABLE public.service_inquiry_submissions IS '服務詢價與需求確認單提交資料';