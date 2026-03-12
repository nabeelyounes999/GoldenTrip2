-- =====================================================
-- Golden Trip – Supabase Migration
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lfzumrxprnyakxtulqrx/sql
-- =====================================================

-- ─── DESTINATIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS destinations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  country     text NOT NULL,
  image       text,
  price       numeric NOT NULL DEFAULT 0,
  duration    text,
  description text,
  featured    boolean DEFAULT false,
  location    text,
  group_size  text,
  rating      numeric DEFAULT 5.0,
  features    jsonb DEFAULT '[]'::jsonb,
  itinerary   jsonb DEFAULT '[]'::jsonb,
  reviews     jsonb DEFAULT '[]'::jsonb,
  created_at  timestamptz DEFAULT now()
);

-- ─── PACKAGES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  destination_id text,
  price          numeric NOT NULL DEFAULT 0,
  duration       text,
  group_size     text,
  location       text,
  rating         numeric DEFAULT 5.0,
  features       jsonb DEFAULT '[]'::jsonb,
  description    text,
  itinerary      jsonb DEFAULT '[]'::jsonb,
  images         jsonb DEFAULT '[]'::jsonb,
  reviews        jsonb DEFAULT '[]'::jsonb,
  created_at     timestamptz DEFAULT now()
);

-- ─── VISAS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visas (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country          text NOT NULL,
  processing_time  text,
  validity_period  text,
  entry_type       text,
  price            numeric DEFAULT 0,
  application_fee  numeric DEFAULT 0,
  requirements     jsonb DEFAULT '[]'::jsonb,
  description      text,
  created_at       timestamptz DEFAULT now()
);

-- ─── BOOKINGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  destination text,
  check_in    text,
  check_out   text,
  guests      integer DEFAULT 1,
  price       numeric DEFAULT 0,
  status      text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at  timestamptz DEFAULT now()
);

-- ─── MESSAGES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text,
  status     text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

-- ─── TESTIMONIALS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name     text NOT NULL,
  image    text,
  rating   numeric DEFAULT 5,
  comment  text,
  location text,
  created_at timestamptz DEFAULT now()
);

-- ─── JOBS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  department   text,
  location     text,
  type         text,
  description  text,
  requirements jsonb DEFAULT '[]'::jsonb,
  posted       text,
  created_at   timestamptz DEFAULT now()
);

-- ─── FEATURES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS features (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  icon        text,
  created_at  timestamptz DEFAULT now()
);

-- ─── SETTINGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text UNIQUE NOT NULL,
  value      text,
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Using open policies since admin auth is mocked
-- =====================================================
ALTER TABLE destinations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE features      ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings      ENABLE ROW LEVEL SECURITY;

-- Allow full access via anon key (admin uses localStorage auth, not Supabase auth)
CREATE POLICY "open_access" ON destinations  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON packages      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON visas         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON bookings      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON messages      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON testimonials  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON jobs          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON features      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON settings      FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- SEED DATA – Destinations
-- =====================================================
INSERT INTO destinations (name, country, image, price, duration, description, featured, location, group_size, rating, features, itinerary, reviews) VALUES
('Paris', 'France',
 'https://images.unsplash.com/photo-1642947392578-b37fbd9a4d45?w=1080',
 1299, '7 Days',
 'Experience the romantic city of lights with iconic landmarks, world-class cuisine, and timeless art.',
 true, 'Paris, France', '2-10 People', 5.0,
 '["Round-trip flights","Luxury hotel accommodation","Daily breakfast","Guided tours"]',
 '[{"day":1,"title":"Arrival & Check-in","activities":["Airport pickup","Hotel check-in","Welcome dinner"]},{"day":2,"title":"City Tour","activities":["Eiffel Tower visit","Seine River cruise"]}]',
 '[{"id":"1","name":"Sarah Johnson","rating":5,"comment":"Amazing experience!","date":"2026-02-15"}]'),

('Maldives', 'Maldives',
 'https://images.unsplash.com/photo-1699019493395-8a1f0c7883a9?w=1080',
 2499, '5 Days',
 'Luxury island paradise with crystal-clear waters, pristine beaches, and overwater villas.',
 true, 'Maldives', '2-4 People', 4.9,
 '["Overwater villa","Seaplane transfers","All-inclusive meals","Snorkeling tour"]',
 '[{"day":1,"title":"Arrival","activities":["Seaplane transfer","Sunset dinner"]}]',
 '[]'),

('Dubai', 'UAE',
 'https://images.unsplash.com/photo-1651063820152-d3e7a27b4d2b?w=1080',
 1899, '6 Days',
 'Modern metropolis blending luxury shopping, ultramodern architecture, and desert adventures.',
 true, 'Dubai, UAE', '2-12 People', 4.8,
 '["Luxury hotel","Burj Khalifa tickets","Desert safari","Museum of the Future"]',
 '[{"day":1,"title":"Arrival","activities":["Hotel check-in","Dubai Mall visit"]}]',
 '[]'),

