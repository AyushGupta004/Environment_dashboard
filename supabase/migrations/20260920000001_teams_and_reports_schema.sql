CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS member_count INTEGER;

UPDATE public.organizations
   SET member_count = 1
 WHERE member_count IS NULL;

ALTER TABLE public.organizations ALTER COLUMN member_count SET DEFAULT 1;
ALTER TABLE public.organizations ALTER COLUMN member_count SET NOT NULL;

DO $$ BEGIN
  BEGIN
    ALTER TABLE public.organizations ADD CONSTRAINT organizations_member_count_chk
      CHECK (member_count BETWEEN 1 AND 10000);
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

CREATE SEQUENCE IF NOT EXISTS public.organizations_team_seq START 1001;

ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS team_code TEXT;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.organizations WHERE team_code IS NULL ORDER BY created_at, id LOOP
    UPDATE public.organizations
       SET team_code = 'TM-' || nextval('public.organizations_team_seq')::TEXT
     WHERE id = r.id;
  END LOOP;
END $$;

ALTER TABLE public.organizations
  ALTER COLUMN team_code SET DEFAULT ('TM-' || nextval('public.organizations_team_seq')::TEXT);

CREATE OR REPLACE FUNCTION public.set_organization_team_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.team_code IS NULL OR TRIM(NEW.team_code) = '' THEN
    NEW.team_code := 'TM-' || nextval('public.organizations_team_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_organization_team_code ON public.organizations;
CREATE TRIGGER trg_set_organization_team_code
  BEFORE INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_team_code();

ALTER TABLE public.organizations ALTER COLUMN team_code SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS organizations_team_code_uidx ON public.organizations (team_code);

GRANT USAGE, SELECT ON SEQUENCE public.organizations_team_seq TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.organizations_lock_team_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.team_code IS DISTINCT FROM OLD.team_code THEN
    RAISE EXCEPTION 'team_code is immutable';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_organizations_lock_team_code ON public.organizations;
CREATE TRIGGER trg_organizations_lock_team_code
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.organizations_lock_team_code();

CREATE UNIQUE INDEX IF NOT EXISTS organizations_name_lower_uidx ON public.organizations (LOWER(TRIM(name)));

DO $$ BEGIN
  BEGIN
    ALTER TABLE public.organizations ADD CONSTRAINT organizations_name_unique UNIQUE (name);
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

ALTER TABLE public.organizations ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS organization_id UUID;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.reports'::regclass AND conname = 'reports_organization_id_fkey'
  ) THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS assigned_priority TEXT,
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$ BEGIN
  BEGIN
    ALTER TABLE public.reports ADD CONSTRAINT reports_assigned_priority_chk
      CHECK (assigned_priority IS NULL OR assigned_priority IN ('High', 'Medium', 'Low'));
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_status_check;
ALTER TABLE public.reports ADD CONSTRAINT reports_status_check
  CHECK (status IN ('reported', 'ai_analyzed', 'under_review', 'verified', 'action_initiated', 'resolved', 'rejected'));

CREATE OR REPLACE FUNCTION public.prevent_citizen_protected_field_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN

  IF auth.uid() IS NULL
     OR EXISTS (SELECT 1 FROM public.organization_members WHERE user_id = auth.uid()) THEN
    RETURN NEW;
  END IF;

  NEW.status             := OLD.status;
  NEW.severity           := OLD.severity;
  NEW.assigned_worker_id := OLD.assigned_worker_id;
  NEW.ai_category        := OLD.ai_category;
  NEW.ai_confidence      := OLD.ai_confidence;
  NEW.ai_description     := OLD.ai_description;
  NEW.organization_id    := OLD.organization_id;
  NEW.assigned_priority  := OLD.assigned_priority;
  NEW.due_date           := OLD.due_date;
  NEW.assigned_at        := OLD.assigned_at;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_citizen_protected_fields ON public.reports;
CREATE TRIGGER enforce_citizen_protected_fields
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_citizen_protected_field_update();

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon select organizations" ON public.organizations;
CREATE POLICY "Allow anon select organizations"
  ON public.organizations FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert organizations" ON public.organizations;
CREATE POLICY "Allow anon insert organizations"
  ON public.organizations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update organizations" ON public.organizations;
CREATE POLICY "Allow anon update organizations"
  ON public.organizations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon select reports" ON public.reports;
CREATE POLICY "Allow anon select reports"
  ON public.reports FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon update reports" ON public.reports;
CREATE POLICY "Allow anon update reports"
  ON public.reports FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.reports; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.organizations; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

NOTIFY pgrst, 'reload schema';

