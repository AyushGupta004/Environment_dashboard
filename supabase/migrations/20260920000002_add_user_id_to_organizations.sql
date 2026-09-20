-- Migration: Add user_id column to public.organizations to link Supabase Auth users to organizations
-- This allows organizations to be queried using: public.organizations.user_id = user.id

ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS organizations_user_id_idx ON public.organizations(user_id);
