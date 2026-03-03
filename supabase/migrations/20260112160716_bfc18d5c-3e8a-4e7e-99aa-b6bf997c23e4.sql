-- Create a table for course quiz submissions
CREATE TABLE public.course_quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_date TEXT NOT NULL,
  completion_date TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  question_count INTEGER NOT NULL,
  answers JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.course_quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for insert (anyone can submit)
CREATE POLICY "Anyone can insert course quiz submissions" 
ON public.course_quiz_submissions 
FOR INSERT 
WITH CHECK (true);