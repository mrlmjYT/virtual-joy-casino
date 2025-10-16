-- Create coins column for profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS coins bigint NOT NULL DEFAULT 0;

-- Create shop_items table for purchasable designs
CREATE TABLE IF NOT EXISTS public.shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price bigint NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('theme', 'avatar_frame', 'badge', 'effect')),
  preview_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_items table to track purchased items
CREATE TABLE IF NOT EXISTS public.user_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  is_equipped boolean DEFAULT false,
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_items ENABLE ROW LEVEL SECURITY;

-- Shop items are viewable by everyone
CREATE POLICY "Shop items are viewable by everyone"
ON public.shop_items FOR SELECT
USING (true);

-- Users can view all user items
CREATE POLICY "User items are viewable by everyone"
ON public.user_items FOR SELECT
USING (true);

-- Users can insert their own purchases
CREATE POLICY "Users can purchase items"
ON public.user_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own items (equip/unequip)
CREATE POLICY "Users can update own items"
ON public.user_items FOR UPDATE
USING (auth.uid() = user_id);

-- Add some starter shop items
INSERT INTO public.shop_items (name, description, price, item_type, preview_data) VALUES
('Goldenes Theme', 'Luxuriöses goldenes Farbschema', 5000, 'theme', '{"primary": "#FFD700", "accent": "#FFA500"}'),
('Diamant Rahmen', 'Glänzender Diamant-Rahmen für dein Profil', 10000, 'avatar_frame', '{"border": "diamond"}'),
('VIP Badge', 'Exklusives VIP Abzeichen', 15000, 'badge', '{"icon": "crown"}'),
('Neon Theme', 'Cooles Neon-Farbschema', 7500, 'theme', '{"primary": "#00FF00", "accent": "#FF00FF"}'),
('Feuer Effekt', 'Flammeneffekt für Gewinne', 20000, 'effect', '{"type": "fire"}');

-- Add constraint to prevent negative coins
ALTER TABLE public.profiles 
ADD CONSTRAINT coins_non_negative CHECK (coins >= 0);