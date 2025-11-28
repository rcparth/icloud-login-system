-- Create table for storing user registrations
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration)
CREATE POLICY "Anyone can register" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read their own registration by email
CREATE POLICY "Anyone can read registrations" 
ON public.registrations 
FOR SELECT 
USING (true);