CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE testimonial_wing AS ENUM ('general', 'sacred');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  vibe_text text NOT NULL,
  hero_video_url text,
  hero_video_key text,
  hero_poster_url text,
  hero_poster_key text,
  card_image_url text,
  card_image_key text,
  map_embed_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS states_slug_idx ON states (slug);
CREATE INDEX IF NOT EXISTS states_active_idx ON states (is_active, display_order);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  vibe_text text NOT NULL,
  hero_video_url text,
  hero_video_key text,
  hero_poster_url text,
  hero_poster_key text,
  card_image_url text,
  card_image_key text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories (slug);
CREATE INDEX IF NOT EXISTS categories_active_idx ON categories (is_active, display_order);

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  duration_days integer NOT NULL,
  state_id uuid NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  status content_status NOT NULL DEFAULT 'draft',
  starting_location text NOT NULL,
  ending_location text NOT NULL,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
  activity_table jsonb NOT NULL DEFAULT '[]'::jsonb,
  inclusions text NOT NULL,
  exclusions text NOT NULL,
  payment_terms text NOT NULL,
  cancellation_policy text NOT NULL,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  traveller_responsibility text NOT NULL,
  map_embed_url text,
  featured boolean NOT NULL DEFAULT false,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS packages_slug_idx ON packages (slug);
CREATE INDEX IF NOT EXISTS packages_public_idx ON packages (status, featured);
CREATE INDEX IF NOT EXISTS packages_state_idx ON packages (state_id, status);
CREATE INDEX IF NOT EXISTS packages_category_idx ON packages (category_id, status);

CREATE TABLE IF NOT EXISTS package_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  url text NOT NULL,
  r2_key text NOT NULL,
  alt_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT 'image/webp',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT package_images_webp_only CHECK (mime_type = 'image/webp')
);

CREATE INDEX IF NOT EXISTS package_images_package_idx ON package_images (package_id, sort_order);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wing testimonial_wing NOT NULL DEFAULT 'general',
  reviewer_name text NOT NULL,
  role_or_location text NOT NULL,
  quote text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  image_url text,
  image_key text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hall_of_fame (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuing_body text NOT NULL,
  award_year integer NOT NULL,
  description text NOT NULL,
  image_url text,
  image_key text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text NOT NULL,
  body text NOT NULL,
  author text NOT NULL,
  cover_image_url text,
  cover_image_key text,
  status content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_public_idx ON blog_posts (status, published_at);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_info text NOT NULL,
  email text NOT NULL,
  service_type text NOT NULL,
  query text NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS homepage_content (
  id text PRIMARY KEY DEFAULT 'homepage',
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  hero_video_url text,
  hero_video_key text,
  hero_poster_url text,
  hero_poster_key text,
  motto_title text NOT NULL,
  motto_body text NOT NULL,
  about_title text NOT NULL,
  about_body text NOT NULL,
  about_image_one_url text,
  about_image_one_key text,
  about_image_two_url text,
  about_image_two_key text,
  about_image_three_url text,
  about_image_three_key text,
  services_title text NOT NULL,
  featured_packages_title text NOT NULL,
  testimonials_title text NOT NULL,
  hall_of_fame_title text NOT NULL,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS professional_services_content (
  id text PRIMARY KEY DEFAULT 'professional-services',
  title text NOT NULL,
  description text NOT NULL,
  image_one_url text,
  image_one_key text,
  image_two_url text,
  image_two_key text,
  cta_label text NOT NULL,
  cta_href text NOT NULL,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sacred_wing_content (
  id text PRIMARY KEY DEFAULT 'sacred',
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  hero_video_url text,
  hero_video_key text,
  hero_poster_url text,
  hero_poster_key text,
  services_title text NOT NULL,
  services_description text NOT NULL,
  expertise_title text NOT NULL,
  expertise_description text NOT NULL,
  contact_title text NOT NULL,
  contact_body text NOT NULL,
  cta_label text NOT NULL,
  cta_href text NOT NULL,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'site',
  about_title text NOT NULL,
  about_body text NOT NULL,
  office_address text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  instagram_url text,
  facebook_url text,
  linkedin_url text,
  youtube_url text,
  footer_note text NOT NULL,
  seo_meta_title text,
  seo_meta_description text,
  seo_meta_link text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
