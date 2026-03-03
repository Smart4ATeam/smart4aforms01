-- 為 service_inquiry_submissions 添加 RLS 政策
CREATE POLICY "Anyone can insert service inquiry submissions"
  ON public.service_inquiry_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read all service inquiry submissions"
  ON public.service_inquiry_submissions
  FOR SELECT
  USING (true);