-- =====================================================
-- Golden Trip – Fix Missing Tables
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lfzumrxprnyakxtulqrx/sql
-- =====================================================

-- ─── TEAM MEMBERS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text NOT NULL,
  image       text,
  bio         text,
  socials     jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop policy if it already exists (avoids error on re-run)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'open_access') THEN
    DROP POLICY "open_access" ON team_members;
  END IF;
END $$;

CREATE POLICY "open_access" ON team_members FOR ALL USING (true) WITH CHECK (true);

-- Seed one team member if empty
INSERT INTO team_members (name, role, image, bio, socials)
SELECT 'Thabet', 'Founder & CEO',
       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
       'Passionate about creating unforgettable travel experiences.',
       '{"facebook": "#", "instagram": "#", "whatsapp": "#"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);

-- ─── APPLICATIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       uuid REFERENCES jobs(id) ON DELETE CASCADE,
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text NOT NULL,
  resume_url   text NOT NULL,
  cover_letter text,
  status       text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'open_access') THEN
    DROP POLICY "open_access" ON applications;
  END IF;
END $$;

CREATE POLICY "open_access" ON applications FOR ALL USING (true) WITH CHECK (true);

-- ─── RESUMES STORAGE BUCKET ─────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read for resumes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Resume Read') THEN
    CREATE POLICY "Public Resume Read" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
  END IF;
END $$;

-- Allow inserts to resumes bucket  
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Resume Upload') THEN
    CREATE POLICY "Public Resume Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
  END IF;
END $$;