('Tokyo', 'Japan',
 'https://images.unsplash.com/photo-1723708489553-655d04168d39?w=1080',
 1699, '8 Days',
 'Discover ancient temples, cutting-edge technology, and exquisite cuisine in Japan''s capital.',
 true, 'Tokyo, Japan', '2-8 People', 4.8,
 '["Luxury hotel","Private guide","Traditional dinner","Mt. Fuji tour"]',
 '[{"day":1,"title":"Arrival","activities":["Narita pickup","Shibuya crossing check"]}]',
 '[]'),

('Santorini', 'Greece',
 'https://images.unsplash.com/photo-1671760085670-2be5869f38dd?w=1080',
 1499, '6 Days',
 'Stunning white-washed villages, blue-domed churches, and spectacular sunsets over the Aegean.',
 true, 'Santorini, Greece', '2-8 People', 4.9,
 '["Luxury hotel","Wine tasting","Caldera cruise","Sunset viewing"]',
 '[{"day":1,"title":"Arrival","activities":["Hotel check-in","Oia village walk"]}]',
 '[]'),

('New York', 'USA',
 'https://images.unsplash.com/photo-1655845836463-facb2826510b?w=1080',
 1399, '5 Days',
 'The city that never sleeps, filled with iconic landmarks, Broadway shows, and diverse culture.',
 false, 'New York, USA', '2-10 People', 4.7,
 '["Hotel accommodation","Times Square tour","Statue of Liberty","Broadway show"]',
 '[{"day":1,"title":"Arrival","activities":["JFK transfer","Manhattan orientation"]}]',
 '[]'),

('Bali', 'Indonesia',
 'https://images.unsplash.com/photo-1656247203824-3d6f99461ba4?w=1080',
 999, '7 Days',
 'Tropical paradise with lush rice terraces, ancient temples, and beautiful beaches.',
 false, 'Bali, Indonesia', '2-8 People', 4.7,
 '["Resort accommodation","Temple tours","Rice terrace walk","Beach day"]',
 '[{"day":1,"title":"Arrival","activities":["Airport pickup","Welcome ceremony"]}]',
 '[]'),

('Swiss Alps', 'Switzerland',
 'https://images.unsplash.com/photo-1705081242921-7ac750a0f8f6?w=1080',
 2199, '8 Days',
 'Breathtaking mountain scenery, charming villages, and world-class skiing resorts.',
 false, 'Switzerland', '2-8 People', 4.8,
 '["Luxury chalet","Ski passes","Mountain train","Fondue dinner"]',
 '[{"day":1,"title":"Arrival","activities":["Zurich pickup","Alpine village tour"]}]',
 '[]'),

('Iceland', 'Iceland',
 'https://images.unsplash.com/photo-1681834418277-b01c30279693?w=1080',
 1799, '6 Days',
 'Land of fire and ice with stunning waterfalls, geysers, and Northern Lights.',
 false, 'Iceland', '2-8 People', 4.9,
 '["Hotel & cabin stays","Northern Lights tour","Geysir visit","Golden Circle"]',
 '[{"day":1,"title":"Arrival","activities":["Reykjavik transfer","Blue Lagoon"]}]',
 '[]'),

('Barcelona', 'Spain',
 'https://images.unsplash.com/photo-1660855562147-2f2eab48c0c7?w=1080',
 1199, '6 Days',
 'Vibrant city with Gaudí architecture, Mediterranean beaches, and rich cultural heritage.',
 false, 'Barcelona, Spain', '2-10 People', 4.7,
 '["Hotel accommodation","Sagrada Familia","Park Güell","Barceloneta beach"]',
 '[{"day":1,"title":"Arrival","activities":["Airport transfer","Las Ramblas walk"]}]',
 '[]'),

('Phuket', 'Thailand',
 'https://images.unsplash.com/flagged/photo-1575834678162-9fd77151f40b?w=1080',
 899, '7 Days',
 'Tropical beaches, vibrant nightlife, and rich Thai culture at affordable prices.',
 false, 'Phuket, Thailand', '2-8 People', 4.6,
 '["Beach resort","Island hopping","Thai cooking class","Snorkeling"]',
 '[{"day":1,"title":"Arrival","activities":["Airport pickup","Patong Beach"]}]',
 '[]'),

('Rome', 'Italy',
 'https://images.unsplash.com/photo-1662898290891-a6c7f022e851?w=1080',
 1099, '6 Days',
 'Ancient wonders, Renaissance art, and authentic Italian cuisine in the Eternal City.',
 false, 'Rome, Italy', '2-10 People', 4.8,
 '["Hotel accommodation","Colosseum skip-line","Vatican tour","Trevi Fountain"]',
 '[{"day":1,"title":"Arrival","activities":["FCO transfer","Trastevere dinner"]}]',
 '[]');

