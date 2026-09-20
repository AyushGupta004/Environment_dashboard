ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS organizations_user_id_idx ON public.organizations(user_id);

