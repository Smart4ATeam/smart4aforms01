
-- 專案建置合約提交紀錄
CREATE TABLE public.project_contract_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_company TEXT NOT NULL,
  party_a_company TEXT NOT NULL,
  party_a_tax_id TEXT NOT NULL,
  party_a_contact TEXT NOT NULL,
  party_a_address TEXT NOT NULL,
  party_a_phone TEXT NOT NULL,
  party_a_fax TEXT,
  party_a_signer TEXT,
  contract_type TEXT NOT NULL DEFAULT '專案建置合約',
  project_name TEXT NOT NULL,
  project_amount TEXT NOT NULL,
  amount_includes_tax TEXT NOT NULL,
  estimated_work_days TEXT NOT NULL,
  project_content TEXT NOT NULL,
  free_packages JSONB,
  smart4a_packages JSONB,
  paid_packages JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_contract_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage project contracts"
ON public.project_contract_submissions
FOR ALL
USING (true)
WITH CHECK (true);