-- =====================================================
-- SEED DATA – Testimonials
-- =====================================================
INSERT INTO testimonials (name, image, rating, comment, location) VALUES
('Sarah Johnson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', 5,
 'Absolutely fantastic service! GoldenTrip handled everything from visas to bookings. The trip to Paris was unforgettable!',
 'Amman, Jordan'),
('Ahmed Al-Rashid', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 5,
 'Best travel agency in Jordan! They organized our family trip to Maldives perfectly. The visa process was smooth and hassle-free.',
 'Amman, Jordan'),
('Layla Hassan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 5,
 'Had an amazing honeymoon in Santorini thanks to GoldenTrip! From the initial consultation to returning home, everything was seamless.',
 'Amman, Jordan'),
('Mohammed Khalil', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 5,
 'Very professional and reliable! GoldenTrip helped us with Dubai visa and tour packages. Great prices and excellent communication.',
 'Amman, Jordan'),
('Noor Abdullah', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', 5,
 'I cannot thank GoldenTrip enough for making our European tour so smooth! They handled all our Schengen visas professionally.',
 'Amman, Jordan'),
('Omar Mansour', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', 5,
 'Excellent experience with GoldenTrip! Booked a business trip to New York and they handled everything efficiently.',
 'Amman, Jordan');

-- =====================================================
-- SEED DATA – Jobs
-- =====================================================
INSERT INTO jobs (title, department, location, type, description, requirements, posted) VALUES
('Senior Travel Consultant', 'Sales', 'Amman, Jordan', 'Full-time',
 'Join our team as a Senior Travel Consultant and help create unforgettable experiences for our clients.',
 '["5+ years experience in travel industry","Excellent communication skills","Knowledge of global destinations","Customer service expertise"]',
 '2026-02-28'),
('Digital Marketing Manager', 'Marketing', 'Remote', 'Full-time',
 'Lead our digital marketing efforts to expand GoldenTrip''s reach globally.',
 '["3+ years in digital marketing","SEO and SEM expertise","Social media management","Analytics proficiency"]',
 '2026-02-25'),
('Customer Support Specialist', 'Customer Service', 'Amman, Jordan', 'Full-time',
 'Provide world-class support to our valued customers.',
 '["2+ years customer service","Multilingual preferred","Problem-solving skills","Travel industry knowledge"]',
 '2026-02-20');

-- =====================================================
-- SEED DATA – Features (Home page Why Choose Us)
-- =====================================================
INSERT INTO features (title, description, icon) VALUES
('Best Prices', 'Competitive rates and exclusive deals', 'DollarSign'),
('24/7 Support', 'Round-the-clock customer assistance', 'Headphones'),
('Trusted by Thousands', 'Join our satisfied travelers worldwide', 'Users'),
('Secure Payment', 'Safe and encrypted transactions', 'Shield');

-- =====================================================
-- SEED DATA – Visas
-- =====================================================
INSERT INTO visas (country, processing_time, validity_period, entry_type, price, application_fee, requirements, description) VALUES
('UAE', '2-3 Days', '30 Days', 'Single Entry', 150, 150,
 '["Passport Copy","Passport-size Photo","Return Ticket","Hotel Booking"]',
 'Perfect for short business trips or tourism to the UAE.'),
('Schengen', '15-20 Days', '90 Days', 'Multiple Entry', 300, 300,
 '["Valid Passport","Passport-size Photos","Bank Statement","Travel Insurance","Hotel Bookings","Flight Itinerary"]',
 'Explore the beauty of Europe with ease. Valid for 26 Schengen countries.'),
('Turkey', '1-3 Days', '30 Days', 'Single Entry', 80, 80,
 '["Passport Copy","Photo","Return Ticket"]',
 'Easy e-visa for tourism and short stays in Turkey.'),
('USA', '30-60 Days', '10 Years', 'Multiple Entry', 500, 185,
 '["DS-160 Form","Valid Passport","Bank Statements","Employment Letter","Interview Appointment"]',
 'B1/B2 tourist and business visa for the United States.'),
('UK', '15-20 Days', '6 Months', 'Multiple Entry', 450, 115,
 '["Valid Passport","Financial Proof","Employment Letter","Travel Itinerary","Accommodation Proof"]',
 'Standard visitor visa for tourism and business in the United Kingdom.');

-- =====================================================
-- SEED DATA – Default Settings
-- =====================================================
INSERT INTO settings (key, value) VALUES
('firstName', 'Thabet'),
('lastName', ''),
('email', 'admin@goldentrip.com'),
('siteName', 'Golden Trip'),
('supportEmail', 'support@goldentrip.com'),
('currency', 'JOD (JD)'),
('timezone', 'UTC+03:00 Amman'),
('contactInfo', '{"address":"Al-Arab St., ABUNSEER 00962 Amman, Jordan","phone":"+962 79 804 6662","email":"info@goldentrip.com"}')
ON CONFLICT (key) DO NOTHING;
