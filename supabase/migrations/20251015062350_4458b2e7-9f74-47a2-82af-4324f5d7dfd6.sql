-- Add level column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1;

-- Add experience points column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience integer NOT NULL DEFAULT 0;

-- Create index for level queries
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);

-- Update existing profiles to have level 1
UPDATE public.profiles SET level = 1 WHERE level IS NULL;