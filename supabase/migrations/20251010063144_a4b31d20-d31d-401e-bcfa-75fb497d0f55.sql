-- Add balance column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN balance bigint NOT NULL DEFAULT 1000;

-- Create index for faster balance lookups
CREATE INDEX idx_profiles_balance ON public.profiles(balance);

-- Update RLS policy to allow users to update their own balance
-- (already covered by existing "Users can update their own profile" policy)