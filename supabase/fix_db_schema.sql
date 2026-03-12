-- =====================================================
-- Golden Trip – Fix Missing Tables & RLS Policies
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lfzumrxprnyakxtulqrx/sql
-- =====================================================

-- 1. Create TEAM MEMBERS table if missing
CREATE TABLE IF NOT EXISTS team_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text NOT NULL,
  image       text,
  bio         text,
  socials     jsonb DEFAULT '{"facebook": "", "instagram": "", "whatsapp": ""}'::jsonb,
  created_at  timestamptz DEFAULT now()
);

-- 2. Create BLOGS table if missing
CREATE TABLE IF NOT EXISTS blogs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  excerpt     text,
  content     text,
  image       text,
  category    text DEFAULT 'Travel',
  author      text DEFAULT 'Admin',
  date        text,
  read_time   text DEFAULT '5 min read',
  tags        jsonb DEFAULT '[]'::jsonb,
  created_at  timestamptz DEFAULT now()
);

-- 3. Ensure RLS is enabled for all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE features     ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;

-- 4. Create Open Access Policies (Mock Admin usage)
-- This allows CRUD operations via the anon/public key since auth is handled locally
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "open_access" ON %I', t);
    EXECUTE format('CREATE POLICY "open_access" ON %I FOR ALL USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- 5. Seed default team members if empty
INSERT INTO team_members (name, role, image, bio, socials)
SELECT 'Thabet', 'Founder & CEO', 
       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
       'Passionate about creating unforgettable travel experiences.',
       '{"facebook": "#", "instagram": "#", "whatsapp": "#"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);

-- 6. Add default blog if empty
INSERT INTO blogs (title, slug, excerpt, content, image, date)
SELECT 'Discover Jordan: The Hidden Gems', 'discover-jordan',
       'Explore the ancient wonders and modern beauty of Jordan...',
       'Jordan is a land of mesmerizing beauty and ancient history...',
       'https://images.unsplash.com/photo-1549110667-0c7f1f07da85?w=1080',
       '2024-03-12'
WHERE NOT EXISTS (SELECT 1 FROM blogs LIMIT 1);
