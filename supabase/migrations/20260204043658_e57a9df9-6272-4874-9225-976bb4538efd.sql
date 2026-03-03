-- Create table for learning satisfaction survey submissions
CREATE TABLE public.learning_satisfaction_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_date TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  teaching_quality INTEGER NOT NULL CHECK (teaching_quality >= 1 AND teaching_quality <= 5),
  time_arrangement INTEGER NOT NULL CHECK (time_arrangement >= 1 AND time_arrangement <= 5),
  learning_pace INTEGER NOT NULL CHECK (learning_pace >= 1 AND learning_pace <= 5),
  content_helpfulness INTEGER NOT NULL CHECK (content_helpfulness >= 1 AND content_helpfulness <= 5),
  ta_assistance INTEGER NOT NULL CHECK (ta_assistance >= 1 AND ta_assistance <= 5),
  course_feedback TEXT,
  future_content_wishes TEXT,
  expectation_met TEXT NOT NULL,
  would_recommend TEXT NOT NULL,
  other_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.learning_satisfaction_surveys ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (allow anonymous inserts for public form)
CREATE POLICY "Allow anonymous inserts for learning satisfaction surveys" 
ON public.learning_satisfaction_surveys 
FOR INSERT 
WITH CHECK (true);

-- Create policy for reading (only via service role - handled by edge function)
CREATE POLICY "Allow service role to read learning satisfaction surveys"
ON public.learning_satisfaction_surveys
FOR SELECT
USING (false);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_learning_satisfaction_surveys_updated_at
BEFORE UPDATE ON public.learning_satisfaction_surveys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.learning_satisfaction_surveys IS '學習滿意度與回饋調查表提交資料';